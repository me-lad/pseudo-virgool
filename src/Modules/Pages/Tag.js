import { App } from "../App.js";
import { Page } from "../Models/Page.js";
import { Loading } from "../Utils/Loading.js";
import { baseApi } from "../Utils/options.js";

class Tag extends Page {
  async beforeRender(content, tagId) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Finding the selected tag
    const { data: targetCategory } = await App.getCategoryServices().getSelectedCategory(tagId);
    this.renderCategoryPage(targetCategory, pageContent);

    return pageContent.innerHTML;
  }

  renderCategoryPage(category, tagReference) {
    //! Storing variables
    this.categoryName = tagReference.querySelector("#tag-content");
    this.relatedPostWrapper = tagReference.querySelector("#category-wrapper");
    this.relatedPostTemplate = tagReference.querySelector("#category-template");

    //! Changing name and showing posts(if exist)
    this.categoryName.textContent = category.name;
    category.posts.length ? this.renderRelatedPosts(category.posts) : this.showNotfoundPostMessage();
  }

  renderRelatedPosts(postsList) {
    postsList.forEach((relatedPost) => {
      const postElement = document.importNode(this.relatedPostTemplate.content, true),
        postImage = postElement.querySelector("#post-image"),
        postTitle = postElement.querySelector("#post-title"),
        postPublish = postElement.querySelector("#post-publish"),
        postLikeCount = postElement.querySelector("#post-like"),
        postCommentCount = postElement.querySelector("#post-comment");

      postImage.src = `${baseApi}/${relatedPost.imageUrl}`;
      postTitle.textContent = relatedPost.title;
      postTitle.setAttribute("data-select-id", relatedPost.id);
      postPublish.textContent = relatedPost.time_frame;
      postLikeCount.textContent = relatedPost.likecount;
      postCommentCount.textContent = relatedPost.commentcount;

      this.relatedPostWrapper.append(postElement);
    });
  }

  showNotfoundPostMessage() {
    const notFoundMessage = document.createElement("span");
    notFoundMessage.textContent = `هیچ پستی از ${this.categoryName.textContent} یافت نشد`;
    notFoundMessage.className = `text-center text-white bg-secondary rounded-3 fs-3 fw-bold mt-2 py-4`;
    this.relatedPostWrapper.append(notFoundMessage);
  }
}

export { Tag };
