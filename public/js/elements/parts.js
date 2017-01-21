class KleeneParts extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }
      </style>
    `;

    this._state = [];
    this._stateString = JSON.stringify(this._state);
  }

  static get observedAttributes() {
    return ['state'];
  }

  get state() {
    const jsonString = this.getAttribute('state');

    return jsonString ? JSON.parse(jsonString) : [];
  }

  set state(state) {
    this.setAttribute('state', JSON.stringify(state));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state':
        if (this._stateString !== newValue) {
          this._stateString = newValue;

          const newState = this._stateString ? JSON.parse(this._stateString) : [];

          newState.forEach((newPart) => {
            if (!this._state.some((existingPart) => {
              return existingPart.id === newPart.id;
            })) {
              this.addPart(newPart);
            }
          });
          this._state = newState;

          console.log('parts', this._state);
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  addPart(part) {
    // TODO: call on attribute change
    console.log('addPart');

    const kleenePart = document.createElement('kleene-part');
    kleenePart.setAttribute('state', JSON.stringify(part));
    this.shadowRoot.appendChild(kleenePart);
  }
}

window.customElements.define('kleene-parts', KleeneParts);
