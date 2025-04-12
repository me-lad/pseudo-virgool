//! This module handles the post submit request to the API
import axios from "axios";
import { baseApi } from "../../Utils/options";
import { Loading } from "../../Utils/Loading";
import { App } from "../../App.js";
import { Toast } from "../../Utils/Toast";

class PostSubmitServices {
  constructor() {
    //! Variables
    this.postTitle = document.querySelector(".post__title");
    this.postDescription;
    this.categoryWrapper = document.getElementById("category-post");
    this.postTimeRead = document.getElementById("rangeInput");
    this.postTagsWrapper = document.querySelector(".tags-block-list");
    this.postImageInput = document.getElementById("file-input");
    this.submitButton = document.getElementById("submit-post");
    this.tags;

    //! Set events
    this.submitButton.onclick = this.submit.bind(this);
  }

  async submit(event) {
    event.preventDefault();
    try {
      //! Show loading
      Loading.show();

      //! Get ck editor and tags
      this.postDescription = document.querySelector(".ck-content");
      this.tags = Array.from(this.postTagsWrapper.children).map((tag) => tag.textContent.slice(0, -1));

      //! Send request and check result
      const { data: result } = await this.fetch();
      if (result.status == "ok") {
        App.getRouter().navigateToRoute("profile", false);
        new Toast("پست با موفقیت ایجاد شد.", "success");
      } else {
        new Toast("فرایند ایجاد پست با خطا مواجه شد. لطفا تمامی فیلد های خواسته شده را کامل کنید.", "error");
      }
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  fetch() {
    const formdata = new FormData();
    formdata.append("title", this.postTitle.value);
    formdata.append("description", this.postDescription.innerHTML);
    formdata.append("categoryId", this.categoryWrapper.selectedOptions[0].value);
    formdata.append("tags", this.tags);
    formdata.append("timeread", this.postTimeRead.value);
    if (this.postImageInput.files[0]) {
      formdata.append("image", this.postImageInput.files[0], this.postImageInput.value);
    }
    return axios.post(`${baseApi}/quotes`, formdata);
  }
}

export { PostSubmitServices };
