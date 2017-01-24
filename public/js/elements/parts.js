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

    const template = document.querySelector('template#kleene-parts');
    const instance = template.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this._state = [];
    this._stateString = JSON.stringify(this._state);

    this.onAdd = this.onAdd.bind(this);
    this.onCalculate = this.onCalculate.bind(this);
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
            if (!this._state.some(existingPart => existingPart.id === newPart.id)) {
              this.addPart(newPart);
            }
          });

          this._state.forEach((existingPart) => {
            if (!newState.some(newPart => newPart.id === existingPart.id)) {
              this.deletePart(existingPart);
            }
          });

          this._state = newState;
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#add').addEventListener('submit', this.onAdd);
    root.querySelector('form#calculate').addEventListener('submit', this.onCalculate);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#add').removeEventListener('submit', this.onAdd);
    root.querySelector('form#calculate').removeEventListener('submit', this.onCalculate);
  }

  addPart(part) {
    const kleenePart = document.createElement('kleene-part');
    kleenePart.setAttribute('partid', part.id);
    kleenePart.setAttribute('state', JSON.stringify(part));
    this.shadowRoot.querySelector('#parts').appendChild(kleenePart);
  }

  deletePart(part) {
    const partsContainer = this.shadowRoot.querySelector('#parts');
    const kleenePart = partsContainer.querySelector(`[partid='${part.id}']`);
    partsContainer.removeChild(kleenePart);
  }

  onAdd(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:partadd', {
      bubbles: true,
      composed: true,
    }));
  }

  onCalculate(event) {
    event.preventDefault();

    const tester = this.state.reduce((previous, part) => {
      return previous[part.type](part.string);
    }, VerEx());

    const input = this.querySelector('[name=input]').value;

    console.log(tester.test(input));
  }
}

window.customElements.define('kleene-parts', KleeneParts);
