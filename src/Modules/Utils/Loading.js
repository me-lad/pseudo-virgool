class Loading {
  static show() {
    document.querySelector(".loading-container").setAttribute("data-show", "true");
  }
  static hide() {
    document.querySelector(".loading-container").setAttribute("data-show", "false");
  }
}

export { Loading };
