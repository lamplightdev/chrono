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
        const newState = JSON.parse(newValue);

        if (!this._state.route || newState.route.id !== this._state.route.id) {
          switch (newState.route.id) {
            case 'home': {
              const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
              main.innerHTML = templateHome({
                state: newState,
              });

              const parts = main.querySelector('kleene-parts');

              parts.setAttribute('state', JSON.stringify(newState.parts));
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
        } else if (newState.route.id === 'home') {
          const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
          const parts = main.querySelector('kleene-parts');

          parts.setAttribute('state', JSON.stringify(newState.parts));
        }

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('kleene-router', KleeneRouter);
