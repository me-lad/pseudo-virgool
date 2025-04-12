import { Page } from "../Models/Page.js";
import { SettingServices } from "../Services/SettingServices.js";
import { Loading } from "../Utils/Loading.js";
import { Tabs } from "../Utils/Tabs.js";

class Setting extends Page {
  async beforeRender(content) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Update user data
    this.settingServices = new SettingServices();
    await this.settingServices.updateUserData(pageContent);

    return pageContent.innerHTML;
  }

  afterRender() {
    //! Hide loading
    Loading.hide();

    //! Tabs
    new Tabs();

    //! Setting event handlers
    this.settingServices.eventCaller();
  }

  isLoginNecessary() {
    return true;
  }
}

export { Setting };
