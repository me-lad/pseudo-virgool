import { Loading } from "../Utils/Loading";
import { App } from "../App.js";
import { Toast } from "../Utils/Toast.js";

class Page {
  constructor(pageName, urlName) {
    this.pageName = pageName;
    this.urlName = urlName;
  }

  renderContent(container, routeId) {
    if (this.isLoginNecessary() && !App.getAuthorizationServices().checkLoginStatus()) {
      App.getRouter().navigateToRoute("login", false);
      new Toast("برای دسترسی به این صفحه باید وارد شوید", "success", 3000);
      return;
    }
    if (this.isLogoutNecessary() && App.getAuthorizationServices().checkLoginStatus()) {
      App.getRouter().navigateToRoute("profile", false);
      return;
    }

    fetch(`./pages/${this.pageName}.html`)
      .then((response) => response.text())
      .then((html) => this.beforeRender(html, routeId))
      .then((result) => {
        container.innerHTML = result;
        this.afterRender();
      });
  }

  beforeRender(content) {
    return content;
  }

  afterRender() {
    //! Hide loading
    Loading.hide();
  }

  isLoginNecessary() {
    return;
  }

  isLogoutNecessary() {
    return;
  }
}

export { Page };
