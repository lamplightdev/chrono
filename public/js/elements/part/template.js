const typeOptions = [
  'startOfLine',
  'then',
  'maybe',
  'anything',
  'endOfLine',
];

module.exports = (part = {
  id: null,
  type: null,
  string: '',
}) => (`
  <form id='save' action='/part/${part.id}' method='post'>
    <input type='hidden' name='method' value='save'>
    <input type='hidden' name='id' value='${part.id}' />
    <div class='select-outer'>
      <select name='type'>
        ${typeOptions.map(type => (
          `<option value='${type}' ${part.type === type ? 'selected' : ''}>${type}</option>`
        )).join('')}
      </select>
    </div>
    <input name='string' type='text' value='${part.string}' />
    <button>Save</button>
  </form>
  <form id='delete' action='/part/${part.id}}' method='post'>
    <input type='hidden' name='method' value='delete'>
    <input type='hidden' name='id' value='${part.id}' />
    <button>Delete</button>
  </form>
`);
