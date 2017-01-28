const Part = require('./part');
const Parts = require('./parts');

class State {
  constructor({
    route = {
      id: 'home',
    },
    parts = new Parts(),
  } = {}) {
    this.route = route;
    this.parts = parts;
  }

  toObject() {
    return {
      parts: this.parts.toObject(),
      route: this.route,
    };
  }

  static fromObject(data) {
    try {
      return new this({
        route: data.route,
        parts: Parts.fromObject(data.parts),
      });
    } catch (err) {
      return new this({
        route: {
          id: 'home',
        },
        parts: new Parts(),
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
}

module.exports = State;
