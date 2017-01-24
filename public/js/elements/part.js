class KleenePart extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }
      </style>
    `;

    const template = document.querySelector('template#kleene-part');
    const instance = template.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this._state = {};
    this._stateString = JSON.stringify(this._state);

    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
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

          this.init(this._state);
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#save').addEventListener('submit', this.onSave);
    root.querySelector('form#delete').addEventListener('submit', this.onDelete);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#save').removeEventListener('submit', this.onSave);
    root.querySelector('form#delete').removeEventListener('submit', this.onDelete);
  }

  init(part) {
    const root = this.shadowRoot;

    [...root.querySelectorAll('[name=id]')].forEach((element) => {
      element.value = part.id;
    });
    [...root.querySelectorAll('[name=type]')].forEach((element) => {
      element.value = part.type;
    });
    [...root.querySelectorAll('[name=string]')].forEach((element) => {
      element.value = part.string;
    });
  }

  onSave(event) {
    event.preventDefault();

    const data = [...event.target.elements].reduce((previous, element) => {
      return Object.assign({}, previous, {
        [element.name]: element.value,
      });
    }, {});

    data.id = this._state.id;

    this.dispatchEvent(new CustomEvent('state:partsave', {
      detail: data,
      bubbles: true,
      composed: true,
    }));
  }

  onDelete(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:partdelete', {
      detail: this._state.id,
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('kleene-part', KleenePart);
