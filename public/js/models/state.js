(() => {
  let Part;
  let Parts;

  if (typeof module !== 'undefined' && module.exports) {
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

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = State;
  } else {
    window.State = State;
  }
})();
