const template = require('./template');

class ChronoTimerReset extends HTMLElement {
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

    this.onReset = this.onReset.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('form').addEventListener('submit', this.onReset);
    this.shadowRoot.querySelector('form').addEventListener('chrono:buttonclick', this.onReset);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('form').removeEventListener('submit', this.onReset);
    this.shadowRoot.querySelector('form').removeEventListener('chrono:buttonclick', this.onReset);
  }

  onReset(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerreset', {
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-timerreset', ChronoTimerReset);
