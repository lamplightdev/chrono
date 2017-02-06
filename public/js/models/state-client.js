const State = require('./state');

class StateClient extends State {
  changeRoute(route) {
    super.changeRoute(route);

    if (route.replace) {
      history.replaceState(route, route.title, route.path);
    } else {
      history.pushState(route, route.title, route.path);
    }

    document.title = `Kleene - ${route.title}`;
  }
}

module.exports = StateClient;
