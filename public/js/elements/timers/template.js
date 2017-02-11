const templateTimer = require('../timer/template');
const templateTimerFull = require('../timerfull/template');

module.exports = (timers = [], isFull = false) => (`
  <div id='timers'>
    ${timers.map(timer => (
      isFull ? templateTimerFull(timer) : templateTimer(timer)
    )).join('')}
  </div>
`);
