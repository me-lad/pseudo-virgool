//! This module handles the post page publish validation (before submit)
class PostPublishValidation {
  constructor() {
    //! Variables
    this.postTitle = document.querySelector(".post__title");
    this.publishButton = document.getElementById("published");
    this.errorsContainer = document.getElementById("error-published");
    this.postSettingMenu = document.querySelector(".prev-post");
    this.closeSettingButton = document.getElementById("close-setting");

    //! Set events
    this.publishButton.onclick = this.validate.bind(this);
  }

  validate() {
    this.errorsContainer.textContent = "";
    this.checkTitle();
  }

  checkTitle() {
    !this.postTitle.value.trim()
      ? (this.errorsContainer.textContent = "لطفا یک عنوان برای پست خود وارد کنید.")
      : this.postSettingMenuhandler();
  }

  postSettingMenuhandler() {
    this.postSettingMenu.classList.remove("hidden");
    this.closeSettingButton.onclick = () => this.postSettingMenu.classList.add("hidden");
  }
}

export { PostPublishValidation };
