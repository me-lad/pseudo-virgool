//! This module handles getting categories list and category data from api
import axios from "axios";
import { baseApi } from "../../Utils/options";
import { CategoryRenderServices } from "./CategoryRenderServices";
import { Toast } from "../../Utils/Toast.js";

class CategoryServices {
  constructor() {
    this.categoriesData = null;
  }
  async getCategories() {
    try {
      if (this.categoriesData) {
        return this.categoriesData;
      }
      const { data: result } = await axios.get(`${baseApi}/category`);
      this.categoriesData = result.map((category) => new CategoryRenderServices(category));
      return this.categoriesData;
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    }
  }

  getSelectedCategory(tagId) {
    return axios.get(`${baseApi}/category/${tagId}`);
  }

  findCategory(id) {
    return this.categoriesData.find((category) => category.id == id);
  }
}

export { CategoryServices };
