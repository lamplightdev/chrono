(() => {
  class Part {
    constructor({
      id: id = null,
      type: type = null,
      string: string = '',
    } = {}) {
      this._id = id;
      this._type = type;
      this._string = string;
    }

    toObject() {
      return {
        id: this.getId(),
        type: this.getType(),
        string: this.getString(),
      };
    }

    static fromObject(data) {
      return new this(data);
    }

    setId(id) {
      this._id = id;
    }

    getId() {
      return this._id;
    }

    setType(type) {
      this._type = type;
    }

    getType() {
      return this._type;
    }

    setString(string) {
      this._string = string;
    }

    getString() {
      return this._string;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Part;
  } else {
    window.Part = Part;
  }
})();
