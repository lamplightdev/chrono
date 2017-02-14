const templateTimerBrief = require('../timerbrief/template');
const templateTimerFull = require('../timerfull/template');

module.exports = (timers = [], isFull = false) => (`
  <div id='timers'>
    ${[...timers].reverse().map(timer => (
      isFull ? templateTimerFull(timer) : templateTimerBrief(timer)
    )).join('')}
  </div>
`);
