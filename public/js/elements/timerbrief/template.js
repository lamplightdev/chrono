module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <symbol id="icon-arrow_back" viewBox="0 0 24 24">
        <title>arrow_back</title>
        <path d="M20.016 11.016v1.969h-12.188l5.578 5.625-1.406 1.406-8.016-8.016 8.016-8.016 1.406 1.406-5.578 5.625h12.188z"></path>
      </symbol>
      <symbol id="icon-delete" viewBox="0 0 24 24">
        <title>delete</title>
        <path d="M18.984 3.984v2.016h-13.969v-2.016h3.469l1.031-0.984h4.969l1.031 0.984h3.469zM6 18.984v-12h12v12c0 1.078-0.938 2.016-2.016 2.016h-7.969c-1.078 0-2.016-0.938-2.016-2.016z"></path>
      </symbol>
      <symbol id="icon-pause" viewBox="0 0 24 24">
        <title>pause</title>
        <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
      </symbol>
      <symbol id="icon-play_arrow" viewBox="0 0 24 24">
        <title>play_arrow</title>
        <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
      </symbol>
    </defs>
  </svg>

  <div id='elapsed' class='time ${timer.paused ? 'paused' : ''}'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</div>
  <div id='actions'>
    <chrono-button id='view' iscircle issmall>
      <svg class="icon icon-arrow_back"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow_back"></use></svg>
    </chrono-button>
    <form id='pause'>
      <chrono-button iscircle issmall>
        <svg id='stop' class="icon icon-pause"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pause"></use></svg>
        <svg id='start' class="icon icon-play_arrow"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play_arrow"></use></svg>
      </chrono-button>
    </form>
    <form id='remove'>
      <chrono-button iscircle issmall>
          <svg class="icon icon-delete"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg>
      </chrono-button>
    </form>
  </div>
`);
