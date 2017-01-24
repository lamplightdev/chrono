(() => {
  let Part;

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Part = require('./part');
  } else {
    Part = window.Part;
  }

  class Parts {
    constructor({
      parts: parts = [],
    } = {}) {
      this._parts = parts;

      this._nextId = this._parts.reduce((previous, part) => {
        if (part.getId() + 1 > previous) {
          return part.getId() + 1;
        }

        return previous;
      }, 0);
    }

    toObject() {
      return this.getParts().map(part => part.toObject());
    }

    static fromObject(data) {
      return new this({
        parts: data.map(datum => Part.fromObject(datum)),
      });
    }

    getParts() {
      return this._parts;
    }

    addPart(part) {
      part.setId(this._nextId);
      this._parts.push(part);
      this._nextId += 1;

      return part;
    }

    savePart(part) {
      const existingPartIndex =
        this._parts.findIndex(existingPart => existingPart.getId() === part.getId());
      this._parts[existingPartIndex] = part;

      return part;
    }

    deletePart(partId) {
      const existingPartIndex =
        this._parts.findIndex(existingPart => existingPart.getId() === partId);

      return this._parts.splice(existingPartIndex, 1);
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Parts;
  } else {
    window.Parts = Parts;
  }
})();
