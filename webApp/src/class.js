class Loader {
    constructor(target, version) {
        this.target = target;
        this.content = target.innerHTML;
        this.loader = `<div class="loader loader-${version}"></div>`;
        this.disabled = false;
    }

    on() {
        this.content = this.target.innerHTML;
        this.target.innerHTML = this.loader;
        this.disabled = true;
    }

    off() {
        this.target.innerHTML = this.content;
        this.disabled = false;
    }
}

export { Loader };
