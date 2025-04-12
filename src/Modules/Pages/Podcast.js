import { App } from "../App.js";
import { Page } from "../Models/Page.js";
import { Loading } from "../Utils/Loading.js";

class Podcast extends Page {
  async beforeRender(content, podcastId) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Finding the selected podcast
    const podcastsData = await App.getPodcastServices().getPodcasts();
    const targetPodcast = podcastsData.find((podcast) => podcast.id == podcastId);

    //! Getting the related songs
    const { data: relatedSoundsRequest } = await App.getSoundServices().fetch(targetPodcast.id, 10);
    const relatedSoundsData = relatedSoundsRequest.status == "success" ? relatedSoundsRequest.sounds : null;
    this.renderPodcastPage(targetPodcast, pageContent, relatedSoundsData);

    return pageContent.innerHTML;
  }

  afterRender() {
    //! Hide loading
    Loading.hide();

    //! Audio player
    document.querySelector("#sound-wrapper").onclick = App.getSoundServices().playSoundBtnClickHandler;
    App.getSoundPlayerServices().checkCurrentPlaying();
  }

  renderPodcastPage(podcast, podcastReference, soundsData) {
    this.podcastImage = podcastReference.querySelector("#podcast-img");
    this.podcastName = podcastReference.querySelector("#podcast-name");
    this.podcastDescription = podcastReference.querySelector("#podcast-description");
    this.podcastRelatedSoundsCount = podcastReference.querySelector("#podcast-sounds-count");
    this.relatedSoundsWrapper = podcastReference.querySelector("#sound-wrapper");
    this.relatedSoundsTemplate = podcastReference.querySelector("#sound-template");
    this.podcastImage.src = podcast.thumbnail;
    this.podcastName.textContent = podcast.name;
    this.podcastDescription.textContent = podcast.description;
    this.podcastRelatedSoundsCount.textContent = podcast.soundsCount;
    soundsData ? this.renderRelatedSounds(soundsData) : this.showNotfoundSoundMessage();
  }

  renderRelatedSounds(soundsList) {
    soundsList.forEach((relatedSound) => {
      const soundElement = document.importNode(this.relatedSoundsTemplate.content, true),
        soundImage = soundElement.querySelector("#sound-img"),
        soundName = soundElement.querySelector("#sound-name"),
        soundDuration = soundElement.querySelector("#sound-time"),
        soundSource = soundElement.querySelector("#sound-src");

      soundImage.src = relatedSound.srccover;
      soundName.textContent = relatedSound.title;
      soundDuration.textContent = relatedSound.time;
      soundSource.setAttribute("data-sound-id", relatedSound.id);
      soundSource.setAttribute("data-podcast-id", relatedSound.publisher);
      soundSource.setAttribute("data-isPlaying", false);

      this.relatedSoundsWrapper.prepend(soundElement);
    });
  }

  showNotfoundSoundMessage() {
    const notFoundMessage = document.createElement("span");
    notFoundMessage.textContent = `پادکستی از مجموعه ${this.podcastName.textContent} یافت نشد.`;
    notFoundMessage.className = `text-white bg-secondary rounded-3 fs-3 fw-bold mt-2 py-4 w-100 d-flex justify-content-center mb-6`;
    this.relatedSoundsWrapper.append(notFoundMessage);
  }
}

export { Podcast };
