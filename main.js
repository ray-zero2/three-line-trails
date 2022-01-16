import WebGLContent from "./script/WebGLContent";

class Main {
  constructor() {
    const canvas = document.querySelector('#canvas');
    this.glContent = new WebGLContent(canvas);
    this.bind();
  }

  bind() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    this.glContent.resize(window.innerWidth, window.innerHeight);
  }
}

new Main();
