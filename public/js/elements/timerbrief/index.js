const ChronoTimer = require('../timer');

const style = require('./style.css');
const template = require('./template');

class ChronoTimerBrief extends ChronoTimer {
  constructor() {
    super();

    this.removeTimer = this.removeTimer.bind(this);
    this.onView = this.onView.bind(this);
  }

  initShadowRoot() {
    this.shadowRoot.innerHTML = `
      <style>
        ${style()}
      </style>

      <template>
        ${template()}
      </template>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    const formRemove = this.shadowRoot.querySelector('form#remove');
    formRemove.addEventListener('submit', this.removeTimer);
    formRemove.addEventListener('chrono:buttonclick', this.removeTimer);

    const buttonView = this.shadowRoot.querySelector('#view');
    buttonView.addEventListener('click', this.onView);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const formRemove = this.shadowRoot.querySelector('form#remove');
    formRemove.removeEventListener('submit', this.removeTimer);
    formRemove.removeEventListener('chrono:buttonclick', this.removeTimer);

    const buttonView = this.shadowRoot.querySelector('#view');
    buttonView.removeEventListener('click', this.onView);
  }

  removeTimer(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerremove', {
      detail: {
        id: this.state.id,
      },
      bubbles: true,
      composed: true,
    }));
  }

  onView(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('route:change', {
      detail: {
        id: 'home',
        params: {
          id: this.state.id,
        },
      },
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-timerbrief', ChronoTimerBrief);

module.exports = ChronoTimerBrief;
