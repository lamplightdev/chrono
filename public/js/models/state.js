const Part = require('./part');
const Parts = require('./parts');

let nextTimerId = 0;

class State {
  constructor({
    route = {
      id: 'home',
    },
    parts = new Parts(),
    timers = [],
  } = {}) {
    this.route = route;
    this.parts = parts;
    this.timers = timers;
  }

  toObject() {
    return {
      parts: this.parts.toObject(),
      route: this.route,
      timers: this.timers,
    };
  }

  static fromObject(data) {
    try {
      return new this({
        route: data.route,
        parts: Parts.fromObject(data.parts),
        timers: data.timers,
      });
    } catch (err) {
      return new this({
        route: {
          id: 'home',
          title: 'Home',
          path: '/',
        },
        parts: new Parts(),
        timers: [],
      });
    }
  }

  changeRoute(route) {
    this.route = route;
  }

  getParts() {
    return this.parts;
  }

  addPart() {
    return this.parts.addPart(new Part());
  }

  savePart(data) {
    return this.parts.savePart(new Part(data));
  }

  deletePart(id) {
    return this.parts.deletePart(id);
  }

  addTimer(start) {
    const timer = {
      start,
      end: null,
    };

    timer.id = nextTimerId;
    nextTimerId += 1;

    this.timers.push(timer);

    return timer;
  }

  endTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.end = data.time;
  }

  pauseTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.paused = !foundTimer.paused;
  }
}

module.exports = State;
