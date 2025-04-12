import { App } from "../App.js";
import { Page } from "../Models/Page.js";
import { Loading } from "../Utils/Loading.js";

class Topic extends Page {
  async beforeRender(content) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Topics render
    const topicsWrapper = pageContent.querySelector(".topic-wrapper");
    const topicTemplate = pageContent.querySelector("#topic-cat");
    const topicsData = await App.getCategoryServices().getCategories();
    topicsData.forEach((topic) => topicsWrapper.append(topic.renderTopic(topicTemplate)));

    return pageContent.innerHTML;
  }

  afterRender() {
    //! Hide loading
    Loading.hide();
  }
}

export { Topic };
