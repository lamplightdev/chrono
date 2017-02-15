const style = require('./style.css');
const templateHasTimer = require('./template-hastimer');
const templateHasNoTimer = require('./template-hasnotimer');

class ChronoPageHome extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        ${style()}
      </style>

      <template id='hastimer'>
        ${templateHasTimer()}
      </template>

      <template id='hasnotimer'>
        ${templateHasNoTimer()}
      </template>

      <div id='content'></div>
    `;
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
      case 'state': {
        const oldState = oldValue ? JSON.parse(oldValue) : {};
        const newState = newValue ? JSON.parse(newValue) : {};

        let currentTimer = newState.timers[newState.timers.length - 1];
        const currentRoute = newState.routes.find(route => route.current);

        if (typeof currentRoute.params.id !== 'undefined') {
          currentTimer = newState.timers.find(timer => timer.id === currentRoute.params.id);
        }

        if (!oldValue) {
          if (newState.timers.length) {
            this.initComponent(currentTimer);
          } else {
            this.initComponent();
          }
        } else {
          if (newState.timers.length && oldState.timers.length) {
            this.updateTimer(currentTimer);
          } else if (newState.timers.length && !oldState.timers.length) {
            this.initComponent(currentTimer);
          } else if (!newState.timers.length && oldState.timers.length) {
            this.initComponent();
          }
        }
        break;
      }
      default:
        break;
    }
  }

  initComponent(timer = false) {
    const templateId = timer ? 'hastimer' : 'hasnotimer';
    const templateContent = this.shadowRoot.querySelector(`template#${templateId}`);
    const instance = templateContent.content.cloneNode(true);

    const content = this.shadowRoot.querySelector('#content');

    while (content.hasChildNodes()) {
      content.removeChild(content.lastChild);
    }

    content.appendChild(instance);

    if (timer) {
      this.updateTimer(timer);
    }
  }

  updateTimer(timer) {
    const timerElement = this.shadowRoot.querySelector('chrono-timerfull');
    timerElement.setAttribute('state', JSON.stringify(timer));
  }
}

window.customElements.define('chrono-pagehome', ChronoPageHome);
