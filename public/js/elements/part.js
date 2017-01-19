/*
    .startOfLine()
    .then('http')
    .maybe('s')
    .then('://')
    .maybe('www.')
    .anythingBut(' ')
    .endOfLine();
    */

class KleenePart extends HTMLElement {
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

    const data = [...event.target.elements].reduce((previous, element) => {
      previous[element.name] = element.value;

      return previous;
    }, {});

    fetch(`/api/save/${data.id}`, {  
      method: 'post',  
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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
    return ['colour'];
  }

  get colour() {
    return this.getAttribute('colour');
  }

  set colour(colour) {
    this.setAttribute('colour', colour);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'colour':
        this._colourChanged(oldValue, newValue);
        break;
      default:
        break;
    }
  }
}

window.customElements.define('kleene-part', KleenePart);
