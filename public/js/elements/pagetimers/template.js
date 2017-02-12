const templateTimers = require('../timers/template');

const template = (timers = []) => {

  return `
    <chrono-timers state='${JSON.stringify(timers)}'>
      ${templateTimers(timers)}
    </chrono-timers>
  `;
};

module.exports = template;
