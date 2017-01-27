const templateNav = require('../elements/nav/template');

const layoutPage = (args) => {
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

    <script src='js/app-dist.js'></script>
  </body>

</html>
  `;
};

module.exports = layoutPage;
