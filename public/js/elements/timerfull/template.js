module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <div class='container'>
    <h1 id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</h1>
    <div id='splits'>
      ${timer.splits.map((split, splitIndex) => `<chrono-timersplit id='split-${splitIndex}' state='${JSON.stringify(split)}'></chrono-timersplit>`)}
    </div>
    <form id='pause'>
      <chrono-button>Pause</chrono-button>
    </form>
    <form id='end'>
      <chrono-button>End</chrono-button>
    </form>
    <form id='split'>
      <chrono-button>Split</chrono-button>
    </form>
    <form id='remove'>
      <chrono-button>Remove</chrono-button>
    </form>
  </div>
`);
