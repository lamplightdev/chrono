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

  addPart() {
    const part = super.addPart();

    fetch('/api/part', {
      method: 'put',
    })
    .then(response => response.json())
    .then((data) => {
      console.log('addPart request succeeded with JSON response', data);
    })
    .catch((error) => {
      console.log('addPart request failed', error);
    });

    return part;
  }

  savePart(data) {
    const part = super.savePart(data);

    fetch(`/api/part/${part.getId()}`, {
      method: 'post',
      body: JSON.stringify(part.toObject()),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(response => response.json())
    .then((jsonData) => {
      console.log('savePart request succeeded with JSON response', jsonData);
    })
    .catch((error) => {
      console.log('savePart request failed', error);
    });

    return part;
  }

  deletePart(id) {
    const part = super.deletePart(id);

    fetch(`/api/part/${id}`, {
      method: 'delete',
    })
    .then(response => response.json())
    .then((jsonData) => {
      console.log('deletePart request succeeded with JSON response', jsonData);
    })
    .catch((error) => {
      console.log('deletePart request failed', error);
    });

    return part;
  }
}

module.exports = StateClient;
