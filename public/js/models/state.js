(() => {
  let Part;
  let Parts;

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Part = require('./part');
    Parts = require('./parts');
  } else {
    Part = window.Part;
    Parts = window.Parts;
  }

  class State {
    constructor({
      parts: parts = new Parts(),
    } = {}) {
      this.parts = parts;
    }

    stringify() {
      return JSON.stringify({
        parts: this.parts.toObject(),
      });
    }

    static parse(string) {
      try {
        const json = string ? JSON.parse(string) : {};

        return new this({
          parts: Parts.fromObject(json.parts),
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
      const part = new Part(data);
      return this.parts.savePart(part);
    }

    deletePart(id) {
      return this.parts.deletePart(id);
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = State;
  } else {
    window.State = State;
  }
})();
