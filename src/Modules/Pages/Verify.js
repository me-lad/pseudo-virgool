import { Page } from "../Models/Page.js";
import { Loading } from "../Utils/Loading.js";
import { App } from "../App.js";
import { baseApi } from "../Utils/options.js";
import axios from "axios";
import { Toast } from "../Utils/Toast.js";

class Verify extends Page {
  afterRender() {
    this.getActivationCode();
  }

  getActivationCode() {
    //! Handle automaticly jump between inputs
    const allOtpInputs = document.querySelectorAll(".otp-input");
    allOtpInputs[0].focus();

    allOtpInputs.forEach((input, index) => {
      input.oninput = (event) => {
        //! Controling the input length
        event.target.value = event.target.value.slice(0, 1);

        //! Jump handlres
        if (event.target.value.length === 1) {
          index < allOtpInputs.length - 1 ? allOtpInputs[index + 1].focus() : this.sendRequest(allOtpInputs);
        }
        if (event.inputType == "deleteContentBackward") {
          if (index > 0) {
            allOtpInputs[index - 1].focus();
          }
        }
      };
    });
  }

  async sendRequest(inputs) {
    try {
      //! Show loading
      Loading.show();

      //! getting the user email
      const userEmail = App.getEmailServices().getEmail();

      //! Concating the otp parts
      let otp = "";
      inputs.forEach((input) => (otp += input.value));

      //! Sending the request to the server
      const { data: result } = await this.fetch(otp, userEmail);
      if (result.status == "error") {
        inputs.forEach((input) => (input.style.backgroundColor = "red"));
      } else {
        inputs.forEach((input) => (input.style.backgroundColor = "#00FF00"));
        setTimeout(() => {
          App.getRouter().navigateToRoute("login", false);
        }, 2000);
      }
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      Loading.hide();
    }
  }

  fetch(otp, email) {
    const formdata = new FormData();
    formdata.append("otp", otp);
    formdata.append("email", email);
    return axios.post(`${baseApi}/otp`, formdata);
  }

  isLogoutNecessary() {
    return true;
  }
}

export { Verify };
