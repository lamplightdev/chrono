class KleeneParts extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }
      </style>

      <slot></slot>

      <div id="new-parts"></div>
    `;

    this._numberParts = 0;
  }

  addPart() {
    // TODO: call on attribute change
    console.log('addPart');
    const template = document.querySelector('template#part');
    const instance = template.content.cloneNode(true);
    instance.querySelector('[name=id]').value = this._numberParts;
    this.shadowRoot.querySelector('#new-parts').appendChild(instance);

    this._numberParts = this._numberParts + 1;
  }

  connectedCallback() {
    this._numberParts = this.shadowRoot.querySelector('slot')
      .assignedNodes()
      .filter(node => node.nodeType !== Node.TEXT_NODE)
      .length;
  }

  disconnectedCallback() {
  }
}

window.customElements.define('kleene-parts', KleeneParts);
