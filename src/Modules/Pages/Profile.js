import { App } from "../App.js";
import { Page } from "../Models/Page.js";
import { Loading } from "../Utils/Loading.js";
import { Tabs } from "../Utils/Tabs.js";

class Profile extends Page {
  async beforeRender(content) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Posts render
    const postsWrapper = pageContent.querySelector("#post-container");
    const postTemplate = pageContent.querySelector("#post-template");
    const emptyWrapper = pageContent.querySelector(".dashboard__empty");
    const postsData = await App.getProfileServices().getPosts();
    if (postsData) {
      postsData.forEach((post) => postsWrapper.append(post.renderPost(postTemplate)));
      emptyWrapper.classList.add("d-none");
      postsWrapper.classList.remove("d-none");
    } else {
      emptyWrapper.classList.remove("d-none");
      postsWrapper.classList.add("d-none");
    }

    //! Update user name
    const nameUserContainer = pageContent.querySelector("#user-name");
    App.getProfileServices().updateUserName(nameUserContainer);

    return pageContent.innerHTML;
  }

  afterRender() {
    //! Hide loading
    Loading.hide();

    //! Dashbord sections changer
    new Tabs();

    //! Delete post process
    App.getPostPublishServices().remove();

    //! Set logout event
    App.getAccountCenterServices().setLogoutEvent();
  }

  isLoginNecessary() {
    return true;
  }
}

export { Profile };
