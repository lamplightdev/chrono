const layoutPage = (args) => {
  const templateNavItem = item => (`
    <li><a href='${item.path}'>${item.title}</a></li>
  `);

  const templateNav = items => (`
    <nav>
      <ul>
      ${items.map(item => (
        templateNavItem(item)
      )).join('')}
      </ul>
    </nav>
  `);

  return `
<!DOCTYPE html>

<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport"
      content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes"
    >

    <title>${args.title}</title>

    <link rel='stylesheet' href='css/app.css'>
  </head>

  <body>

    <kleene-nav state='${JSON.stringify(args.navItems)}'>
      ${templateNav(args.navItems)}
    </kleene-nav>

    <main>${args.content}</main>

    <template id="kleene-nav">
      ${templateNav([])}
    </template>

    <template id="kleene-navitem">
      ${templateNavItem({
        id: '',
        title: '',
        path: '',
      })}
    </template>

    <script src='js/libs/verbalexpressions.js'></script>

    <script src='js/models/part.js'></script>
    <script src='js/models/parts.js'></script>
    <script src='js/models/state.js'></script>
    <script src='js/models/state-client.js'></script>

    <script src='js/elements/nav.js'></script>
    <script src='js/elements/navitem.js'></script>
    <script src='js/elements/state.js'></script>
    <script src='js/elements/parts.js'></script>
    <script src='js/elements/part.js'></script>

    <script src='js/templates/home.js'></script>
    <script src='js/templates/about.js'></script>
  </body>

</html>
  `;
};

module.exports = layoutPage;
