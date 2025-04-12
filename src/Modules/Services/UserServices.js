//! This module handles getting user data and user published posts
import axios from "axios";
import { baseApi } from "../Utils/options";
import { PostRenderServices } from "./PostServices/PostRenderServices";
import { Toast } from "../Utils/Toast";

class UserServices {
  constructor() {
    this.postsData;
  }

  async getUserData(userId) {
    try {
      const { data: result } = await axios.get(`${baseApi}/quotes/user/${userId}`);
      if (result.length) {
        const { data: result } = await this.fetch(userId);
        return result;
      }
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    }
  }

  fetch(id) {
    const formdata = new FormData();
    formdata.append("id", id);
    return axios.post(`${baseApi}/userid`, formdata);
  }

  async getUserPosts(userId) {
    try {
      const { data: result } = await axios.get(`${baseApi}/quotes/user/${userId}`);
      if (result.length) {
        this.postsData = result.map((post) => new PostRenderServices(post, "user"));
        return this.postsData;
      }
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    }
  }
}

export { UserServices };
