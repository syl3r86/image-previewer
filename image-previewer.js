class ImagePreviewer extends Application {
    
    static get defaultOptions() {
        this.imageUrl = '';
        const options = super.defaultOptions;
        options.template = "modules/image-previewer/template.html";
        options.width = 200;
        options.height = 200;
        options.classes = ['image-previewer'];
        return options;
    }

    getData() {
        return { preview: this.imageUrl}
    }

    showPreview(imageUrl, previewPos) {
        this.imageUrl = imageUrl;
        this._render(true);
        this.position.top = previewPos.y;
        this.position.left = previewPos.x;
        // this.shortTimeout;  used to close preview when unhover
        // this.longTimeout;   used to close preview after 2 seconds

        // prevent shortTimeout to close the preview since another previewable item was hovered
        if (this.shortTimeout !== undefined) clearTimeout(this.shortTimeout)

        // start a new longTimeout to close the preview after too long idle time
        if (this.longTimeout !== undefined)  clearTimeout(this.longTimeout);
        this.longTimeout = window.setTimeout(() => { this.close(); }, 2000);
    }

    hoverOff() {
        // closing the current preview after a short grace period
        this.shortTimeout = window.setTimeout(() => {
            this.close();
        }, 100);
    }
}

Hooks.on('renderFilePicker', (app, html, data) => {
    let imagePreviewer = new ImagePreviewer();
    html.find('.file').hover(ev => {
        // get new position for the previewer
        let elementBox = ev.target.getBoundingClientRect()
        let previewPos = {
            x: elementBox.x + elementBox.width,
            y: elementBox.y
        }
        // get the proper image path
        let path = html.find('.current-dir input').val().replace('Data', '') + '/' + ev.target.dataset.path;
        let fileExtension = path.split('.')[path.split('.').length - 1].toLowerCase();
        if (['png', 'jpg'].includes(fileExtension)) {
            imagePreviewer.showPreview(path, previewPos);
        }
    }, ev => {
        imagePreviewer.hoverOff();
    });
});