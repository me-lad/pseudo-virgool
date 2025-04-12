//! This module handles getting posts from api
import axios from "axios";
import { baseApi } from "../../Utils/options";
import { PostRenderServices } from "./PostRenderServices";
import { Toast } from "../../Utils/Toast";

class PostServices {
  constructor() {
    this.postsData = null;
  }

  async getPosts() {
    try {
      if (this.postsData) {
        return this.postsData;
      }
      const { data: result } = await axios.get(`${baseApi}/quotes`);
      if (result.length) {
        this.postsData = result.map((post) => new PostRenderServices(post));
      }
      return this.postsData;
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
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
}

export { PostServices };
