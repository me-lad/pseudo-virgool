import axios from "axios";
import { Preliminary } from "./Preliminary.js";

class App {
  static init() {
    axios.defaults.headers.common["Accept"] = "application/json";
    this.preliminary = new Preliminary();
  }

  static updateAxiosHeader() {
    this.preliminary.setApiHeader();
  }

  static getRouter() {
    return this.preliminary.router;
  }

  static getPostServices() {
    return this.preliminary.postServices;
  }

  static getPodcastServices() {
    return this.preliminary.podcastServices;
  }

  static getCategoryServices() {
    return this.preliminary.categoryServices;
  }

  static getSoundServices() {
    return this.preliminary.soundServices;
  }

  static getSoundPlayerServices() {
    return this.preliminary.soundPlayerServices;
  }

  static getEmailServices() {
    return this.preliminary.emailServices;
  }

  static getAuthorizationServices() {
    return this.preliminary.authorizationServices;
  }

  static getPostPageServices() {
    return this.preliminary.postPageServices;
  }

  static getProfileServices() {
    return this.preliminary.profileServices;
  }

  static getPostPublishServices() {
    return this.preliminary.postPublishServices;
  }

  static getAccountCenterServices() {
    return this.preliminary.accountCenterServices;
  }

  static getUserServices() {
    return this.preliminary.userServices;
  }
}

export { App };
