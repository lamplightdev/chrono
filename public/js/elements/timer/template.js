module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <div id='elapsed'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</div>
  <div id='actions'>
    <form id='pause'>
      <chrono-button>Pause</chrono-button>
    </form>
    <form id='end'>
      <chrono-button>End</chrono-button>
    </form>
    <form id='remove'>
      <chrono-button>Remove</chrono-button>
    </form>
  </div>
`);
