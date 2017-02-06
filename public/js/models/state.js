let nextTimerId = 0;

class State {
  constructor({
    route = {
      id: 'home',
    },
    timers = [],
  } = {}) {
    this.route = route;
    this.timers = timers;
  }

  toObject() {
    return {
      route: this.route,
      timers: this.timers,
    };
  }

  static fromObject(data) {
    try {
      return new this({
        route: data.route,
        timers: data.timers,
      });
    } catch (err) {
      return new this({
        route: {
          id: 'home',
          title: 'Home',
          path: '/',
        },
        timers: [],
      });
    }
  }

  changeRoute(route) {
    this.route = route;
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
    foundTimer.paused = !foundTimer.paused;
  }

  splitTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.splits.push(data.time - foundTimer.start);
  }
}

module.exports = State;
