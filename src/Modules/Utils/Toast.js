class Toast {
  constructor(message, toastType, toastDuration = 2500) {
    this.message = message;
    this.toastContainer = document.getElementById("toastMessage");
    this.toastDuration = toastDuration;
    this.createToast(toastType);
  }

  createToast(toastType) {
    const toastElm = document.createElement("div");
    toastElm.className = "Toast";
    toastElm.textContent = this.message;
    toastType == "error" ? toastElm.setAttribute("id", "delToast") : toastElm.setAttribute("id", "addToast");

    this.showToast(toastElm);
  }

  showToast(toastElm) {
    if (this.toastContainer.children.length > 1) {
      return;
    }
    this.toastContainer.appendChild(toastElm);
    this.removeToast(toastElm);
  }

  removeToast(toastElm) {
    setTimeout(() => {
      toastElm.remove();
    }, this.toastDuration);
  }
}

export { Toast };
