const style = require('./style.css');
const template = require('./template');

class ChronoButton extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        ${style()}
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this.onClick = this.onClick.bind(this);

    this.addEventListener('click', this.onClick);
  }

  // Material design ripple animation.
  onClick(event) {
    if (this.parentElement.tagName === 'FORM') {
      this.dispatchEvent(new CustomEvent('chrono:buttonclick', {
        bubbles: true,
        composed: true,
      }));
    }
  }
}

window.customElements.define('chrono-button', ChronoButton);
