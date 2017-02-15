const templateHome = require('../../templates/home');
const templateTimers = require('../../templates/timers');

class ChronoRouter extends HTMLElement {
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
          data: event.state.id,
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

        const oldRoute = this._state.routes && this._state.routes.find(route => route.current);
        const newRoute = newState.routes.find(route => route.current);

        const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];

        if (!oldRoute || oldRoute.id !== newRoute.id) {
          switch (newRoute.id) {
            case 'home': {
              main.innerHTML = templateHome({
                state: newState,
              });
              break;
            }
            case 'timers': {
              main.innerHTML = templateTimers({
                state: newState,
              });
              break;
            }
            default:
              break;
          }
        } else {
          switch (newRoute.id) {
            case 'home':
              main.querySelector('chrono-pagehome').setAttribute('state', newValue);
              break;
            case 'timers':
              main.querySelector('chrono-pagetimers').setAttribute('state', newValue);
              break;
            default:
              break;
          }
        }

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('chrono-router', ChronoRouter);
