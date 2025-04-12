//! This module handles playing podcasts
import { App } from "../../App";
import { Loading } from "../../Utils/Loading";
import { Player } from "../../Utils/Player";
import { Toast } from "../../Utils/Toast";

class SoundPlayerServices {
  constructor() {
    //! Dom variables
    this.audioWrapper = document.querySelector(".audio-wrapper");
    this.audioElm = document.getElementById("audio-element");
    this.playerImage = document.getElementById("player-sound-img");
    this.playerName = document.getElementById("player-sound-name");
    this.playerCurrentTime = document.getElementById("current-time");
    this.playerDuration = document.getElementById("duration");
    this.audioPlayBtn = document.getElementById("play-pause");
    this.playButtons;

    //! Other variables
    this.soundId;
    this.podcastId;
    this.soundData;
    this.podcastData;
    this.soundsList;
    this.index;
    this.isLoading = false;

    this.player = new Player(this);
    this.audioElm.addEventListener("loadeddata", this.player.eventCaller.bind(this.player), { once: true });
  }
  async handlePlayProcess(soundId, podcastId, order) {
    this.soundId = soundId;
    this.podcastId = podcastId;
    try {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      if (order == "play") {
        await this.getRequiredData();
        this.changePlayButtonStyle("played");
      } else if (order == "pause") {
        await this.audioElm.pause();
        this.changePlayButtonStyle("paused");
      } else if (order == "resume") {
        await this.audioElm.play();
        this.changePlayButtonStyle("rePlayed");
      }

      this.isLoading = false;
    } catch (error) {
      console.log(error);
    }
  }

  async getRequiredData() {
    await this.getPodcastData();
    await this.getSoundsList();
    this.findTargetSound();
    await this.playSound();
  }

  async playSound() {
    try {
      Loading.show();
      this.audioElm.src = this.soundData.podcasturl;
      this.updatePlayerData();
      this.changeAudioPlayerStyle("show");
      this.changePlayButtonStyle("pause");
      await this.audioElm.play();
      this.playerDuration.textContent = this.timeFormatter(this.audioElm.duration);
    } catch (error) {
      if (navigator.userAgent.indexOf("Chrome") != -1) {
        this.audioElm.src =
          "https://injector.simplecastaudio.com/88175c5a-279c-4a06-acb9-4c59b485d24e/episodes/6d3f4e69-b41f-424d-a3ce-10f59faca23a/audio/128/default.mp3?aid=rss_feed&awCollectionId=88175c5a-279c-4a06-acb9-4c59b485d24e&awEpisodeId=6d3f4e69-b41f-424d-a3ce-10f59faca23a&feed=VXsnzJeg";
        this.audioElm
          .play()
          .then(() => {
            this.updatePlayerData();
            this.changeAudioPlayerStyle("show");
            this.changePlayButtonStyle("pause");
            this.playerDuration.textContent = this.timeFormatter(this.audioElm.duration);
          })
          .catch(() => new Toast("لطفا تا اتمام پردازش قبلی منتظر بمانید.", "error"));
      } else {
        new Toast("لطفا تا اتمام پردازش قبلی منتظر بمانید.", "error");
      }
    } finally {
      Loading.hide();
    }
  }

  updatePlayerData() {
    this.playerImage.src = this.soundData.srccover;
    this.playerName.innerHTML = `${this.soundData.title} <small class="d-block mt-2" id="player-podcast-name">${this.podcastData.name}</small>`;
    this.playerCurrentTime.textContent = "0:00";
    this.audioElm.setAttribute("data-playing-id", this.soundId);
    this.index = this.soundsList.findIndex((sound) => sound.id == this.soundId);
  }

  checkCurrentPlaying() {
    if (this.audioElm.src && this.audioElm.duration > 0 && !this.audioElm.paused) {
      this.changePlayButtonStyle("played");
    }
  }

  //! Helper methods
  async getPodcastData() {
    this.podcastData = await App.getPodcastServices().findPodcast(this.podcastId);
  }

  async getSoundsList(id) {
    this.soundsList = await App.getSoundServices().getSounds(this.podcastId);
  }

  findTargetSound() {
    this.soundData = this.soundsList.find((sound) => sound.id == this.soundId);
  }

  changePlayButtonStyle(currentStatus) {
    this.playButtons = document.querySelectorAll(".sound-link");
    this.relatedButton = Array.from(this.playButtons).find(
      (button) => button.getAttribute("data-sound-id") == this.soundId
    );
    if (!this.relatedButton) {
      return;
    }
    if (currentStatus == "played") {
      this.playButtons.forEach((button) => {
        button.setAttribute("data-isPaused", "false");
        button.setAttribute("data-isPlaying", "false");
        button.classList.remove("played");
      });
      this.relatedButton.classList.add("played");
      this.relatedButton.setAttribute("data-isPlaying", "true");
      this.relatedButton.setAttribute("data-isPaused", "true");

      //! Player play-pause button
      this.audioPlayBtn.firstElementChild.classList.replace("fa-play", "fa-pause");
    } else if (currentStatus == "paused") {
      this.relatedButton.classList.remove("played");
      this.relatedButton.setAttribute("data-isPlaying", "false");

      //! Player play-pause button
      this.audioPlayBtn.firstElementChild.classList.replace("fa-pause", "fa-play");
    } else if (currentStatus == "rePlayed") {
      this.relatedButton.classList.add("played");
      this.relatedButton.setAttribute("data-isPlaying", "true");

      //! Player play-pause button
      this.audioPlayBtn.firstElementChild.classList.replace("fa-play", "fa-pause");
    }
  }

  changeAudioPlayerStyle(order) {
    this.audioWrapper.style.display = order == "show" ? "unset" : "none";
  }

  timeFormatter(timeByMiliSecond) {
    let currentTimeMinutes = Math.floor(timeByMiliSecond / 60);
    if (currentTimeMinutes < 10) {
      currentTimeMinutes = `0${currentTimeMinutes}`;
    }

    let currentTimeSeconds = Math.floor(timeByMiliSecond % 60);
    if (currentTimeSeconds < 10) {
      currentTimeSeconds = `0${currentTimeSeconds}`;
    }

    return `${currentTimeMinutes}:${currentTimeSeconds}`;
  }
}

export { SoundPlayerServices };
