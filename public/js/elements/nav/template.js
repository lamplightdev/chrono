const templateNav = (state = {
  routes: [],
  timerCount: 0,
}) => (`
  <nav>
    ${state.routes.map(item => (`
      ${item.id === 'timers' ? `
        <a id='${item.id}' class='${state.timerCount ? 'has-count' : ''}' href='${item.path}'>${item.title}<span>${state.timerCount ? state.timerCount : ''}</span></a>
      ` : `
        <a id='${item.id}' href='${item.path}'>${item.title}</a>
      `}
    `)).join('')}
  </nav>
  <div class='border'></div>
`);

module.exports = templateNav;
