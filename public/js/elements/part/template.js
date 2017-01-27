const Part = require('../../models/part');

const typeOptions = [
  'startOfLine',
  'then',
  'maybe',
  'anything',
  'endOfLine',
];

module.exports = (part = new Part()) => (`
  <form id='save' action='/part/${part.getId()}' method='post'>
    <input type='hidden' name='method' value='save'>
    <input type='hidden' name='id' value='${part.getId()}' />
    <div class='select-outer'>
      <select name='type'>
        ${typeOptions.map(type => (
          `<option value='${type}' ${part.getType() === type ? 'selected' : ''}>${type}</option>`
        )).join('')}
      </select>
    </div>
    <input name='string' type='text' value='${part.getString()}' />
    <button>Save</button>
  </form>
  <form id='delete' action='/part/${part.getId()}}' method='post'>
    <input type='hidden' name='method' value='delete'>
    <input type='hidden' name='id' value='${part.getId()}' />
    <button>Delete</button>
  </form>
`);
