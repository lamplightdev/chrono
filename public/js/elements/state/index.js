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
      event.detail.event.preventDefault();

      this.onStateChange('route:change', event.detail.data);
    });
    this.addEventListener('state:partsave', (event) => {
      this.onStateChange('state:partsave', event.detail);
    });

    this.addEventListener('state:partdelete', (event) => {
      this.onStateChange('state:partdelete', event.detail);
    });

    this.addEventListener('state:partadd', (event) => {
      this.onStateChange('state:partadd', event.detail);
    });
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }

  onStateChange(action, data) {
    switch (action) {
      case 'route:change': {
        // TODO: update url on route change (in StateClient)
        this._state.changeRoute(data);
        break;
      }
      case 'state:partsave': {
        this._state.savePart(data);
        break;
      }
      case 'state:partdelete':
        this._state.deletePart(data);
        break;
      case 'state:partadd': {
        this._state.addPart();
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
        // TODO: switch on which part of state has changed

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
