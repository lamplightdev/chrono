const template = require('./template');

const templateAbout = require('../../templates/about');

class KleeneNav extends HTMLElement {
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
  }

  static get observedAttributes() {
    return ['state'];
  }

  get state() {
    const jsonString = this.getAttribute('state');

    return jsonString ? JSON.parse(jsonString) : [];
  }

  set state(state) {
    this.setAttribute('state', JSON.stringify(state));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state': {
        const newState = newValue ? JSON.parse(newValue) : [];

        const ul = this.shadowRoot.querySelector('ul');
        newState.forEach((item) => {
          const kleeneNavItem = document.createElement('kleene-navitem');
          kleeneNavItem.setAttribute('state', JSON.stringify(item));
          ul.appendChild(kleeneNavItem);
        });

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }

  connectedCallback() {
    this.addEventListener('nav:change', (event) => {
      event.detail.event.preventDefault();

      console.log('nav', event.detail);

      document.querySelector('main').innerHTML = templateAbout({
        who: 'Chris',
      });
    });
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }
}

window.customElements.define('kleene-nav', KleeneNav);
