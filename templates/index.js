const template = (args) => {
  const parts = args.parts;

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
        ${parts.map((part, partIndex) => {
          return `
            <kleene-part>
              <form action='/save/${partIndex}' method='post'>
                <input type='hidden' name='id' value='${partIndex}' />
                <select name='type'>
                  <option value='startOfLine' ${part.type === 'startOfLine' ? 'selected' : ''}>startOfLine</option>
                  <option value='then' ${part.type === 'then' ? 'selected' : ''}>then</option>
                </select>
                <input name='string' type='text' value='${part.string}' />
                <button>Save</button>
              </form>
            </kleene-part>
          `;
        }).join('')}

      <form action='/add' method='post'>
        <button>Add</button>
      </form>
    </main>

    <footer>
    </footer>

    <script src='js/elements/part.js'></script>

    <script>
      const Kleene = {
        parts: JSON.parse('${JSON.stringify(parts)}'),
      };
    </script>
    <script src='js/app.js'></script>
  </body>

</html>
`;
};

module.exports = template;
