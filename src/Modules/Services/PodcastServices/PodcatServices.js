//! This module handles getting podcasts from api
import axios from "axios";
import { baseApi } from "../../Utils/options";
import { PodcastRenderServices } from "./PodcatRenderServices";
import { Toast } from "../../Utils/Toast.js";

class PodcastServices {
  constructor() {
    this.podcastsData = null;
  }

  async getPodcasts() {
    try {
      if (this.podcastsData) {
        return this.podcastsData;
      }
      const { data: result } = await axios.get(`${baseApi}/podcast`);
      if (result.status == "success") {
        this.podcastsData = result.podcasts.map((podcast) => new PodcastRenderServices(podcast));
      }
      return this.podcastsData;
    } catch (error) {
      console.log(error);
    }
  }

  findPodcast(id) {
    this.getPodcasts();
    return this.podcastsData.find((podcast) => podcast.id == id);
  }

  initializePodcastsSlider() {
    var swiper = new Swiper(".mySwiper", {
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      slidesPerView: "auto",
    });
  }
}

export { PodcastServices };
