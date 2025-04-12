//! This module hanldes the bottom page audio player events
import { Toast } from "./Toast";

class Player {
  constructor(data) {
    //! Storing variables
    this.progressBox = document.querySelector(".audio-wrapper__progress-box");
    this.progressInput = document.querySelector(".audio-wrapper__progress-input");
    this.volumeInput = document.querySelector(".audio-wrapper__volumeHandler-input");
    this.volumeOutput = document.querySelector(".audio-wrapper__volumeHandler-output");
    this.volumeControl = document.getElementById("volume");
    this.audioRepeatBtn = document.getElementById("repeat");
    this.audioPreviousBtn = document.getElementById("previous");
    this.audioNextBtn = document.getElementById("next");
    this.closePlayerButton = document.getElementById("close-player");

    //! Storing the sound player services class
    this.data = data;
    this.isLoading = false;
  }
  eventCaller() {
    //! Time events
    this.data.audioElm.addEventListener("timeupdate", this.liveTimeHandler.bind(this));
    this.progressBox.addEventListener("mousedown", () => {
      this.data.audioElm.pause();
      this.progressInput.addEventListener("input", this.timeChangeHandler.bind(this));
    });

    //! Volume events
    this.volumeInput.addEventListener("input", this.volumeChangeHandler.bind(this));
    this.volumeControl.addEventListener("click", this.volumeClickHandler.bind(this));

    //! Play-Pause event
    this.data.audioPlayBtn.addEventListener("click", this.playPauseHandler.bind(this));

    //! Reapeat event
    this.audioRepeatBtn.addEventListener("click", () => (this.data.audioElm.currentTime = 0));

    //! Previous & Next events
    this.audioNextBtn.addEventListener("click", this.changeSoundHandler.bind(this));
    this.audioPreviousBtn.addEventListener("click", this.changeSoundHandler.bind(this));

    //! Close player event
    this.closePlayerButton.addEventListener("click", this.closePlayer.bind(this));
  }

  liveTimeHandler(event) {
    //! Storing variables
    const target = event.target;
    const currentTime = target.currentTime;
    const duration = target.duration;

    //! Check that the last current time value is less the the duration
    if (
      this.data.playerCurrentTime.textContent.slice(0, 2) == this.data.playerDuration.textContent.slice(0, 2) &&
      this.data.playerCurrentTime.textContent.slice(3, 5) == this.data.playerDuration.textContent.slice(3, 5)
    ) {
      return;
    }

    //! Updating the player values
    this.data.playerCurrentTime.textContent = this.data.timeFormatter(currentTime);
    const newValue = (currentTime / duration) * this.progressInput.max;
    this.progressInput.value = newValue;
  }

  timeChangeHandler(event) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    //! Storing variables
    const target = event.target;
    const targetValue = target.value;
    const maxValue = target.max;

    //! Calculating the clicked point time
    const targetTime = (targetValue / maxValue) * this.data.audioElm.duration;

    //! Updating the value
    this.data.audioElm.currentTime = targetTime;
    this.data.playerCurrentTime.textContent = this.data.timeFormatter(targetTime);

    //! Setting the time update event again
    this.progressBox.addEventListener("mouseup", async () => {
      try {
        await this.data.audioElm.play();
      } catch (error) {
        new Toast("لطفا تا اتمام پردازش قبلی منتظر بمانید.", "error", 3000);
      }
    });
    this.isLoading = false;
  }

  volumeChangeHandler(event) {
    //! Storing variables
    const target = event.target;
    const targetValue = +target.value;

    //! Calculating the output bottom css property value
    let newOutputPosition = (targetValue / event.target.max) * 100;
    newOutputPosition = newOutputPosition <= 80 ? newOutputPosition : 80;

    //! Updating the values
    this.data.audioElm.volume = targetValue;
    this.volumeOutput.style.bottom = `${newOutputPosition}%`;
    this.volumeOutput.textContent = Math.floor(targetValue.toFixed(2) * 100);

    if (targetValue == 0) {
      this.volumeControl.firstElementChild.classList.add("fa-volume-xmark");
    } else {
      this.volumeControl.firstElementChild.classList.remove("fa-volume-xmark");
    }
  }

  volumeClickHandler(event) {
    //! Storing variables
    const target = event.target;
    const currentVolume = this.data.audioElm.volume;

    //! Checking the clicked point
    if (target.tagName !== "I") {
      return;
    }

    //! Updating the values
    if (currentVolume > 0) {
      this.data.audioElm.volume = 0;
      target.classList.add("fa-volume-xmark");
      this.volumeOutput.textContent = "0";
      this.volumeOutput.style.bottom = "0";
      this.volumeInput.value = 0;
    } else {
      this.data.audioElm.volume = 1;
      target.classList.remove("fa-volume-xmark");
      this.volumeOutput.textContent = "100";
      this.volumeOutput.style.bottom = "80%";
      this.volumeInput.value = 1;
    }
  }

  playPauseHandler(event) {
    const target = event.currentTarget.firstElementChild,
      isPlaying = target.classList.contains("fa-pause");

    isPlaying
      ? this.data.handlePlayProcess(this.data.soundId, this.data.podcastId, "pause")
      : this.data.handlePlayProcess(this.data.soundId, this.data.podcastId, "resume");
  }

  async changeSoundHandler(event) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    //! Storing variables
    const target = event.currentTarget;
    const targetType = target.id;
    let index = this.data.index;

    if (targetType == "next") {
      index--;
      if (index < 0) {
        index = this.data.soundsList.length - 1;
      }
    } else if (targetType == "previous") {
      index++;
      if (index >= this.data.soundsList.length) {
        index = 0;
      }
    }

    const targetSound = this.data.soundsList[index];
    await this.data.handlePlayProcess(targetSound.id, targetSound.publisher, "play");

    this.isLoading = false;
  }

  closePlayer() {
    this.data.audioElm.src = "";
    this.data.changeAudioPlayerStyle("hide");
    this.data.changePlayButtonStyle("paused");
    this.data.relatedButton.setAttribute("data-isPaused", "false");
  }
}

export { Player };
