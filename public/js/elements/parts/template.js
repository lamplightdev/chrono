const Parts = require('../../models/parts');

const templatePart = require('../part/template');

module.exports = (parts = new Parts()) => (`
  <div id='parts'>
    ${parts.getParts().map(part => (
      templatePart(part)
    )).join('')}
  </div>

  <form id='add' action='/part' method='post'>
    <button>Add</button>
  </form>

  <form id='calculate' action='/calculate' method='post'>
    <input type='hidden' name='parts' value='${JSON.stringify(parts.toObject())}'>
    <textarea name='input'>This is some text that I wrote http://lamplightdev.com</textarea>
    <button>Calculate</button>
    <div id='regexp'></div>
  </form>
`);
