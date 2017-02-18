module.exports = () => (`
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <symbol id="icon-add" viewBox="0 0 24 24">
          <title>add</title>
          <path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>
        </symbol>
      </defs>
    </svg>
  <div class='chrono-addtimer'>
    <form>
      <chrono-button iscircle>
        <svg class="icon icon-add"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-add"></use></svg>
      </chrono-button>
    </form>
  </div>
`);
