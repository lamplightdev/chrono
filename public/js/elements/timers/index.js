const template = require('./template');

class ChronoTimers extends HTMLElement {
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

    this._state = [];
    this._stateString = JSON.stringify(this._state);
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
      case 'state':
        if (this._stateString !== newValue) {
          this._stateString = newValue;

          const newState = this._stateString ? JSON.parse(this._stateString) : [];

          newState.forEach((newTimer) => {
            if (!this._state.some(existingTimer => existingTimer.id === newTimer.id)) {
              this.addTimer(newTimer);
            } else {
              this.editTimer(newTimer);
            }
          });

          this._state.forEach((existingTimer) => {
            if (!newState.some(newTimer => newTimer.id === existingTimer.id)) {
              this.removeTimer(existingTimer);
            }
          });

          this._state = newState;
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  addTimer(timer) {
    const chronoTimer = document.createElement('chrono-timerbrief');
    chronoTimer.setAttribute('resolution', 1);
    const timersElement = this.shadowRoot.querySelector('#timers');
    timersElement.insertBefore(chronoTimer, timersElement.firstChild);

    // update after inserted so other attributes (resolution) will have been initialised
    chronoTimer.setAttribute('state', JSON.stringify(timer));
  }

  editTimer(timer) {
    const component = this.shadowRoot.querySelector(`chrono-timerbrief[stateid='${timer.id}']`);
    component.setAttribute('state', JSON.stringify(timer));
  }

  removeTimer(timer) {
    const component = this.shadowRoot.querySelector(`chrono-timerbrief[stateid='${timer.id}']`);
    component.remove();
  }
}

window.customElements.define('chrono-timers', ChronoTimers);
