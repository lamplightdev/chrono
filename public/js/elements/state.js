class KleeneState extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = {
      parts: new Parts(),
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
        const part = new Part(data.id, data.type, data.string);
        this._state.parts.savePart(part);
        this.savePart(part);
        break;
      }
      case 'state:partdelete':
        this._state.parts.deletePart(data);
        this.deletePart(data);
        break;
      case 'state:partadd': {
        this._state.parts.addPart(new Part());
        this.addPart();
        break;
      }
      default:
        break;
    }

    this.setAttribute('state', JSON.stringify({
      parts: this._state.parts.getParts().map(part => part.getParams()),
    }));
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

  savePart(part) {
    fetch(`/api/part/${part.getId()}`, {
      method: 'post',
      body: JSON.stringify(part.getParams()),
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

    const json = jsonString ? JSON.parse(jsonString) : {};

    return new Parts(json.parts.map(partJson => new Part(
      partJson.id,
      partJson.type,
      partJson.string
    )));
  }

  set state(state) {
    this.setAttribute('state', JSON.stringify({
      parts: state.parts.getParts().map(part => part.getParams()),
    }));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state':
        if (this._stateString !== newValue) {
          this._stateString = newValue;

          const json = this._stateString ? JSON.parse(this._stateString) : {};
          this._state.parts = new Parts(json.parts.map(partJson => new Part(
            partJson.id,
            partJson.type,
            partJson.string
          )));

          console.log('state', this._state);

          const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];

          const parts = main.querySelector('kleene-parts');
          parts.setAttribute('state', JSON.stringify(this._state.parts.getParts().map(part => part.getParams())));
        }
        break;
      default:
        break;
    }
  }
}

window.customElements.define('kleene-state', KleeneState);
