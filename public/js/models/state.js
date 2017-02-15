let nextTimerId = 0;

class State {
  constructor({
    routes = [],
    timers = [],
  } = {}) {
    this.routes = routes;
    this.timers = timers;
  }

  toObject() {
    return {
      routes: this.routes,
      timers: this.timers,
    };
  }

  static fromObject(data) {
    try {
      return new this({
        routes: data.routes,
        timers: data.timers,
      });
    } catch (err) {
      return new this({
        routes: [],
        timers: [],
      });
    }
  }

  changeRoute(routeData) {
    this.routes = this.routes.map(route => (
      Object.assign({}, route, {
        current: route.id === routeData.id,
        params: routeData.params || {},
      })
    ));
  }

  addTimer(start) {
    const timer = {
      id: false,
      start,
      end: false,
      paused: false,
      splits: [],
    };

    this.timers.push(Object.assign({}, timer, {
      id: nextTimerId,
    }));
    nextTimerId += 1;

    return timer;
  }

  resetTimer() {
    this.timers = [];
  }

  endTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.end = data.time;
  }

  pauseTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    if (foundTimer.paused) {
      foundTimer.start = data.time - foundTimer.paused;
      foundTimer.paused = false;
    } else {
      foundTimer.paused = data.time - foundTimer.start;
    }
  }

  splitTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.splits.push(data.time - foundTimer.start);
  }

  removeTimer(data) {
    const foundTimerIndex = this.timers.findIndex(timer => timer.id === data.id);
    this.timers.splice(foundTimerIndex, 1);
  }
}

module.exports = State;
