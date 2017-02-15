const State = require('./state');

class StateClient extends State {
  changeRoute(routeData) {
    super.changeRoute(routeData);

    const currentRoute = this.routes.find(route => route.id === routeData.id);

    let path = currentRoute.path;

    switch (currentRoute.id) {
      case 'home':
        if (typeof currentRoute.params.id !== 'undefined') {
          path = `${path}/${currentRoute.params.id}`;
        }
        break;
      default:
        break;
    }

    if (routeData.replace) {
      history.replaceState(currentRoute, currentRoute.title, path);
    } else {
      history.pushState(currentRoute, currentRoute.title, path);
    }

    document.title = `Chrono - ${currentRoute.title}`;
  }
}

module.exports = StateClient;
