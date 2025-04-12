//! This module handles getting and showing user current data and changing those process
import axios from "axios";
import { baseApi } from "../Utils/options";
import { Loading } from "../Utils/Loading";
import { Toast } from "../Utils/Toast";
import { App } from "../App";

class SettingServices {
  constructor() {
    this.userData;
  }
  //! Setting page before render related methods
  async getUserData() {
    try {
      //! Show loading
      Loading.show();

      const { data: result } = await this.fetch();
      this.userData = result;
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  async updateUserData(pageContent) {
    await this.getUserData();
    const userName = pageContent.querySelector("#Name"),
      userDescription = pageContent.querySelector("#Description"),
      userUserName = pageContent.querySelector("#userName"),
      userEmail = pageContent.querySelector("#email"),
      userPhone = pageContent.querySelector("#phone");

    userName.textContent = this.userData.name;
    userDescription.textContent = this.userData.bio;
    userUserName.textContent = this.userData.username;
    userEmail.textContent = this.userData.email;
    userPhone.textContent = this.userData.phone;
  }

  //! Setting page after render related methods
  eventCaller() {
    //! Setting change user data
    const editButtons = document.querySelectorAll(".fa-edit");
    editButtons.forEach((button) => (button.onclick = this.handleEditProcess.bind(this)));

    //! Delete account
    const delButton = document.getElementById("delete-account");
    delButton.onclick = this.deleteAccountHandler.bind(this);
  }

  handleEditProcess(event) {
    const target = event.currentTarget,
      targetParent = target.closest(".setting__prev"),
      toEditTitle = targetParent.firstElementChild.firstElementChild.textContent,
      toEditKey = targetParent.getAttribute("data-name");

    this.showDataChangerMenu(toEditTitle, toEditKey);
  }

  showDataChangerMenu(title, key) {
    const menu = document.getElementById("show-setting"),
      menuTitle = document.getElementById("name-seting-user"),
      menuInput = document.getElementById("input-seting-user"),
      closeButton = document.querySelector(".close-setting"),
      submitButton = document.getElementById("submit-setting"),
      currentValueBox = document.getElementById("old-data");

    this.resetInput(menuInput);
    menuInput.type = key == "password" ? "password" : "unset";
    menuTitle.textContent = title;
    currentValueBox.textContent = this.userData[key] ? `${title} فعلی: ${this.userData[key]}` : "";
    menu.classList.remove("d-none");
    closeButton.onclick = () => menu.classList.add("d-none");
    submitButton.onclick = this.checkNewValue.bind(this, title, key);
  }

  checkNewValue(title, key) {
    const input = document.getElementById("input-seting-user");
    if (!input.value.trim()) {
      input.placeholder = `لطفا یک ${title} جدید وارد کنید.`;
      input.style.color = `red`;
    } else {
      this.submitChange(key, input.value.trim());
      this.resetInput(input);
    }
  }

  async submitChange(key, value) {
    try {
      //! Show loading
      Loading.show();

      const { data: result } = await this.post(key, value);
      result.status == "ok" ? this.successSubmit(key, result) : this.errorSubmit();
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  successSubmit(key, apiResponse) {
    App.getRouter().navigateToRoute("setting", false);
    new Toast("اطلاعات شما با موقیت تغییر کرد.", "success");

    if (key == "name") {
      App.getAuthorizationServices().setLoginData(apiResponse.data.name, apiResponse.data.token);
      App.getAuthorizationServices().updateUserFullName(true);
    }

    if (key == "password") {
      App.getAccountCenterServices().doLogout();
    }
  }

  errorSubmit() {
    new Toast("بروزرسانی اطلاعات با خطا مواجه شد.", "error");
  }

  deleteAccountHandler() {
    this.deleteConfirmInput = document.getElementById("input-delete-user");
    const deleteBox = document.getElementById("delete-box"),
      closeButton = document.querySelector(".delete-setting"),
      submitButton = document.getElementById("submit-delete");

    this.deleteConfirmInput.value = "";
    deleteBox.classList.remove("d-none");
    closeButton.onclick = () => deleteBox.classList.add("d-none");
    submitButton.onclick = this.checkDeleteConfirm.bind(this);
  }

  checkDeleteConfirm() {
    if (this.deleteConfirmInput.value.trim() === "delete") {
      this.deleteAccount();
    } else {
      new Toast(
        "برای حذف حساب کاربری به تایید شما نیاز است.به این منظور لطفا عبارت خواسته شده را تایپ کنید.",
        "error",
        4500
      );
    }
  }

  async deleteAccount() {
    try {
      //! Show loading
      Loading.show();
      const { data: result } = await axios.delete(`${baseApi}/deleteUser`);
      result.status == "ok" ? this.successDelete() : this.errorDelete();
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  successDelete() {
    App.getAccountCenterServices().doLogout();
    App.getRouter().navigateToRoute("home", false);
    new Toast("حساب شما با موفقیت حذف شد.", "success");
  }

  errorDelete() {
    new Toast("حذف حساب شما با خطا مواجه شد.", "error");
    App.getRouter().navigateToRoute("home", false);
  }

  //! Helper methods
  fetch() {
    return axios.get(`${baseApi}/getuser`);
  }

  post(key, newVal) {
    const formdata = new FormData();
    formdata.append("key", key);
    formdata.append("value", newVal);
    return axios.post(`${baseApi}/update`, formdata);
  }

  resetInput(input) {
    input.placeholder = "داده جدید را وارد کنید.";
    input.style.color = "unset";
    input.value = "";
  }
}

export { SettingServices };
