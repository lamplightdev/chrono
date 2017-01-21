/*
    .startOfLine()
    .then('http')
    .maybe('s')
    .then('://')
    .maybe('www.')
    .anythingBut(' ')
    .endOfLine();
    */

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

    this._state = {};
    this._stateString = JSON.stringify(this._state);
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
          console.log('part', this._state);

          this.init(this._state);
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

  init(part) {
    const template = document.querySelector('template#kleene-part');
    const instance = template.content.cloneNode(true);
    instance.querySelector('[name=id]').value = part.id;
    instance.querySelector('[name=type]').value = part.type;
    instance.querySelector('[name=string]').value = part.string;

    instance.querySelector('form').addEventListener('submit', this.onSubmit);

    this.shadowRoot.appendChild(instance);
  }

  onSubmit(event) {
    event.preventDefault();

    const data = [...event.target.elements].reduce((previous, element) => {
      return Object.assign({}, previous, {
        [element.name]: element.value,
      });
    }, {});

    data.id = parseInt(data.id, 10);

    this.dispatchEvent(new CustomEvent('state:part', {
      detail: data,
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('kleene-part', KleenePart);
