const templateTimers = require('../elements/timers/template');

const template = (args = {}) => {
  const state = args.state;

  return `
    <h1>Timers</h1>
    <chrono-timeradd></chrono-timeradd>

    <chrono-timers state='${JSON.stringify(state.timers)}'>
      ${templateTimers(state.timers)}
    </chrono-timers>
  `;
};

module.exports = template;
