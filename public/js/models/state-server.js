const State = require('./state');

class StateServer extends State {
  addPart() {
    const part = super.addPart();

    return part;
  }

  savePart(data) {
    const part = super.savePart(data);

    return part;
  }

  deletePart(id) {
    const part = super.deletePart(id);

    return part;
  }
}

module.exports = StateServer;
