const templateNav = (items = []) => (`
  <nav>
    ${items.map(item => (`
      <a href='${item.path}'>${item.title}</a>
    `)).join('')}

  </nav>
  <div class='border'></div>
`);

module.exports = templateNav;
