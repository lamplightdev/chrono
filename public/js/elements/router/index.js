const templateHome = require('../../templates/home');
const templateAbout = require('../../templates/about');
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

        const oldRoute = this._state.routes && this._state.routes.find(route => route.current);
        const newRoute = newState.routes.find(route => route.current);

        if (!oldRoute || oldRoute.id !== newRoute.id) {
          switch (newRoute.id) {
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
        } else if (newRoute.id === 'timers') {
          const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];
          const timers = main.querySelector('chrono-timers');

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

window.customElements.define('chrono-router', ChronoRouter);
