const templateTimers = require('../elements/timers/template');

const template = (args = {}) => {
  const state = args.state;

  return `
    <h1>Timers</h1>
    <kleene-timeradd></kleene-timeradd>

    <kleene-timers>
      ${templateTimers(state.timers)}
    </kleene-timers>
  `;
};

module.exports = template;
