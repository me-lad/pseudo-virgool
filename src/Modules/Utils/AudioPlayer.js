import { App } from "../App";

class AudioPlayer {
  constructor() {
    //! Getting needed variables
    this.audioWrapper = document.querySelector(".audio-wrapper");
    this.audioElm = document.getElementById("audio-element");
    this.audioImage = document.getElementById("player-sound-img");
    this.audioName = document.getElementById("player-sound-name");
    this.currentTimeElm = document.getElementById("current-time");
    this.durationElm = document.getElementById("duration");
    this.audioRepeatBtn = document.getElementById("repeat");
    this.audioPreviousBtn = document.getElementById("previous");
    this.audioPlayBtn = document.getElementById("play-pause");
    this.audioNextBtn = document.getElementById("next");
    this.progressBox = document.querySelector(".audio-wrapper__progress-box");
    this.rangeInput = document.querySelector(".audio-wrapper__progress-input");
    this.volumeControl = document.getElementById("volume");
    this.progressInput = document.querySelector(".audio-wrapper__volumeHandler-input");
    this.volumeOutput = document.querySelector(".audio-wrapper__volumeHandler-output");

    //! Setting default value
    this.rangeInput.value = 0;
    this.progressInput.value = 1;
    this.index = null;
    this.isLoading = false;
  }

  initializePlayer() {
    //! Storing variables
    this.soundButtons = document.querySelectorAll(".sound-link");

    //! Setting the handler for each button
    this.soundButtons.forEach(
      (btn) =>
        (btn.onclick = (event) => {
          const target = event.currentTarget,
            soundId = target.getAttribute("data-sound-id"),
            podcastId = target.getAttribute("data-podcast-id");

          this.beforePlay(soundId, podcastId);
        })
    );

    //! Checking the sound playing after the page changing
    const relatedSoundButton = this.findRelatedSoundBtn();
    this.soundBtnStyleHandler(relatedSoundButton);
  }

