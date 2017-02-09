const template = (args = {}) => {
  const state = args.state;

  return `
    <chrono-pagetimers state='${JSON.stringify(state)}'></chrono-pagetimers>
  `;
};

module.exports = template;
