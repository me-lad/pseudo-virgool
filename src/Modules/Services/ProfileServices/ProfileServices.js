//! This module handles getting the user posts to show in the profile page
import axios from "axios";
import { ProfileRenderServices } from "./ProfileRenderServices";
import { baseApi } from "../../Utils/options";
import { Loading } from "../../Utils/Loading";
import { App } from "../../App";
import { Toast } from "../../Utils/Toast";

class ProfileServices {
  constructor() {
    this.postsData = null;
  }

  async getPosts() {
    try {
      //! Show loading
      Loading.show();
      if (this.postsData) {
        return this.postsData;
      }

      //! Send request and check result
      const { data: result } = await axios.get(`${baseApi}/myquotes`);
      if (result.status == "success") {
        this.postsData = result.quotes.map((post) => new ProfileRenderServices(post));
      }

      return this.postsData;
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  clearData() {
    this.postsData = null;
  }

  findPost(postId) {
    this.getPosts();
    if (this.postsData) {
      return this.postsData.find((post) => post.id == postId);
    }
  }

  updateUserName(nameBox) {
    nameBox.textContent = App.getAuthorizationServices().name || localStorage.getItem("name");
  }
}

export { ProfileServices };
