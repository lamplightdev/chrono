const template = require('./template');

class ChronoTimerSplit extends HTMLElement {
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
        this.update(JSON.parse(newValue));
        break;
      default:
        break;
    }
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  update(split) {
    const container = this.shadowRoot.querySelector('.chrono-timersplit');

    container.textContent = split / 1000;
  }
}

window.customElements.define('chrono-timersplit', ChronoTimerSplit);
