import axios from "axios";
import { routes } from "../routes.js";
import { Router } from "./Routes/Router.js";
import { apiToken, getToken } from "./Utils/options.js";
import { PostServices } from "./Services/PostServices/PostServices.js";
import { CategoryServices } from "./Services/CategoryServices/CategoryServices.js";
import { PodcastServices } from "./Services/PodcastServices/PodcatServices.js";
import { SoundServices } from "./Services/SoundServices/SoundServices.js";
import { EmailServices } from "./Services/EmailServices.js";
import { AuthorizationServices } from "./Services/AuthorizationServices.js";
import { AccountButton } from "./Components/AccountButton.js";
import { PostPageServices } from "./Services/PostServices/PostPageServices.js";
import { ProfileServices } from "./Services/ProfileServices/ProfileServices.js";
import { PostPublishServices } from "./Services/PostServices/PostPublishServices.js";
import { AccountCenterServices } from "./Services/AccountCenterServices.js";
import { UserServices } from "./Services/UserServices.js";
import { SoundPlayerServices } from "./Services/SoundServices/SoundPlayerServices.js";

class Preliminary {
  constructor() {
    this.pageRoutes = routes;
    this.router = new Router(this.pageRoutes);
    this.postServices = new PostServices();
    this.podcastServices = new PodcastServices();
    this.categoryServices = new CategoryServices();
    this.soundServices = new SoundServices();
    this.soundPlayerServices = new SoundPlayerServices();
    this.emailServices = new EmailServices();
    this.authorizationServices = new AuthorizationServices();
    this.accountButton = new AccountButton();
    this.postPageServices = new PostPageServices();
    this.profileServices = new ProfileServices();
    this.postPublishServices = new PostPublishServices();
    this.accountCenterServices = new AccountCenterServices();
    this.userServices = new UserServices();
    this.eventCaller();
    this.setApiHeader();
  }
  eventCaller() {
    //! First loading handler (home page) and refresh page handler
    window.onload = () => this.router.navigateToRoute("home", false);

    //! Page links handler
    document.onclick = (event) => {
      const clickedElm = event.target;
      const target =
          clickedElm.tagName === "A" ? clickedElm : clickedElm.closest("A") ? clickedElm.closest("A") : null,
        targetLink = target && target.getAttribute("href") ? target.getAttribute("href").substring(1) : null,
        targetId = target ? target.getAttribute("data-select-id") : null;

      if (target) {
        event.preventDefault();
        this.router.navigateToRoute(targetLink, false, targetId);
      }
    };

    //! History handler
    window.onpopstate = (event) => {
      const targetState = event.state;
      if (targetState) {
        const stateSections = targetState.content.split("?"),
          targetRoute = stateSections[0],
          targetId = stateSections[1];
        this.router.navigateToRoute(targetRoute, true, targetId);
      }
    };
  }

  setApiHeader() {
    getToken();
    axios.defaults.headers.common["Authorization"] = apiToken;
  }
}

export { Preliminary };
