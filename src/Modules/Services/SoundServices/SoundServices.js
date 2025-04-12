//! This module handles getting sounds from api
import axios from "axios";
import { baseApi } from "../../Utils/options";
import { SoundRenderServices } from "./SoundRenderServices";
import { App } from "../../App";
import { Toast } from "../../Utils/Toast";

class SoundServices {
  constructor() {
    this.soundsData = [];
  }

  async getSounds(podcastId) {
    try {
      if (this.soundsData.length && this.soundsData[0] != undefined) {
        return this.soundsData;
      }
      const { data: result } = await this.fetch(podcastId, 5);
      if (result.sounds) {
        this.soundsData = result.sounds.map((sound) => new SoundRenderServices(sound));
      }
      return this.soundsData;
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    }
  }

  async getRelatedSounds(podcastId, podcastName) {
    try {
      if (!podcastId) {
        return;
      }

      //! Show loading
      this.soundsWrapperLoadingHandler("show");

      //! Getting data
      const soundsWrapper = document.getElementById("sound-wrapper");
      const goToPodcastPageButton = document.getElementById("podcast-page-btn");

      const { data: result } = await this.fetch(podcastId, 5);
      soundsWrapper.innerHTML = null;
      goToPodcastPageButton.setAttribute("data-select-id", podcastId);
      if (result.sounds) {
        this.soundsData = result.sounds.map((sound) =>
          new SoundRenderServices(sound).renderRelatedSounds(podcastName)
        );
        console.log(this.soundsData);
      } else {
        const notFoundMessage = document.createElement("span");
        notFoundMessage.innerHTML = `پادکستی از مجموعه <strong class="text-secondary mx-2">${podcastName}</strong> یافت نشد.`;
        notFoundMessage.className = `w-100 d-flex justify-content-center fs-3`;
        soundsWrapper.append(notFoundMessage);
      }
    } catch (error) {
      new Toast("دریافت اطلاعات با خطا مواجه شد. لطفا لحظاتی دیگر دوباره تلاش کنید.", "error", 3500);
    } finally {
      //! Hide loading
      this.soundsWrapperLoadingHandler("hide");
    }
  }

  soundsWrapperLoadingHandler(order) {
    document.getElementById("sound-loading").style.display = order == "show" ? "block" : "none";
  }

  fetch(id, limit) {
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("limit", limit);
    return axios.post(`${baseApi}/podcastId`, formdata);
  }

  playSoundBtnClickHandler(event) {
    //! Storing variables
    const target = event.target,
      targetButton = target.classList.contains("sound-link")
        ? target
        : target.parentElement.classList.contains("sound-link")
        ? target.parentElement
        : null;

    //! Checking the user click to be correct
    if (!targetButton) {
      return;
    }

    //! Resume the play process
    const soundId = targetButton.getAttribute("data-sound-id"),
      podcastId = targetButton.getAttribute("data-podcast-id"),
      isPlaying = targetButton.getAttribute("data-isPlaying"),
      isPaused = targetButton.getAttribute("data-isPaused");

    let clickOrder;
    if (isPlaying == "true") {
      clickOrder = "pause";
    } else {
      if (isPaused == "true") {
        clickOrder = "resume";
      } else {
        clickOrder = "play";
      }
    }

    App.getSoundPlayerServices().handlePlayProcess(soundId, podcastId, clickOrder);
  }
}

export { SoundServices };
