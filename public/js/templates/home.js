const templateParts = require('../elements/parts/template');

const templateHome = (args) => {
  const state = args.state;

  return `
    <kleene-parts>
      ${templateParts(state.parts)}
    </kleene-parts>
  `;
};

module.exports = templateHome;
