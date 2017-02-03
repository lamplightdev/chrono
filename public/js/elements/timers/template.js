const templateTimer = require('../timer/template');

module.exports = (timers = []) => (`
  <div id='timers'>
    ${timers.map(timer => (
      templateTimer(timer)
    )).join('')}
  </div>
`);
