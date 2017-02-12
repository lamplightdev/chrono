const ChronoTimer = require('../timer');

const style = require('./style.css');
const template = require('./template');

class ChronoTimerFull extends ChronoTimer {
  constructor() {
    super();

    this.split = this.split.bind(this);
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

  static get observedAttributes() {
    return super.observedAttributes.concat(['minimiseToSelector']);
  }

  /*

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state':
        this.update(JSON.parse(newValue));
        break;
      default:
        break;
    }
  }
  */

  connectedCallback() {
    super.connectedCallback();

    const formSplit = this.shadowRoot.querySelector('form#split');
    formSplit.addEventListener('submit', this.split);
    formSplit.addEventListener('chrono:buttonclick', this.split);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const formSplit = this.shadowRoot.querySelector('form#split');
    formSplit.removeEventListener('submit', this.split);
    formSplit.removeEventListener('chrono:buttonclick', this.split);
  }

  update(timer) {
    super.update(timer);

    const splitsContainer = this.shadowRoot.querySelector('#splits');

    timer.splits.forEach((split, splitIndex) => {
      const splitComponent = splitsContainer.querySelector(`#split-${splitIndex}`);
      if (splitComponent) {
        splitComponent.setAttribute('state', JSON.stringify(split));
      } else {
        const chronoTimerSplit = document.createElement('chrono-timersplit');
        chronoTimerSplit.setAttribute('state', JSON.stringify(split));
        chronoTimerSplit.setAttribute('id', `split-${splitIndex}`);
        splitsContainer.appendChild(chronoTimerSplit);
      }
    });
  }

  split(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timersplit', {
      detail: {
        id: this.state.id,
        time: Date.now(),
      },
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-timerfull', ChronoTimerFull);
