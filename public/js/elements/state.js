class KleeneState extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = {};
    this._stateString = JSON.stringify(this._state);
  }

  connectedCallback() {
    this.addEventListener('state:part', (event) => {
      this.onStateChange('state:part', event.detail);
    });

    this.addEventListener('state:add', (event) => {
      this.onStateChange('state:add', event.detail);
    });
  }

  onStateChange(action, data) {
    switch (action) {
      case 'state:part':
        this._state.parts[data.id] = data;
        this.savePart(data);
        break;
      case 'state:add':
        this._state.parts.push({
          id: this._state.parts.length,
          type: null,
          string: '',
        });
        this.addPart();
        break;
      default:
        break;
    }

    this.setAttribute('state', JSON.stringify(this._state));
  }

  static get observedAttributes() {
    return ['state'];
  }

  addPart() {
    fetch('/api/add', {
      method: 'post',
    })
    .then(response => response.json())
    .then((data) => {
      console.log('Request succeeded with JSON response', data);
    })
    .catch((error) => {
      console.log('Request failed', error);
    });
  }

  savePart(data) {
    fetch(`/api/save/${data.id}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(response => response.json())
    .then((jsonData) => {
      console.log('Request succeeded with JSON response', jsonData);
    })
    .catch((error) => {
      console.log('Request failed', error);
    });
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
          console.log('state', this._state);

          const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];

          const parts = main.querySelector('kleene-parts');
          parts.setAttribute('state', JSON.stringify(this._state.parts));
        }
        break;
      default:
        break;
    }
  }
}

window.customElements.define('kleene-state', KleeneState);
