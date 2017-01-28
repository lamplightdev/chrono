const templateNav = require('../elements/nav/template');

const layoutPage = (args) => {
  const state = args.state;

  const stateString = JSON.stringify(state.toObject());

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

    <kleene-state state='${stateString}'>
      <div slot='main'>
        <kleene-nav state='${JSON.stringify(args.navItems)}'>
          ${templateNav(args.navItems)}
        </kleene-nav>

        <kleene-router>
          <div slot='main'>
            <main>${args.content}</main>
          </div>
        </kleen-router>
      </div>
    </kleene-state>

    <script src='js/app-dist.js'></script>
  </body>

</html>
  `;
};

module.exports = layoutPage;
