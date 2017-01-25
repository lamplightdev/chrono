const Part = require('../public/js/models/part');
const Parts = require('../public/js/models/parts');

const template = (args) => {
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
<!DOCTYPE html>

<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport"
      content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes"
    >

    <title>Kleene</title>

    <link rel='stylesheet' href='css/app.css'>
  </head>

  <body>

    <kleene-state state='${stateString}'>
      <div slot='main'>
        <header>
        </header>

        <main>
          <kleene-parts>
            ${templateParts(state.getParts())}
          </kleene-parts>
        </main>

        <footer>
        </footer>
      </div>
    </kleene-state>

    <template id="kleene-part">
      ${templatePart(new Part())}
    </template>

    <template id="kleene-parts">
      ${templateParts((new Parts()))}
    </template>

    <script src='js/libs/verbalexpressions.js'></script>
    <script src='js/models/part.js'></script>
    <script src='js/models/parts.js'></script>
    <script src='js/models/state.js'></script>
    <script src='js/models/state-client.js'></script>
    <script src='js/elements/state.js'></script>
    <script src='js/elements/parts.js'></script>
    <script src='js/elements/part.js'></script>
  </body>

</html>
`;
};

module.exports = template;
