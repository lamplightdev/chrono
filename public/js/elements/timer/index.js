const style = require('./style.css');
const template = require('./template');

class ChronoTimer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.initShadowRoot();

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this.animation = null;
    this._lastElapsed = 0;
    this._resolution = 100;

    this.end = this.end.bind(this);
    this.pause = this.pause.bind(this);
    this.removeTimer = this.removeTimer.bind(this);
    this.increment = this.increment.bind(this);
  }

  initShadowRoot() {
    this.shadowRoot.innerHTML = `
      <style>
        ${style()}
      </style>

      <template>
        ${template()}
      </template>
    `;
  }

  static get observedAttributes() {
    return ['state'];
  }

  get state() {
    const jsonString = this.getAttribute('state');

    return jsonString ? JSON.parse(jsonString) : {
      id: false,
      start: false,
      end: false,
      splits: [],
    };
  }

  set state(state) {
    this.setAttribute('state', JSON.stringify(state));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state':
        this.update(JSON.parse(newValue));
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    const formEnd = this.shadowRoot.querySelector('form#end');
    formEnd.addEventListener('submit', this.end);
    formEnd.addEventListener('chrono:buttonclick', this.end);

    const formPause = this.shadowRoot.querySelector('form#pause');
    formPause.addEventListener('submit', this.pause);
    formPause.addEventListener('chrono:buttonclick', this.pause);

    const formRemove = this.shadowRoot.querySelector('form#remove');
    formRemove.addEventListener('submit', this.removeTimer);
    formRemove.addEventListener('chrono:buttonclick', this.removeTimer);

    this.animation = window.requestAnimationFrame(this.increment);
  }

  disconnectedCallback() {
    const formEnd = this.shadowRoot.querySelector('form#end');
    formEnd.removeEventListener('submit', this.end);
    formEnd.removeEventListener('chrono:buttonclick', this.end);

    const formPause = this.shadowRoot.querySelector('form#pause');
    formPause.removeEventListener('submit', this.pause);
    formPause.removeEventListener('chrono:buttonclick', this.pause);

    const formRemove = this.shadowRoot.querySelector('form#remove');
    formRemove.removeEventListener('submit', this.removeTimer);
    formRemove.removeEventListener('chrono:buttonclick', this.removeTimer);

    window.cancelAnimationFrame(this.animation);
  }

  update(timer) {
    let elapsed = timer.end ? (timer.end - timer.start) : (Date.now() - timer.start);
    elapsed = Math.floor(elapsed / (1000 / this._resolution));
    elapsed = elapsed.toString();
    if (elapsed.length < 2) {
      elapsed = `0${elapsed}`;
    }
    if (elapsed.length < 3) {
      elapsed = `0${elapsed}`;
    }
    if (elapsed.length < 4) {
      elapsed = `0${elapsed}`;
    }

    elapsed = `${elapsed.substring(0, 2)}:${elapsed.substring(2)}`;
    this.shadowRoot.querySelector('#elapsed').textContent = elapsed;

    this.setAttribute('stateid', timer.id);
  }

  end(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerend', {
      detail: {
        id: this.state.id,
        time: Date.now(),
      },
      bubbles: true,
      composed: true,
    }));
  }

  pause(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerpause', {
      detail: {
        id: this.state.id,
      },
      bubbles: true,
      composed: true,
    }));

    if (!this.state.paused) {
      this.animation = window.requestAnimationFrame(this.increment);
    }
  }

  removeTimer(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerremove', {
      detail: {
        id: this.state.id,
      },
      bubbles: true,
      composed: true,
    }));
  }

  increment() {
    const diff = Math.floor((Date.now() - this.state.start) / (1000 / this._resolution));

    if (diff > this._lastElapsed) {
      this.update(this.state);
    }

    this._lastElapsed = diff;
    if (!this.state.end && !this.state.paused) {
      this.animation = window.requestAnimationFrame(this.increment);
    }
  }
}

window.customElements.define('chrono-timer', ChronoTimer);

module.exports = ChronoTimer;
