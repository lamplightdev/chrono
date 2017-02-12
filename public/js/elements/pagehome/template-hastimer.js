const templateTimerFull = require('../timerfull/template');

const template = (timer = false) => {
  if (timer) {
    return `
      <chrono-timerfull state='${JSON.stringify(timer)}' minimiseToSelector='#item'>
        ${templateTimerFull(timer)}
      </chrono-timerfull>
    `;
  } else {
    return '<chrono-timerfull></chrono-timerfull>';
  }
};

module.exports = template;
