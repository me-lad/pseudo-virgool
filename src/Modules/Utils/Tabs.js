//! This module handles the dashbord and setting tabs click event
class Tabs {
  constructor() {
    this.tabsClicker();
  }

  tabsClicker() {
    const tabs = document.querySelectorAll(".dashboard__item");
    tabs.forEach((link, index) => {
      link.onclick = (event) => {
        tabs.forEach((link) => link.classList.remove("active"));
        this.showRelatedSection(event.currentTarget, index);
      };
    });
  }

  showRelatedSection(selectedLink, tabIndex) {
    //! Storing variables and finding the related section
    const settingSections = Array.from(document.querySelectorAll(".section-item")),
      relatedSection = settingSections[tabIndex];

    //! Showing the finded section and hiding the all other sections
    settingSections.forEach((section) => section.classList.add("d-none"));
    relatedSection.classList.remove("d-none");
    selectedLink.classList.add("active");
  }
}

export { Tabs };
