import { App } from "../App.js";
import { Page } from "../Models/Page.js";
import { Loading } from "../Utils/Loading.js";
import { Toast } from "../Utils/Toast.js";

class Blog extends Page {
  async beforeRender(content, postId) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Finding the selected post
    const selectedPost =
      (await App.getPostServices().findPost(postId)) || (await App.getProfileServices().findPost(postId));
    this.renderBlogPage(selectedPost, pageContent);
    this.checkPublishStatus(selectedPost, pageContent);

    return pageContent.innerHTML;
  }

  afterRender() {
    //! Hide loading
    Loading.hide();

    //! Publish post process
    App.getPostPublishServices().publish();
  }

  renderBlogPage(post, blogReference) {
    const readingTime = blogReference.querySelector("#time-blog"),
      publishTime = blogReference.querySelector("#time-publish"),
      blogTitle = blogReference.querySelector("#blog-title"),
      blogDescription = blogReference.querySelector("#blog-description"),
      blogImage = blogReference.querySelectorAll(".img-author"),
      blogAuthor = blogReference.querySelectorAll(".name-author");

    if (!post) {
      new Toast("شما به این پست دسترسی ندارید.", "error");
      App.getRouter().navigateToRoute("home", false);
      return;
    }

    readingTime.textContent = post.timeread;
    publishTime.textContent = post.time_frame;
    blogTitle.textContent = post.title;
    blogDescription.innerHTML = post.description;
    blogImage.forEach((img) => (img.src = post.user_imageurl));
    blogAuthor.forEach((author) => {
      author.textContent = post.username;
      author.setAttribute("data-select-id", post.user_id);
    });
  }

  checkPublishStatus(post, blogReference) {
    if (!post) {
      return;
    }
    //! Storing variables
    const publishButton = blogReference.querySelector(".publish-post"),
      isPublished = post.valid;

    //! Making the publish button (in)visible
    !isPublished ? publishButton.classList.remove("d-none") : publishButton.classList.add("d-none");

    //! Setting the needed attrs and events for button
    publishButton.setAttribute("data-post-id", post.id);
  }
}

export { Blog };
