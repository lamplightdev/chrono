const style = require('./style.css');
const template = require('./template');

class ChronoTimer extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        ${style()}
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this.animation = null;
    this._lastElapsed = 0;
    this._resolution = 100;

    this.end = this.end.bind(this);
    this.pause = this.pause.bind(this);
    this.split = this.split.bind(this);
    this.increment = this.increment.bind(this);
  }

  static get observedAttributes() {
    return ['state'];
  }

  get state() {
    const jsonString = this.getAttribute('state');

    return jsonString ? JSON.parse(jsonString) : {};
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
    const root = this.shadowRoot;

    const formEnd = root.querySelector('form#end');
    formEnd.addEventListener('submit', this.end);
    formEnd.addEventListener('chrono:buttonclick', this.end);

    const formPause = root.querySelector('form#pause');
    formPause.addEventListener('submit', this.pause);
    formPause.addEventListener('chrono:buttonclick', this.pause);

    const formSplit = root.querySelector('form#split');
    formSplit.addEventListener('submit', this.split);
    formSplit.addEventListener('chrono:buttonclick', this.split);

    this.animation = window.requestAnimationFrame(this.increment);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;

    const formEnd = root.querySelector('form#end');
    formEnd.removeEventListener('submit', this.end);
    formEnd.removeEventListener('chrono:buttonclick', this.end);

    const formPause = root.querySelector('form#pause');
    formPause.removeEventListener('submit', this.pause);
    formPause.removeEventListener('chrono:buttonclick', this.pause);

    const formSplit = root.querySelector('form#split');
    formSplit.removeEventListener('submit', this.split);
    formSplit.removeEventListener('chrono:buttonclick', this.split);

    window.cancelAnimationFrame(this.animation);
  }

  update(timer) {
    const root = this.shadowRoot;

    root.querySelector('#id').textContent = timer.id;
    root.querySelector('#start').textContent = timer.start;
    root.querySelector('#end').textContent = timer.end;

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
    if (elapsed.length < 5) {
      elapsed = `0${elapsed}`;
    }

    elapsed = `${elapsed.substring(0, 2)}:${elapsed.substring(2)}`;
    root.querySelector('#elapsed').textContent = elapsed;

    const splitsContainer = root.querySelector('#splits');
    timer.splits.forEach((split, splitIndex) => {
      const splitComponent = splitsContainer.querySelector(`#split-${splitIndex}`);
      if (splitComponent) {
        splitComponent.setAttribute('state', JSON.stringify(split));
      } else {
        const chronoTimerSplit = document.createElement('chrono-timersplit');
        chronoTimerSplit.setAttribute('state', JSON.stringify(split));
        chronoTimerSplit.setAttribute('id', `split-${splitIndex}`);
        splitsContainer.appendChild(chronoTimerSplit);
      }
    });

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

  split(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timersplit', {
      detail: {
        id: this.state.id,
        time: Date.now(),
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
