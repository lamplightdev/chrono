const Part = require('./part');
const Parts = require('./parts');

class State {
  constructor({
    parts = new Parts(),
  } = {}) {
    this.parts = parts;
  }

  toObject() {
    return {
      parts: this.parts.toObject(),
    };
  }

  static fromObject(data) {
    try {
      return new this({
        parts: Parts.fromObject(data.parts),
      });
    } catch (err) {
      return new this({
        parts: new Parts(),
      });
    }
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
