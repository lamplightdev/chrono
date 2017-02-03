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

    this._state = {};
    this._stateString = JSON.stringify(this._state);

    this.end = this.end.bind(this);
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
        if (this._stateString !== newValue) {
          this._stateString = newValue;
          this._state = this._stateString ? JSON.parse(this._stateString) : {};

          this.init();
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    const root = this.shadowRoot;
    const form = root.querySelector('form');
    form.addEventListener('submit', this.end);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;
    const form = root.querySelector('form');
    form.removeEventListener('submit', this.end);
  }

  init() {
    const root = this.shadowRoot;

    root.querySelector('#id').textContent = this._state.id;
    root.querySelector('#start').textContent = this._state.start;
    root.querySelector('#end').textContent = this._state.end;

    this.setAttribute('stateid', this._state.id);
  }

  end(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerend', {
      detail: {
        id: this._state.id,
        time: Date.now(),
      },
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('kleene-timer', KleeneTimer);
