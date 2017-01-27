const template = require('./template');

class KleeneNavItem extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this.onClick = this.onClick.bind(this);
  }

  static get observedAttributes() {
    return ['state'];
  }

  connectedCallback() {
    const link = this.shadowRoot.querySelector('a');
    link.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    const link = this.shadowRoot.querySelector('a');
    link.removeEventListener('click', this.onClick);
  }

  onClick(event) {
    this.dispatchEvent(new CustomEvent('nav:change', {
      detail: {
        event,
        data: this.state,
      },
      bubbles: true,
      composed: true,
    }));
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
      case 'state': {
        const newState = newValue ? JSON.parse(newValue) : {};

        const link = this.shadowRoot.querySelector('a');
        link.setAttribute('href', newState.path);
        link.textContent = newState.title;

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('kleene-navitem', KleeneNavItem);
