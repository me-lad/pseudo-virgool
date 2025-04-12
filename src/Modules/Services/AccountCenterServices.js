//! This module handles theme changing process and logout process
import { App } from "../App";

class AccountCenterServices {
  constructor() {
    this.logout = document.getElementById("logOut");
    this.themeChanger = document.getElementById("change-theme");
    this.themeName = document.getElementById("name-theme");
    this.themeIcon = document.getElementById("theme-icon");
    this.eventCaller();
  }
  eventCaller() {
    this.themeChanger.onclick = this.themeChangerFunc.bind(this);
    window.addEventListener("load", this.themeChangerFunc.bind(this));
  }

  //! Logout process
  setLogoutEvent() {
    this.logout.onclick = this.doLogout.bind(this);
  }

  removeLogoutEvent() {
    this.logout.onclick = null;
  }

  doLogout() {
    App.getAuthorizationServices().clearData();
    App.getAuthorizationServices().reLogin(false);
    App.getRouter().navigateToRoute("home", false);
  }

  //! Changing theme process
  themeChangerFunc(event) {
    let currentTheme;
    if (event.type == "load") {
      currentTheme = localStorage.getItem("theme");
      currentTheme == "dark" ? this.changeToDark() : this.changeToLight();
    } else {
      currentTheme = document.documentElement.getAttribute("data-bs-theme");
      currentTheme == "light" ? this.changeToDark() : this.changeToLight();
    }
  }

  changeToDark() {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
    this.themeName.textContent = "شب";
    this.themeIcon.classList.replace("fa-sun", "fa-moon");
  }

  changeToLight() {
    document.documentElement.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
    this.themeName.textContent = "روز";
    this.themeIcon.classList.replace("fa-moon", "fa-sun");
  }
}

export { AccountCenterServices };
