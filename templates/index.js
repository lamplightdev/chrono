const template = (args) => {
  const state = {
    parts: args.parts,
  };

  const stateString = JSON.stringify(state);

  const templatePart = (part) => (`

    <form action='/save/${part.id}' method='post'>
      <input type='hidden' name='id' value='${part.id}' />
      <select name='type'>
        <option value='startOfLine' ${part.type === 'startOfLine' ? 'selected' : ''}>startOfLine</option>
        <option value='then' ${part.type === 'then' ? 'selected' : ''}>then</option>
      </select>
      <input name='string' type='text' value='${part.string}' />
      <button>Save</button>
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
          <kleene-parts state='${JSON.stringify(state.parts)}'>
            ${state.parts.map((part) => {
              return templatePart(part);
            }).join('')}
          </kleene-parts>

          <kleene-add>
            <form action='/add' method='post'>
              <button>Add</button>
            </form>
          </kleene-add>
        </main>

        <footer>
        </footer>
      </div>
    </kleene-state>

    <template id="kleene-part">
      ${templatePart({
        id: '',
        string: '',
        type: '',
      })}
    </template>

    <script src='js/elements/state.js'></script>
    <script src='js/elements/add.js'></script>
    <script src='js/elements/parts.js'></script>
    <script src='js/elements/part.js'></script>
  </body>

</html>
`;
};

module.exports = template;
