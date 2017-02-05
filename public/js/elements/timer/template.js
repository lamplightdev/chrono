module.exports = (timer = {
  start: null,
  end: null,
}) => (`
  <div class='kleene-timer'>
    <h5><span id='id'>${timer.id}</span>. <span id='start'>${timer.start}</span> (<span id='end'>${timer.end}</span>)</h5>
    <h1 id='elapsed'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</h1>
    <form id='pause'>
      <button>Pause</form>
    </form>
    <form id='end'>
      <button>End</form>
    </form>
  </div>
`);
