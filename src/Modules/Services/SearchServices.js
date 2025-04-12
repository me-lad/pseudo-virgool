//! This module handles everything related to the header search input (searching process, recommending by previous searches, ...)
import axios from "axios";
import { baseApi } from "../Utils/options.js";
import { App } from "../App.js";
import { Loading } from "../Utils/Loading.js";
import { Toast } from "../Utils/Toast.js";

class SearchServices {
  constructor() {
    this.input = document.getElementById("search");
    this.confirmBtn = document.getElementById("confirm_search");
    this.recommendList = document.getElementById("search-list");
    this.previousQueryStrings = [];
    this.recommends = [];
    this.eventCaller();
  }
  eventCaller() {
    this.input.value = "";
    this.changeConfirmBtnStyle("hide");
    this.getDataFromLocal();
    this.input.oninput = this.typingHanlder.bind(this);
    this.confirmBtn.onclick = this.search.bind(this);
    this.confirmBtn.addEventListener("click", () => this.search());
    this.input.onfocus = this.focusHandler.bind(this);
  }

  typingHanlder(event) {
    //! Storing query string
    const queryString = event.currentTarget.value;

    //! Checking the query string to be more than 1 character
    if (queryString.length <= 1) {
      this.changeConfirmBtnStyle("hide");
      this.changeRecommendListStyle("hide");
      this.confirmBtn.onclick = null;
      return;
    }

    //! Checking if the query string is already in the previous query strings
    if (this.previousQueryStrings.length) {
      this.recommends = [];
      this.changeRecommendListStyle("hide");
      this.pairQueries(queryString);
    }

    //! Showing the confirm button
    this.changeConfirmBtnStyle("show");
  }

  async search() {
    try {
      const queryString = this.input.value.trim();
      //! Show loading
      Loading.show();

      //! Do search
      const { data: result } = await axios.get(`${baseApi}/quotes/search/${queryString}`);

      if (!result.quotes.length && !result.users.length) {
        this.changeRecommendListStyle("show");
        this.recommendList.innerHTML = `<li class="text-danger">چیزی برای جستجوی شما یافت نشد.</li>`;
        Loading.hide();
        return;
      }

      this.changeRecommendListStyle("hide");
      App.getRouter().navigateToRoute("search", false, result);
      this.input.value = "";
      this.changeConfirmBtnStyle("hide");
      this.setQueryData(queryString);
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  pairQueries(queryString) {
    const queryLength = queryString.length;
    this.previousQueryStrings.forEach((prevQuery) => {
      if (prevQuery.length >= queryLength) {
        const sliceQuery = prevQuery.slice(0, queryLength);
        if (sliceQuery == queryString) {
          this.recommends.push(prevQuery);
          this.showRecommends();
        }
      }
    });
  }

  focusHandler(event) {
    if (this.input.value.length > 1) {
      return;
    }
    this.recommends = this.previousQueryStrings.slice(0, 3);
    if (this.recommends.length) this.showRecommends();
  }

  //! Helper methods
  changeConfirmBtnStyle(order) {
    order == "show"
      ? this.confirmBtn.classList.replace("d-none", "d-flex")
      : this.confirmBtn.classList.replace("d-flex", "d-none");
  }

  changeRecommendListStyle(order) {
    this.recommendList.innerHTML = "";
    if (order == "show") {
      this.recommendList.classList.replace("d-none", "d-block");
    } else {
      this.recommendList.classList.replace("d-block", "d-none");
    }
  }

  setQueryData(queryString) {
    //! Setting internal data
    if (queryString && !this.previousQueryStrings.includes(queryString)) {
      this.previousQueryStrings.push(queryString);
    }
    if (this.previousQueryStrings.length > 20) {
      this.previousQueryStrings.shift();
    }

    //! Setting browser data
    const toSaveData = JSON.stringify(this.previousQueryStrings);
    localStorage.setItem("previousQueryStrings", toSaveData);
  }

  getDataFromLocal() {
    const data = localStorage.getItem("previousQueryStrings");
    if (data) {
      this.previousQueryStrings = JSON.parse(data);
    }
  }

  showRecommends() {
    this.changeRecommendListStyle("show");

    //!  Close list button
    const closeListButton = document.createElement("li");
    closeListButton.className = `position-absolute `;
    closeListButton.style.top = "8px";
    closeListButton.style.left = "8px";
    closeListButton.style.cursor = "pointer";
    closeListButton.innerHTML = `<i class="fas fa-times fs-2"></i>`;
    closeListButton.onclick = () => {
      this.changeRecommendListStyle("hide");
      this.changeConfirmBtnStyle("hide");
      this.input.value = "";
    };
    this.recommendList.appendChild(closeListButton);

    //! Adding list items
    this.recommends.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.style.cursor = "pointer";
      li.classList.add("my-1");
      li.classList.add("recommend-item");
      li.onclick = (e) => {
        this.input.value = e.currentTarget.textContent;
        this.changeConfirmBtnStyle("show");
      };
      this.recommendList.appendChild(li);
    });
  }
}

export { SearchServices };
