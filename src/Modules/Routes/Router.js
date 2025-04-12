class Router {
  constructor(allPages) {
    this.allPages = allPages;
    this.container = document.getElementById("container");
  }

  navigateToRoute(route, isPopState = false, routeId = null) {
    const targetPage = this.allPages.find((page) => page.pageName === route);
    if (targetPage) {
      targetPage.renderContent(this.container, routeId);
      if (!isPopState) {
        history.pushState({ content: `${route}?${routeId}` }, "", route);
      }
    }
  }
}

export { Router };
