const templateHome = (args) => {
  const state = args.state;

  return `
    <chrono-pagehome state='${JSON.stringify(state)}'></chrono-pagehome>
  `;
};

module.exports = templateHome;
