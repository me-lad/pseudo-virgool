//! This module handles podcast render process and we make instance from it by each podcast we get from api
class PodcastRenderServices {
  constructor(podcast) {
    for (let key in podcast) {
      this[key] = podcast[key];
    }
  }

  renderPodcast(template) {
    const podcastTemplate = document.importNode(template.content, true),
      podcastImage = podcastTemplate.querySelector("#swiper-img");

    podcastImage.src = this.thumbnail;
    podcastImage.setAttribute("data-select-id", this.id);
    podcastImage.setAttribute("alt", this.name);
    podcastImage.style.cursor = "pointer";

    return podcastTemplate;
  }
}

export { PodcastRenderServices };
