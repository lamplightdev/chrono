(() => {
  let State;

  if (typeof module !== 'undefined' && module.exports) {
    State = require('./state');
  } else {
    State = window.State;
  }

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

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateServer;
  } else {
    window.StateServer = StateServer;
  }
})();
