//! This module handles post render process and we make instance from it by each post we get from api
import { App } from "../../App.js";
import { baseApi } from "../../Utils/options";

class PostRenderServices {
  constructor(post, pageName) {
    for (let key in post) {
      this[key] = post[key];
    }
    this.pageName = pageName;
  }

  renderPost(template) {
    const postTemplate = document.importNode(template.content, true),
      postAuthorImage = postTemplate.querySelector("#author-image"),
      postAuthorName = postTemplate.querySelector("#author-name"),
      postPublish = postTemplate.querySelector("#post-publish"),
      postTitle = postTemplate.querySelector("#post-title"),
      postDescription = postTemplate.querySelector("#post-description"),
      postImage = postTemplate.querySelector("#post-image"),
      postCategory = postTemplate.querySelector("#post-category"),
      postLikeCount = postTemplate.querySelector("#post-like"),
      postCommentCount = postTemplate.querySelector("#post-comment"),
      postReadTime = postTemplate.querySelector("#post-readtime"),
      postIds = postTemplate.querySelectorAll(".post-blog");

    postTitle.textContent = this.title;
    postDescription.innerHTML = this.description;
    postImage.src = `${baseApi}/${this.imageUrl}`;
    postLikeCount.textContent = this.likecount;
    postCommentCount.textContent = this.commentcount;
    postReadTime.textContent = this.timeread;
    postIds.forEach((id) => id.setAttribute("data-select-id", this.id));
    postCategory.setAttribute("data-select-id", this.categoryId);
    if (this.pageName == "user") {
      postCategory.textContent = App.getCategoryServices().findCategory(this.categoryId).name;
    } else {
      postAuthorImage.src = this.user_imageurl;
      postAuthorName.textContent = this.username;
      postAuthorName.setAttribute("data-select-id", this.user_id);
      postPublish.textContent = this.time_frame;
      postCategory.textContent = this.category_title;
    }

    return postTemplate;
  }
}

export { PostRenderServices };
