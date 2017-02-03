const template = require('./template');

class KleeneTimerAdd extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }

        * {
          box-sizing: border-box;
        }
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this._state = {};
  }

  connectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form').addEventListener('submit', this.onAdd);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form').removeEventListener('submit', this.onAdd);
  }

  onAdd(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timeradd', {
      detail: Date.now(),
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('kleene-timeradd', KleeneTimerAdd);
