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

  onStateChange(action, data) {
    switch (action) {
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
        this._state = StateClient.fromObject(JSON.parse(newValue));

        const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
        const parts = main.querySelector('kleene-parts');

        parts.setAttribute('state', JSON.stringify(this._state.getParts().toObject()));

        console.log('state', this._state);
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('kleene-state', KleeneState);
