//! This module handles user authorization and set user data
import { App } from "../App";
import { setToken } from "../Utils/options";

class AuthorizationServices {
  constructor() {
    this.name = "";
    this.token = "";
    this.checkLoginStatus();
  }

  setInternalData(name, token) {
    this.name = name;
    this.token = token;
  }

  setBrowserData(name, token) {
    localStorage.setItem("name", name);
    localStorage.setItem("token", token);
  }

  setLoginData(name, token) {
    this.setInternalData(name, token);
    this.setBrowserData(name, token);

    //! Updating the options module
    setToken(token);

    //! Updating axios header
    App.updateAxiosHeader();
  }

  checkLoginStatus() {
    //! Getting the data from local storage
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    if (name && token) {
      this.setInternalData(name, token);
      this.reLogin(true);
      return true;
    } else {
      this.reLogin(false);
      return;
    }
  }

  reLogin(isLogged) {
    //! Storing variables
    const activeLogin = document.querySelector(".login-activate");
    const nonActiveLogin = document.querySelector(".login-NoActivate");

    //! Changing the header panel
    this.updateUserFullName(isLogged);
    if (isLogged) {
      activeLogin.classList.add("hidden");
      nonActiveLogin.classList.remove("hidden");
    } else {
      activeLogin.classList.remove("hidden");
      nonActiveLogin.classList.add("hidden");
    }
  }

  updateUserFullName(isLogged) {
    const userFullName = document.querySelectorAll(".name-user");

    if (isLogged) {
      userFullName.forEach((nameBox) => (nameBox.textContent = this.name));
    } else {
      userFullName.forEach((nameBox) => (nameBox.textContent = "ناشناس"));
    }
  }

  clearData() {
    this.name = "";
    this.token = "";
    setToken("887d79b0b09e4e2033359e33a3db7f12ea102d87dd83cd691378408928902e20");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
  }
}

export { AuthorizationServices };
