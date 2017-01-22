class KleeneState extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = {
      parts: [],
      nextId: 0,
    };
    this._stateString = JSON.stringify(this._state);
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
        const existingPartIndex = this._state.parts.findIndex(part => part.id === data.id);
        this._state.parts[existingPartIndex] = data;
        this.savePart(data);
        break;
      }
      case 'state:partdelete':
        this._state.parts = this._state.parts.filter(part => part.id !== data);
        this.deletePart(data);
        break;
      case 'state:partadd':
        this._state.parts.push({
          id: this._state.nextId,
          type: null,
          string: '',
        });

        this._state.nextId += 1;

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
    fetch('/api/part', {
      method: 'put',
    })
    .then(response => response.json())
    .then((data) => {
      console.log('addPart request succeeded with JSON response', data);
    })
    .catch((error) => {
      console.log('addPart request failed', error);
    });
  }

  savePart(data) {
    fetch(`/api/part/${data.id}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(response => response.json())
    .then((jsonData) => {
      console.log('savePart request succeeded with JSON response', jsonData);
    })
    .catch((error) => {
      console.log('savePart request failed', error);
    });
  }

  deletePart(id) {
    fetch(`/api/part/${id}`, {
      method: 'delete',
    })
    .then(response => response.json())
    .then((jsonData) => {
      console.log('deletePart request succeeded with JSON response', jsonData);
    })
    .catch((error) => {
      console.log('deletePart request failed', error);
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
