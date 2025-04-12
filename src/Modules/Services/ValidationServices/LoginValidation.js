//! This module handles the login page form validation
import axios from "axios";
import { baseApi } from "../../Utils/options.js";
import { App } from "../../App.js";
import { Loading } from "../../Utils/Loading.js";
import { Toast } from "../../Utils/Toast.js";

class LoginValidation {
  constructor() {
    this.errors = [];
    this.loginForm = document.getElementById("login-from");
    this.loginInputs = document.querySelectorAll(".stuLogin-input");
    this.errorsContainer = document.getElementById("errors-empty");
    this.emailAddress = "";
    this.formData = {};

    //! Set events
    this.loginForm.onsubmit = this.validate.bind(this);
  }

  validate(event) {
    event.preventDefault();
    this.errors = [];
    this.errorsContainer.innerHTML = "";
    this.checkInput();
    !this.errors.length ? this.getFormData() : this.showErrors();
  }

  getFormData() {
    this.loginInputs.forEach((input) => (this.formData[input.getAttribute("name")] = input.value));
    this.submit();
  }

  async submit() {
    try {
      //! Show loading
      Loading.show();
      this.emailAddress = this.formData["email"];

      //! Post request
      const { data: result } = await this.fetch();

      result.status == "error" ? this.handleApiErrors(result.message) : this.doUserLogin(result);
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  doUserLogin(apiResponse) {
    App.getAuthorizationServices().setLoginData(apiResponse.data.name, apiResponse.data.token);
    new Toast("ورود موفقیت آمیز بود.", "success");
    App.getEmailServices().setEmail(this.emailAddress);
    App.getRouter().navigateToRoute("profile", false);
  }

  //! Error handlers
  showErrors() {
    this.errors.forEach((error) => {
      const newErrorElm = document.createElement("li");
      newErrorElm.className = "stuRegister__error";
      newErrorElm.textContent = error;
      this.errorsContainer.appendChild(newErrorElm);
    });
  }

  handleApiErrors(errorMessage) {
    this.errors.push(errorMessage);
    this.showErrors();
  }
  //! Helper methods
  checkInput() {
    this.loginInputs.forEach((input) => {
      if (!input.value.trim()) {
        let message = `لطفا فیلد ${input.getAttribute("data-title")} را کامل کنید.`;
        this.errors.push(message);
        input.style.border = "1px solid red";
      } else {
        input.style.border = "1px solid #fff";
      }
    });
  }

  fetch() {
    const options = new FormData();
    options.append("email", this.formData["email"]);
    options.append("password", this.formData["password"]);
    return axios.post(`${baseApi}/login`, options);
  }
}

export { LoginValidation };
