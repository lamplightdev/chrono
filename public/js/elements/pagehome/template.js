const templateTimers = require('../timers/template');

const template = (timers = []) => {

  return `
    <chrono-timeradd></chrono-timeradd>

    <chrono-timers hidesplits state='${JSON.stringify(timers)}'>
      ${templateTimers(timers)}
    </chrono-timers>

    <div id='no-timers' class='${!timers.length ? 'show' : ''}'>
      <h3>No timers</h3>
    </div>
  `;
};

module.exports = template;
