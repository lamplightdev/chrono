const StateClient = require('../../models/state-client');

class KleeneState extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = new StateClient();
  }

  connectedCallback() {
    this.addEventListener('route:change', (event) => {
      if (event.detail.event) {
        event.detail.event.preventDefault();
      }

      this.onStateChange('route:change', Object.assign({}, event.detail.data, {
        replace: event.detail.replace,
      }));
    });

    this.addEventListener('state:timeradd', (event) => {
      this.onStateChange('state:timeradd', event.detail);
    });

    this.addEventListener('state:timerreset', (event) => {
      this.onStateChange('state:timerreset', event.detail);
    });

    this.addEventListener('state:timerend', (event) => {
      this.onStateChange('state:timerend', event.detail);
    });

    this.addEventListener('state:timerpause', (event) => {
      this.onStateChange('state:timerpause', event.detail);
    });

    this.addEventListener('state:timersplit', (event) => {
      this.onStateChange('state:timersplit', event.detail);
    });
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }

  onStateChange(action, data) {
    switch (action) {
      case 'route:change': {
        this._state.changeRoute(data);
        break;
      }
      case 'state:timeradd': {
        this._state.addTimer(data);
        break;
      }
      case 'state:timerreset': {
        this._state.resetTimer();
        break;
      }
      case 'state:timerend': {
        this._state.endTimer(data);
        break;
      }
      case 'state:timerpause': {
        this._state.pauseTimer(data);
        break;
      }
      case 'state:timersplit': {
        this._state.splitTimer(data);
        break;
      }
      default:
        break;
    }

    this.setAttribute('state', JSON.stringify(this._state.toObject()));
  }

  static get observedAttributes() {
    return ['state'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state': {
        this._state = StateClient.fromObject(JSON.parse(newValue));

        const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
        const router = main.querySelector('kleene-router');

        router.setAttribute('state', JSON.stringify(this._state.toObject()));

        console.log('state', this._state);
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('kleene-state', KleeneState);
