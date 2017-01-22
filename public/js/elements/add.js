class KleeneAdd extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }
      </style>

      <slot></slot>
    `;

    this._state = {};

    this.onSubmit = this.onSubmit.bind(this);
  }

  connectedCallback() {
    const slot = this.shadowRoot.querySelector('slot');
    const form = slot.assignedNodes()[1];

    form.addEventListener('submit', this.onSubmit);
  }

  disconnectedCallback() {
    const slot = this.shadowRoot.querySelector('slot');
    const form = slot.assignedNodes()[1];

    form.removeEventListener('submit', this.onSubmit);
  }

  onSubmit(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:partadd', {
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('kleene-add', KleeneAdd);
