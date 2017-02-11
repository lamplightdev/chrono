const template = require('./template');

class ChronoTimerAdd extends HTMLElement {
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

    this.onAdd = this.onAdd.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('form').addEventListener('submit', this.onAdd);
    this.shadowRoot.querySelector('form').addEventListener('chrono:buttonclick', this.onAdd);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('form').removeEventListener('submit', this.onAdd);
    this.shadowRoot.querySelector('form').removeEventListener('chrono:buttonclick', this.onAdd);
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

window.customElements.define('chrono-timeradd', ChronoTimerAdd);
