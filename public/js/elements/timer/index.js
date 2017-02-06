const template = require('./template');

class KleeneTimer extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }

        * {
          box-sizing: border-box;
        }
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
    const formPause = root.querySelector('form#pause');
    formPause.addEventListener('submit', this.pause);
    const formSplit = root.querySelector('form#split');
    formSplit.addEventListener('submit', this.split);

    this.animation = window.requestAnimationFrame(this.increment);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;
    const formEnd = root.querySelector('form#end');
    formEnd.removeEventListener('submit', this.end);
    const formPause = root.querySelector('form#pause');
    formPause.removeEventListener('submit', this.pause);
    const formSplit = root.querySelector('form#split');
    formSplit.removeEventListener('submit', this.split);

    window.cancelAnimationFrame(this.animation);
  }

  update(timer) {
    const root = this.shadowRoot;

    root.querySelector('#id').textContent = timer.id;
    root.querySelector('#start').textContent = timer.start;
    root.querySelector('#end').textContent = timer.end;

    let elapsed = timer.end ? (timer.end - timer.start) : (Date.now() - timer.start);
    elapsed = Math.floor(elapsed / this._resolution);
    root.querySelector('#elapsed').textContent = elapsed;

    const splitsContainer = root.querySelector('#splits');
    timer.splits.forEach((split, splitIndex) => {
      const splitComponent = splitsContainer.querySelector(`#split-${splitIndex}`);
      if (splitComponent) {
        splitComponent.setAttribute('state', JSON.stringify(split));
      } else {
        const kleeneTimerSplit = document.createElement('kleene-timersplit');
        kleeneTimerSplit.setAttribute('state', JSON.stringify(split));
        kleeneTimerSplit.setAttribute('id', `split-${splitIndex}`);
        splitsContainer.appendChild(kleeneTimerSplit);
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
    const diff = Math.floor((Date.now() - this.state.start) / this._resolution);

    if (diff > this._lastElapsed) {
      this.update(this.state);
    }

    this._lastElapsed = diff;
    if (!this.state.end && !this.state.paused) {
      this.animation = window.requestAnimationFrame(this.increment);
    }
  }
}

window.customElements.define('kleene-timer', KleeneTimer);