  async beforePlay(soundId, podcastId) {
    if (soundId && podcastId) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      //! Getting all needed data
      this.relatedPodcast = await this.findRelatedPodcast(podcastId);
      this.relatedSounds = await this.fetchRelatedSounds(podcastId);
      const soundData = this.findTargetSound(soundId, this.relatedSounds),
        targetSound = soundData[0],
        targetSoundIndex = soundData[1];
      this.index = targetSoundIndex;
      const relatedSoundButton = this.findRelatedSoundBtn(soundId);

      //! Render the player
      this.soundBtnStyleHandler(relatedSoundButton);
      await this.renderPlayer(targetSound);
      this.isLoading = false;
    } else {
      return;
    }
  }

  async renderPlayer(targetSound) {
    //! Check the order (play || pause) and do that
    const relatedSoundButton = this.findRelatedSoundBtn(targetSound.id);
    const currentSoundStatus = relatedSoundButton.getAttribute("data-isPlaying") == "true" ? "played" : "paused";

    if (currentSoundStatus == "played") {
      //! Updating audio player data
      if (!(this.audioElm.getAttribute("data-playing-id") == targetSound.id)) {
        this.audioElm.src = targetSound.podcasturl;
        this.audioImage.src = targetSound.srccover;
        this.audioName.innerHTML = `${targetSound.title} <small class="d-block mt-2" id="player-podcast-name">${this.relatedPodcast.name}</small>`;
        this.audioWrapper.style.display = "unset";
        this.audioElm.setAttribute("data-playing-id", targetSound.id);
      }

      //! Play sound
      await this.audioElm.play();
      this.audioPlayBtn.firstElementChild.classList.remove("fa-play");
      this.audioPlayBtn.firstElementChild.classList.add("fa-pause");

      //! Updating the audio player duration value by the current playing data
      this.durationElm.textContent = this.timeFormatter(this.audioElm.duration);
    } else {
      await this.audioElm.pause();
      this.audioPlayBtn.firstElementChild.classList.add("fa-play");
      this.audioPlayBtn.firstElementChild.classList.remove("fa-pause");
    }
  }

  //! Event handlers
  eventCaller() {
    //! Time events
    this.audioElm.addEventListener("timeupdate", this.liveTimeHandler.bind(this));
    this.progressBox.addEventListener("mousedown", () => {
      this.audioElm.pause();
      this.rangeInput.addEventListener("input", this.timeChangeHandler.bind(this));
    });

    //! Volume events
    this.progressInput.addEventListener("input", this.volumeChangeHandler.bind(this));
    this.volumeControl.addEventListener("click", this.volumeClickHandler.bind(this));

    //! Play-Pause event
    this.audioPlayBtn.addEventListener("click", this.playPauseHandler.bind(this));

    //! Reapeat event
    this.audioRepeatBtn.addEventListener("click", () => (this.audioElm.currentTime = 0));

    //! Previous & Next events
    this.audioNextBtn.addEventListener("click", this.changeSoundHandler.bind(this));
    this.audioPreviousBtn.addEventListener("click", this.changeSoundHandler.bind(this));
  }

  liveTimeHandler(event) {
    //! Storing variables
    const target = event.target;
    const currentTime = target.currentTime;
    const duration = target.duration;

    //! Check that the last current time value is less the the duration
    if (
      this.currentTimeElm.textContent.slice(0, 2) == this.durationElm.textContent.slice(0, 2) &&
      this.currentTimeElm.textContent.slice(3, 5) == this.durationElm.textContent.slice(3, 5)
    ) {
      return;
    }

    //! Updating the player values
    this.currentTimeElm.textContent = this.timeFormatter(currentTime);
    const newValue = (currentTime / duration) * this.rangeInput.max;
    this.rangeInput.value = newValue;
  }

  timeChangeHandler(event) {
    //! Storing variables
    const target = event.target;
    const targetValue = target.value;
    const maxValue = target.max;

    //! Calculating the clicked point time
    const targetTime = (targetValue / maxValue) * this.audioElm.duration;

    //! Updating the value
    this.audioElm.currentTime = targetTime;
    this.currentTimeElm.textContent = this.timeFormatter(targetTime);

    //! Setting the time update event again
    this.progressBox.addEventListener("mouseup", () => this.audioElm.play());
  }

  volumeChangeHandler(event) {
    //! Storing variables
    const target = event.target;
    const targetValue = +target.value;

    //! Calculating the output bottom css property value
    let newOutputPosition = (targetValue / event.target.max) * 100;
    newOutputPosition = newOutputPosition <= 80 ? newOutputPosition : 80;

    //! Updating the values
    this.audioElm.volume = targetValue;
    this.volumeOutput.style.bottom = `${newOutputPosition}%`;
    this.volumeOutput.textContent = Math.floor(targetValue.toFixed(2) * 100);
  }

  volumeClickHandler(event) {
    //! Storing variables
    const target = event.target;
    const currentVolume = this.audioElm.volume;

    //! Checking the clicked point
    if (target.tagName !== "I") {
      return;
    }

    //! Updating the values
    if (currentVolume > 0) {
      this.audioElm.volume = 0;
      target.classList.add("fa-volume-xmark");
      this.volumeOutput.textContent = "0";
      this.volumeOutput.style.bottom = "0";
      this.progressInput.value = 0;
    } else {
      this.audioElm.volume = 1;
      target.classList.remove("fa-volume-xmark");
      this.volumeOutput.textContent = "100";
      this.volumeOutput.style.bottom = "80%";
      this.progressInput.value = 1;
    }
  }

  playPauseHandler() {
    const relatedSoundButton = this.findRelatedSoundBtn();
    this.soundBtnStyleHandler(relatedSoundButton);
    relatedSoundButton.getAttribute("data-isPlaying") == "true" ? this.audioElm.play() : this.audioElm.pause();
  }

  async changeSoundHandler(event) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    //! Storing variables
    const target = event.currentTarget;
    const targetType = target.id;

    //! Updating the sound index
    if (targetType == "next") {
      this.index++;
      if (this.index > this.relatedSounds.length - 1) {
        this.index = 0;
      }
    } else if (targetType == "previous") {
      this.index--;
      if (this.index < 0) {
        this.index = this.relatedSounds.length - 1;
      }
    } else {
      return;
    }

    //! Getting the target sound by index and calling the propper functions
    const targetSound = this.relatedSounds[this.index];
    const relatedSoundButton = this.findRelatedSoundBtn(targetSound.id);
    this.soundBtnStyleHandler(relatedSoundButton);
    await this.renderPlayer(targetSound);
    this.isLoading = false;
  }

  //! Helper methods
  async findRelatedPodcast(id) {
    const podcastsData = await App.getPodcastServices().getPodcasts();
    return podcastsData.find((podcast) => podcast.id == id);
  }

  async fetchRelatedSounds(podcastId) {
    const { data: result } = await App.getSoundServices().fetchSounds(podcastId, 20);
    if (result.sounds) {
      return result.sounds;
    }
  }

  findTargetSound(soundId, soundsList) {
    const targetSoundIndex = soundsList.findIndex((sound) => sound.id == soundId);
    return [soundsList[targetSoundIndex], targetSoundIndex];
  }

  findRelatedSoundBtn(soundId) {
    const targetId = soundId ? soundId : this.audioElm.getAttribute("data-playing-id");
    return Array.from(this.soundButtons).find((btn) => btn.getAttribute("data-sound-id") == targetId);
  }

  soundBtnStyleHandler(btn) {
    if (btn) {
      if (btn.getAttribute("data-isPlaying") == "true") {
        btn.classList.remove("played");
        btn.setAttribute("data-isPlaying", "false");
        this.audioPlayBtn.firstElementChild.classList.add("fa-play");
        this.audioPlayBtn.firstElementChild.classList.remove("fa-pause");
      } else {
        this.soundButtons.forEach((btn) => {
          btn.classList.remove("played");
          btn.setAttribute("data-isPlaying", false);
        });
        btn.classList.add("played");
        btn.setAttribute("data-isPlaying", "true");
        this.audioPlayBtn.firstElementChild.classList.remove("fa-play");
        this.audioPlayBtn.firstElementChild.classList.add("fa-pause");
      }
    } else {
      return;
    }
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

export { AudioPlayer };
