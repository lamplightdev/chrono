class Part {
  constructor(id = null, type = null, string = '') {
    this._id = id;
    this._type = type;
    this._string = string;
  }

  getParams() {
    return {
      id: this.getId(),
      type: this.getType(),
      string: this.getString(),
    };
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

if (typeof module !== 'undefined') {
  module.exports = Part;
}
