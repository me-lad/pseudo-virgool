//! This module handles creating an element by each post to show in profile page
import { baseApi } from "../../Utils/options";

class ProfileRenderServices {
  constructor(post) {
    for (let key in post) {
      this[key] = post[key];
    }
  }

  renderPost(template) {
    const postTemplate = document.importNode(template.content, true),
      postTitle = postTemplate.querySelector("#post-title"),
      postImage = postTemplate.querySelector("#post-image"),
      postCategory = postTemplate.querySelector("#post-category"),
      publishStatus = postTemplate.querySelector("#publish-status"),
      postLikeCount = postTemplate.querySelector("#post-like"),
      postCommentCount = postTemplate.querySelector("#post-comment"),
      postPublish = postTemplate.querySelector("#post-publish"),
      postIds = postTemplate.querySelectorAll(".post-blog");

    postTitle.textContent = this.title;
    postImage.src = `${baseApi}/${this.imageUrl}`;
    postCategory.textContent = this.category_title;
    postLikeCount.textContent = this.likeCount;
    postCommentCount.textContent = this.commentcount;
    postPublish.textContent = this.time_frame;
    postTitle.setAttribute("data-select-id", this.id);
    postIds.forEach((id) => id.setAttribute("data-select-id", this.id));
    if (this.valid) {
      publishStatus.classList.replace("bg-danger", "bg-success");
      publishStatus.textContent = "منتشر شده";
    } else {
      publishStatus.classList.replace("bg-success", "bg-danger");
      publishStatus.textContent = "عدم انتشار";
    }

    return postTemplate;
  }
}

export { ProfileRenderServices };
