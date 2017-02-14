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

    <chrono-state state='${stateString}'>
      <div slot='main'>
        <chrono-nav state='${JSON.stringify({
          routes: state.routes,
          timerCount: state.timers.length,
        })}'>
          ${templateNav({
            routes: state.routes,
            timerCount: state.timers.length,
          })}
        </chrono-nav>
        <main>
          <chrono-router>
            <div slot='main'>
              ${args.content}
            </div>
          </chrono-router>
        </main>
        <div class='actions'>
          <chrono-timeradd></chrono-timeradd>
        </div>
      </div>
    </chrono-state>

    <script src='js/app-dist.js'></script>
  </body>

</html>
  `;
};

module.exports = layoutPage;
