const style = require('./style.css');
const template = require('./template');

class ChronoPageHome extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        ${style()}
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);
  }

  connectedCallback() {
  }

  disconnectedCallback() {
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

  update(state) {
    const timers = state.timers.length ? [state.timers[state.timers.length - 1]] : [];

    const timersElement = this.shadowRoot.querySelector('chrono-timers');
    const notimersElement = this.shadowRoot.getElementById('no-timers');

    timersElement.setAttribute('state', JSON.stringify(timers));

    if (!state.timers.length) {
      notimersElement.classList.add('show');
    } else {
      notimersElement.classList.remove('show');
    }
  }
}

window.customElements.define('chrono-pagehome', ChronoPageHome);
