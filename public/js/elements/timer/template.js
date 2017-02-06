module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  splits: [],
}) => (`
  <div class='kleene-timer'>
    <h5><span id='id'>${timer.id}</span>. <span id='start'>${timer.start}</span> (<span id='end'>${timer.end}</span>)</h5>
    <h1 id='elapsed'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</h1>
    <div id='splits'>
      ${timer.splits.map((split, splitIndex) => `<kleene-timersplit id='split-${splitIndex}' state='${JSON.stringify(split)}'></kleene-timersplit>`)}
    </div>
    <form id='pause'>
      <button>Pause</button>
    </form>
    <form id='end'>
      <button>End</button>
    </form>
    <form id='split'>
      <button>Split</button>
    </form>
  </div>
`);
