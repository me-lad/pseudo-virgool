//! This module handles sound render process and we make instance from it by each sound we get from api
import { App } from "../../App.js";

class SoundRenderServices {
  constructor(sound) {
    for (let key in sound) {
      this[key] = sound[key];
    }
  }

  renderSound(template) {
    const soundTemplate = document.importNode(template.content, true),
      soundImage = soundTemplate.querySelector("#sound-img"),
      soundName = soundTemplate.querySelector("#sound-text"),
      soundDuration = soundTemplate.querySelector("#sound-time"),
      soundSource = soundTemplate.querySelector("#sound-src");

    soundImage.src = this.srccover;
    soundName.textContent = this.title;
    soundDuration.textContent = this.time;
    soundSource.classList.add("sound-link");
    soundSource.setAttribute("data-sound-id", this.id);
    soundSource.setAttribute("data-podcast-id", this.publisher);
    soundSource.setAttribute("data-isPlaying", false);
    soundSource.setAttribute("data-isPaused", false);
    return soundTemplate;
  }

  renderRelatedSounds(podcastName) {
    //! Storing variables
    const soundsWrapper = document.getElementById("sound-wrapper");
    const soundsTemplate = document.getElementById("sound-template");
    const podcastNameBox = document.getElementById("podcast-name");

    podcastNameBox.textContent = podcastName;
    soundsWrapper.prepend(this.renderSound(soundsTemplate));
    return this;
  }
}

export { SoundRenderServices };
