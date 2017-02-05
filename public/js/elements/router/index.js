const templateHome = require('../../templates/home');
const templateAbout = require('../../templates/about');
const templateTimers = require('../../templates/timers');

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
    window.addEventListener('popstate', (event) => {
      this.dispatchEvent(new CustomEvent('route:change', {
        detail: {
          replace: true,
          data: event.state,
        },
        bubbles: true,
        composed: true,
      }));
    });
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
              break;
            }
            case 'about': {
              const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
              main.innerHTML = templateAbout({
                who: 'Chris',
              });
              break;
            }
            case 'timers': {
              const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
              main.innerHTML = templateTimers({
                state: newState,
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
        } else if (newState.route.id === 'timers') {
          const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
          const timers = main.querySelector('kleene-timers');

          timers.setAttribute('state', JSON.stringify(newState.timers));
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
