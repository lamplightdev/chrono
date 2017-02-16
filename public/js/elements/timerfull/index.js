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

  attributeChangedCallback(name, oldValue, newValue) {
    const oldState = oldValue ? JSON.parse(oldValue) : [];
    const newState = newValue ? JSON.parse(newValue) : [];

    if (oldValue && newState.id > oldState.id && this.getAttribute('minimiseToSelector')) {
      const fromElement = this.shadowRoot.querySelector('#elapsed');
      const lastTime = fromElement.textContent;

      window.requestAnimationFrame(() => {
        const fromElementRect = fromElement.getBoundingClientRect();

        const toElement = document.querySelector('chrono-nav').shadowRoot.querySelector('nav a:last-child');
        const toElementRect = toElement.getBoundingClientRect();

        const element = fromElement.cloneNode();
        element.removeAttribute('id');
        element.textContent = lastTime;
        element.classList.add('dyn');

        element.style.left = `${fromElementRect.left}px`;
        element.style.right = `${fromElementRect.right - fromElementRect.width}px`;
        element.style.top = `${fromElementRect.top - fromElement.offsetTop}px`;

        this.shadowRoot.appendChild(element);

        element.addEventListener('transitionend', () => {
          element.remove();
        });

        window.requestAnimationFrame(() => {
          element.classList.add('show');

          const scale = toElementRect.height / fromElementRect.height;
          element.style.transform = `translate(
            ${(toElementRect.left - fromElementRect.left) / 2}px,
            ${(-fromElementRect.top) * (0.5 / scale)}px
          ) scale(${scale})`;
        });
      });
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  update(timer) {
    super.update(timer);

    this.updatePauseForm();
    this.updateSplits();
  }

  updateSplits() {
    const splitsContainer = this.shadowRoot.querySelector('#splits');
    const currentSplits = splitsContainer.querySelectorAll('chrono-timersplit');

    this.state.splits.forEach((split, splitIndex) => {
      const splitComponent = splitsContainer.querySelector(`#split-${splitIndex}`);
      if (splitComponent) {
        splitComponent.setAttribute('state', JSON.stringify(split));
      } else {
        const chronoTimerSplit = document.createElement('chrono-timersplit');
        chronoTimerSplit.setAttribute('state', JSON.stringify(split));
        chronoTimerSplit.setAttribute('id', `split-${splitIndex}`);
        splitsContainer.insertBefore(chronoTimerSplit, splitsContainer.firstChild);
      }
    });

    for (let i = 0; i < currentSplits.length - this.state.splits.length; i += 1) {
      currentSplits[currentSplits.length - i - 1].remove();
    }
  }

  updatePauseForm() {
    const pauseForm = this.shadowRoot.querySelector('#split');

    if (this.state.paused) {
      pauseForm.classList.add('hide');
    } else {
      pauseForm.classList.remove('hide');
    }
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
