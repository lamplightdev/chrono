const templatePart = require('../part/template');

module.exports = (parts = []) => (`
  <div id='parts'>
    ${parts.map(part => (
      templatePart(part)
    )).join('')}
  </div>

  <form id='add' action='/part' method='post'>
    <button>Add</button>
  </form>

  <form id='calculate' action='/calculate' method='post'>
    <input type='hidden' name='parts' value='${JSON.stringify(parts)}'>
    <textarea name='input'>This is some text that I wrote http://lamplightdev.com</textarea>
    <button>Calculate</button>
    <div id='regexp'></div>
  </form>
`);
