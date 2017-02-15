module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <div id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</div>
  <div id='actions'>
    <form id='pause'>
      <chrono-button><span id='stop'>Stop</span><span id='start'>Start</span></chrono-button>
    </form>
  </div>
`);
