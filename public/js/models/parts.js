class Parts {
  constructor(parts = []) {
    this._parts = parts;

    this._nextId = this._parts.reduce((previous, part) => {
      if (part.getId() + 1 > previous) {
        return part.getId() + 1;
      }

      return previous;
    }, 0);
  }

  getParts() {
    return this._parts;
  }

  addPart(part) {
    part.setId(this._nextId);
    this._parts.push(part);
    this._nextId += 1;
  }

  savePart(part) {
    const existingPartIndex =
      this._parts.findIndex(existingPart => existingPart.getId() === part.getId());
    this._parts[existingPartIndex] = part;
  }

  deletePart(partId) {
    this._parts = this._parts.filter(existingPart => existingPart.getId() !== partId);
  }
}

if (typeof module !== 'undefined') {
  module.exports = Parts;
}
