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

    this.dispatchEvent(new CustomEvent('added', {
      detail: {
        add: true,
      },
    }));

    fetch('/api/add', {
      method: 'post',
    })
    .then(response => response.json())
    .then((data) => {
      console.log('Request succeeded with JSON response', data);
    })
    .catch((error) => {
      console.log('Request failed', error);
    });
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
      case 'state':
        this._state = newValue;
        console.log(this._state);
        break;
      default:
        break;
    }
  }
}

window.customElements.define('kleene-add', KleeneAdd);
