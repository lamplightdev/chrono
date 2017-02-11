const templateTimers = require('../timers/template');

const template = (timers = []) => {

  return `
    <chrono-timers isfull state='${JSON.stringify(timers)}'>
      ${templateTimers(timers)}
    </chrono-timers>

    <div id='no-timers' class='${!timers.length ? 'show' : ''}'>
      <chrono-timeradd></chrono-timeradd>
      <div>No timers</div>
    </div>
  `;
};

module.exports = template;
