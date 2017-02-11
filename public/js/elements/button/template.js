const template = (title = '', isCircle = false) => (`
  <button class='${isCircle ? 'circle' : ''}'><slot>${title}</slot></button>
`);

module.exports = template;
