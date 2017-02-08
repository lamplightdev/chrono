const template = (title = '') => (`
  <button><slot>${title}</slot></button>
`);

module.exports = template;