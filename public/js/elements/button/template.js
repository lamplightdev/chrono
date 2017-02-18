const template = (title = '', isCircle = false, isSmall = false) => (`
  <button class='${isCircle ? 'circle' : ''} ${isSmall ? 'small' : ''}'><slot>${title}</slot></button>
`);

module.exports = template;
