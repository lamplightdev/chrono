const templateNavItem = (item = {
  id: null,
  type: null,
  string: '',
}) => (`
  <li><a href='${item.path}'>${item.title}</a></li>
`);

module.exports = templateNavItem;
