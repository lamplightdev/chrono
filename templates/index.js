const template = (args) => {
  const parts = args.parts;

  const state = {
    parts,
  };

  const stateString = JSON.stringify(state);

  const templatePart = (part) => (`
    <kleene-part>
      <form action='/save/${part.id}' method='post'>
        <input type='hidden' name='id' value='${part.id}' />
        <select name='type'>
          <option value='startOfLine' ${part.type === 'startOfLine' ? 'selected' : ''}>startOfLine</option>
          <option value='then' ${part.type === 'then' ? 'selected' : ''}>then</option>
        </select>
        <input name='string' type='text' value='${part.string}' />
        <button>Save</button>
      </form>
    </kleene-part>
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

    <header>
    </header>

    <main>
        <kleene-parts>
        ${parts.map((part) => {
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

    <template id="part">
      ${templatePart({
        id: '',
        string: '',
        type: '',
      })}
    </template>

    <script src='js/elements/add.js'></script>
    <script src='js/elements/parts.js'></script>
    <script src='js/elements/part.js'></script>

    <script>
      const Kleene = JSON.parse('${stateString}');

      const add = document.querySelector('kleene-add');
      const parts = document.querySelector('kleene-parts');

      add.addEventListener('added', (event) => {
        // TODO: update parts attribute
        console.log('added', event.detail);
        add.setAttribute('state', 'blah');
        parts.addPart();
      });
    </script>
    <script src='js/app.js'></script>
  </body>

</html>
`;
};

module.exports = template;
