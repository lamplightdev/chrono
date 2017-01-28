const templateHome = require('../../templates/home');
const templateAbout = require('../../templates/about');

class KleeneRouter extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = {};
  }

  connectedCallback() {
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }

  static get observedAttributes() {
    return ['state'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state': {
        this._state = JSON.parse(newValue);

        switch (this._state.route.id) {
          case 'home': {
            const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
            main.innerHTML = templateHome({
              state: this._state,
            });

            const parts = main.querySelector('kleene-parts');

            parts.setAttribute('state', JSON.stringify(this._state.parts));
            break;
          }
          case 'about': {
            const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
            main.innerHTML = templateAbout({
              who: 'Chris',
            });
            break;
          }
          default:
            break;
        }
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('kleene-router', KleeneRouter);
