const templateNavItem = require('../navitem/template');

const templateNav = (items = []) => (`
  <nav>
    <ul>
    ${items.map(item => (
      templateNavItem(item)
    )).join('')}
    </ul>
  </nav>
`);

module.exports = templateNav;
