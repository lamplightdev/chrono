module.exports = (timer = {
  start: null,
  end: null,
}) => (`
  <div class='kleene-timer'>
    <h5><span id='id'></span>. <span id='start'>${timer.start}</span> (<span id='end'>${timer.end}</span>)</h5>
    <form>
      <button>End</form>
    </form>
  </div>
`);
