(() => {
  let Part;
  let Parts;

  if (typeof module !== 'undefined' && module.exports) {
    Part = require('../models/part');
    Parts = require('../models/parts');
  } else {
    Part = window.Part;
    Parts = window.Parts;
  }

  const templateHome = (args) => {
    const state = args.state;

    const stateString = JSON.stringify(state.toObject());

    const typeOptions = [
      'startOfLine',
      'then',
      'maybe',
      'anything',
      'endOfLine',
    ];

    const templatePart = part => (`
      <form id='save' action='/part/${part.getId()}' method='post'>
        <input type='hidden' name='method' value='save'>
        <input type='hidden' name='id' value='${part.getId()}' />
        <div class='select-outer'>
          <select name='type'>
            ${typeOptions.map(type => (
              `<option value='${type}' ${part.getType() === type ? 'selected' : ''}>${type}</option>`
            )).join('')}
          </select>
        </div>
        <input name='string' type='text' value='${part.getString()}' />
        <button>Save</button>
      </form>
      <form id='delete' action='/part/${part.getId()}}' method='post'>
        <input type='hidden' name='method' value='delete'>
        <input type='hidden' name='id' value='${part.getId()}' />
        <button>Delete</button>
      </form>
    `);

    const templateParts = parts => (`
      <div id='parts'>
        ${parts.getParts().map(part => (
          templatePart(part)
        )).join('')}
      </div>

      <form id='add' action='/part' method='post'>
        <button>Add</button>
      </form>

      <form id='calculate' action='/calculate' method='post'>
        <input type='hidden' name='parts' value='${JSON.stringify(parts.toObject())}'>
        <textarea name='input'>This is some text that I wrote http://lamplightdev.com</textarea>
        <button>Calculate</button>
        <div id='regexp'></div>
      </form>
    `);

    return `
      <kleene-state state='${stateString}'>
        <div slot='main'>
          <kleene-parts>
            ${templateParts(state.getParts())}
          </kleene-parts>
        </div>
      </kleene-state>

      <template id="kleene-part">
        ${templatePart(new Part())}
      </template>

      <template id="kleene-parts">
        ${templateParts((new Parts()))}
      </template>
    `;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = templateHome;
  } else {
    window.templateHome = templateHome;
  }
})();
