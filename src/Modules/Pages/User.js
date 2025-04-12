import { App } from "../App.js";
import { Page } from "../Models/Page.js";
import { Loading } from "../Utils/Loading.js";

class User extends Page {
  async beforeRender(content, userId) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Update page data
    const userData = await App.getUserServices().getUserData(userId);
    this.updateData(pageContent, userData);

    //! Rendering user posts
    const postsWrapper = pageContent.querySelector("#post-container");
    const postTemplate = pageContent.querySelector("#post-template");
    const userPosts = await App.getUserServices().getUserPosts(userId);
    userPosts
      ? userPosts.forEach((post) => postsWrapper.appendChild(post.renderPost(postTemplate)))
      : this.showNotFound(postsWrapper);

    return pageContent.innerHTML;
  }

  updateData(pageContent, userObj) {
    const userImage = pageContent.querySelector("#user-image");
    const userName = pageContent.querySelector("#user-name");
    const userBio = pageContent.querySelector("#user-bio");

    userImage.src = userObj.imageurl;
    userName.textContent = userObj.name;
    userBio.textContent = userObj.bio;
  }

  showNotFound(wrapper) {
    const notFoundMessage = document.createElement("p");
    notFoundMessage.textContent = "این کاربر هنوز هیچ پستی منتشر نکرده است.";
    notFoundMessage.className = `text-center fs-2 fw-bold text-secondary my-3`;
    wrapper.appendChild(notFoundMessage);
  }
}

export { User };
