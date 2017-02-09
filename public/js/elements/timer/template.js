module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  splits: [],
}) => (`
  <div class='chrono-timer'>
    <h5><span id='id'>${timer.id}</span>. <span id='start'>${timer.start}</span> (<span id='end'>${timer.end}</span>)</h5>
    <h1 id='elapsed'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</h1>
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
