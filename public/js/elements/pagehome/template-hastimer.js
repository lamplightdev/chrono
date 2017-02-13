const templateTimerFull = require('../timerfull/template');

const template = (timer = false) => {
  if (timer) {
    return `
      <chrono-timerfull state='${JSON.stringify(timer)}' minimiseToSelector='#item'>
        ${templateTimerFull(timer)}
      </chrono-timerfull>
    `;
  }

  return '<chrono-timerfull minimiseToSelector="#item"></chrono-timerfull>';
};

module.exports = template;
