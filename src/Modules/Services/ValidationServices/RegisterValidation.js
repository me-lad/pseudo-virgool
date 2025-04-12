//! This module handles the register page form validation
import axios from "axios";
import { baseApi } from "../../Utils/options.js";
import { App } from "../../App.js";
import { Loading } from "../../Utils/Loading.js";
import { Toast } from "../../Utils/Toast.js";

class RegisterValidation {
  constructor() {
    this.errors = [];
    this.registerForm = document.getElementById("form-register");
    this.registerInputs = document.querySelectorAll(".stuRegister__Input");
    this.errorsContainer = document.getElementById("errors-empty");
    this.emailAddress = "";
    this.formData = {};

    //! Set events
    this.registerForm.onsubmit = this.validate.bind(this);
  }

  validate(event) {
    event.preventDefault();
    this.errors = [];
    this.errorsContainer.innerHTML = "";
    this.checkInputs();
    !this.errors.length ? this.getFormData() : this.showErrors();
  }

  getFormData() {
    this.registerInputs.forEach((input) => (this.formData[input.getAttribute("name")] = input.value));
    this.checkPasswords();
    !this.errors.length ? this.submit() : this.showErrors();
  }

  async submit() {
    try {
      //! Show loading
      Loading.show();
      this.emailAddress = this.formData["email"];

      //! Sending request (type:post)
      const { data: result } = await this.fetch();
      result.status == "error" ? this.handleApiErrors(result.errors) : this.doUserVerify();
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  doUserVerify() {
    new Toast(
      "ثبت نام اولیه شما با موفقیت انجام شد.لطفا برای تکمیل ثبت نام احراز هویت را انجام دهید.",
      "success",
      4500
    );
    App.getEmailServices().setEmail(this.emailAddress);
    App.getRouter().navigateToRoute("verify", false);
  }

  //! Error handlers
  showErrors() {
    this.errors.forEach((error) => {
      const errorElm = document.createElement("li");
      errorElm.className = "stuRegister__error";
      errorElm.textContent = error;
      this.errorsContainer.appendChild(errorElm);
    });
  }

  handleApiErrors(errors) {
    const errorContainers = {
      name: document.getElementById("errors-name"),
      email: document.getElementById("errors-email"),
      phone: document.getElementById("errors-phone"),
      password: document.getElementById("errors-password"),
    };
    for (const container in errorContainers) {
      errorContainers[container].innerHTML = "";
    }
    for (const field in errors) {
      if (errors[field].length) {
        this.showApiErrors(errors[field], errorContainers[field]);
      }
    }
  }

  showApiErrors(relatedErrorList, relatedErrorContainer) {
    relatedErrorList.forEach((error) => {
      const errorElm = document.createElement("li");
      errorElm.className = "stuRegister__error";
      errorElm.textContent = error;
      relatedErrorContainer.appendChild(errorElm);
    });
  }

  //! Helper methods
  checkInputs() {
    this.registerInputs.forEach((input) => {
      if (!input.value.trim()) {
        let message = `لطفا فیلد ${input.getAttribute("data-title")} را کامل کنید.`;
        this.errors.push(message);
        input.style.border = "1px solid red";
      } else {
        input.style.border = "1px solid #fff";
      }
    });
  }

  checkPasswords() {
    const message = "گذرواژه و تکرار گذرواژه با هم مطابقت ندارند.";
    if (this.formData["password"] != this.formData["password_repeat"]) {
      this.errors.push(message);
    }
  }

  fetch() {
    const options = new FormData();
    options.append("email", this.formData["email"]);
    options.append("name", this.formData["name"]);
    options.append("phone", this.formData["phone"]);
    options.append("password", this.formData["password"]);
    return axios.post(`${baseApi}/register`, options);
  }
}

export { RegisterValidation };
