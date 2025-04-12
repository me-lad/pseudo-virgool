import { Page } from "../Models/Page.js";
import { App } from "../App.js";
import { Loading } from "../Utils/Loading.js";
import { SearchServices } from "../Services/SearchServices.js";
import { Toast } from "../Utils/Toast.js";

class Home extends Page {
  async beforeRender(content) {
    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;
    try {
      //! Show loading
      Loading.show();

      //! Posts render
      const postsWrapper = pageContent.querySelector("#post-container");
      const postTemplate = pageContent.querySelector("#post-template");
      const postsData = await App.getPostServices().getPosts();
      postsData.forEach((post) => postsWrapper.append(post.renderPost(postTemplate)));

      //! Podcasts render
      const podcastsWrapper = pageContent.querySelector("#podcast-wrapper");
      const podcastTemplate = pageContent.querySelector("#podcast-template");
      const podcastsData = await App.getPodcastServices().getPodcasts();
      pageContent.querySelector("#podcast-name").textContent = podcastsData[0].name;
      pageContent.querySelector("#podcast-page-btn").setAttribute("data-select-id", podcastsData[0].id);
      podcastsData.forEach((podcast) => podcastsWrapper.append(podcast.renderPodcast(podcastTemplate)));

      //! Categories render
      const categoriesWrapper = pageContent.querySelector("#category-wrapper");
      const categoryTemplate = pageContent.querySelector("#category-template");
      const categoriesData = await App.getCategoryServices().getCategories();
      categoriesData.forEach((category) => categoriesWrapper.append(category.renderCategory(categoryTemplate)));

      //! Sounds render
      const soundsWrapper = pageContent.querySelector("#sound-wrapper");
      const soundsTemplate = pageContent.querySelector("#sound-template");
      const soundsData = await App.getSoundServices().getSounds(podcastsData[0].id);
      if (soundsData.length) {
        soundsData.forEach((sound) => soundsWrapper.prepend(sound.renderSound(soundsTemplate)));
      } else {
        soundsWrapper.innerHTML = `<span class="w-100 d-flex justify-content-center fs-3">پادکستی از مجموعه <strong class="text-secondary mx-2">${podcastsData[0].name}</strong> یافت نشد.</span>`;
      }
    } catch (error) {
      new Toast("برای تجربه بهتر لطفا وارد حساب خود شوید.", "success");
    } finally {
      return pageContent.innerHTML;
    }
  }

  afterRender() {
    //! Hide loading
    Loading.hide();

    //! Podcasts slider
    App.getPodcastServices().initializePodcastsSlider();

    //! Podcasts click handdler (showing related sounds)
    this.podcastsClickHandler();

    //! Set logout event
    if (App.getAuthorizationServices().checkLoginStatus()) {
      App.getAccountCenterServices().setLogoutEvent();
    } else {
      App.getAccountCenterServices().removeLogoutEvent();
    }

    //! Search input
    new SearchServices();

    //! Podcast playing process
    document.querySelector("#sound-wrapper").onclick = App.getSoundServices().playSoundBtnClickHandler;
    App.getSoundPlayerServices().checkCurrentPlaying();
  }

  podcastsClickHandler() {
    const podcastLinks = document.querySelectorAll("#swiper-img");
    podcastLinks.forEach((link) =>
      link.addEventListener("click", async (event) => {
        const target = event.currentTarget,
          targetId = target.getAttribute("data-select-id"),
          targetName = target.getAttribute("alt");
        await App.getSoundServices().getRelatedSounds(targetId, targetName);
        App.getSoundPlayerServices().checkCurrentPlaying();
      })
    );
  }
}

export { Home };
