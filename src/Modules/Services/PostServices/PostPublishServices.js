//! This module handles the already submited post changes (publish, delete, update, ...)
import axios from "axios";
import { baseApi } from "../../Utils/options";
import { App } from "../../App.js";
import { Toast } from "../../Utils/Toast";
import { Loading } from "../../Utils/Loading";

class PostPublishServices {
  publish() {
    const publishButton = document.querySelector(".publish-post"),
      postId = publishButton.getAttribute("data-post-id");

    publishButton.onclick = this.update.bind(this, postId);
  }

  async update(id) {
    try {
      //! Show loading
      Loading.show();

      //! Send request and Check response
      const result = await axios.put(`${baseApi}/quotes/${id}`);

      if (result.status == 200) {
        this.resetPostsData();
        App.getRouter().navigateToRoute("profile", false);
        new Toast("پست با موفقیت منتشر شد.", "success");
      } else {
        new Toast("انتشار پست با خطا مواجه شد", "error");
      }
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  remove() {
    const removeButtons = document.querySelectorAll(".delete-post");
    if (removeButtons.length) {
      removeButtons.forEach((btn) => {
        const postId = btn.getAttribute("data-select-id");
        btn.onclick = this.delete.bind(this, postId);
      });
    }
  }

  async delete(id) {
    try {
      //! Show loading
      Loading.show();

      const userConfirm = confirm("آیا از حذف پست اطمینان دارید؟");
      if (!userConfirm) {
        return;
      }

      const { data: result } = await axios.delete(`${baseApi}/quotes/${id}`);
      if (result.status == "OK") {
        this.resetPostsData();
        App.getRouter().navigateToRoute("home", false);
        new Toast("پست با موفقیت حذف شد.", "success");
      } else {
        new Toast("عملیات حذف پست با خطا مواجه شد.", "error");
      }
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  resetPostsData() {
    App.getPostServices().clearData();
    App.getProfileServices().clearData();
  }
}

export { PostPublishServices };
