import { Page } from "../Models/Page.js";
import { PostRenderServices } from "../Services//PostServices/PostRenderServices.js";
import { Loading } from "../Utils/Loading.js";
import { Tabs } from "../Utils/Tabs.js";

class Search extends Page {
  beforeRender(content, searchResult) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Show search data (post)
    const postWrapper = pageContent.querySelector("#post-container");
    const postTemplate = pageContent.querySelector("#post-template");
    if (searchResult.quotes.length) {
      searchResult.quotes.forEach((post) => postWrapper.appendChild(this.buildPostElm(postTemplate, post)));
    }

    //! Show search data (user)
    const userWrapper = pageContent.querySelector("#user-container");
    const userTemplate = pageContent.querySelector("#user-template");
    if (searchResult.users.length) {
      searchResult.users.forEach((user) => userWrapper.appendChild(this.buildUserElm(userTemplate, user)));
    }

    return pageContent.innerHTML;
  }

  buildPostElm(template, postData) {
    return new PostRenderServices(postData).renderPost(template);
  }

  buildUserElm(template, userData) {
    const userTemplate = document.importNode(template.content, true);
    const userImage = userTemplate.querySelector("#image-search"),
      userName = userTemplate.querySelector("#name-search"),
      userBio = userTemplate.querySelector("#bio-search");

    userImage.src = userData.profile_image;
    userName.textContent = userData.name;
    userName.setAttribute("data-select-id", userData.id);
    userBio.textContent = userData.bio;
    return userTemplate;
  }

  afterRender() {
    //! Hide loading
    Loading.hide();

    //! Tabs handler
    new Tabs();
  }
}

export { Search };
