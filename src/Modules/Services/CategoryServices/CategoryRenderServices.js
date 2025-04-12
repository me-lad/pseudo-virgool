//! This module handles category render process and we make instance from it by each category we get from api
class CategoryRenderServices {
  constructor(category) {
    for (let key in category) {
      this[key] = category[key];
    }
  }

  renderCategory(template) {
    const categoryTemplate = document.importNode(template.content, true),
      categoryName = categoryTemplate.querySelector("#tags");

    categoryName.textContent = this.name;
    categoryName.setAttribute("data-select-id", this.id);

    return categoryTemplate;
  }

  renderTopic(template) {
    const topicTemplate = document.importNode(template.content, true),
      topicName = topicTemplate.querySelector(".main-topic"),
      topicChildrenWrapper = topicTemplate.querySelector(".list-group");

    topicName.textContent = this.name;
    topicName.setAttribute("data-select-id", this.id);
    this.children.forEach((child) => {
      const topicChild = document.createElement("a");
      topicChild.textContent = child.name;
      topicChild.className = `list-group-item childTopic text-subtitle mt-3 fs-4 w-100 d-flex topic-item`;
      topicChild.setAttribute("data-select-id", child.id);
      topicChild.setAttribute("href", "/tag");
      topicChildrenWrapper.appendChild(topicChild);
    });

    return topicTemplate;
  }
}

export { CategoryRenderServices };
