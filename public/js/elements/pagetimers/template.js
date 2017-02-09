const templateTimers = require('../timers/template');

const template = (timers = []) => {

  return `
    <h1>Timers</h1>
    <chrono-timeradd></chrono-timeradd>
    <chrono-timerreset></chrono-timerreset>

    <chrono-timers state='${JSON.stringify(timers)}'>
      ${templateTimers(timers)}
    </chrono-timers>
  `;
};

module.exports = template;
