const templateParts = require('../elements/parts/template');

const templateHome = (args) => {
  const state = args.state;

  const stateString = JSON.stringify(state.toObject());

  return `
    <kleene-state state='${stateString}'>
      <div slot='main'>
        <kleene-parts>
          ${templateParts(state.getParts())}
        </kleene-parts>
      </div>
    </kleene-state>
  `;
};

module.exports = templateHome;
