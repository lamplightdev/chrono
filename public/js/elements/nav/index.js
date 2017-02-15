const template = require('./template');
const style = require('./style.css');

class ChronoNav extends HTMLElement {
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

    this._borderWidth = 0;
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

        let oldCurrentIndex = false;
        if (oldState.routes) {
          oldCurrentIndex = oldState.routes.findIndex(item => item.current);
        }

        const newState = newValue ? JSON.parse(newValue) : {};
        const newCurrentIndex = newState.routes.findIndex(item => item.current);

        const nav = this.shadowRoot.querySelector('nav');
        const navElements = nav.querySelectorAll('a') || [];
        const border = this.shadowRoot.querySelector('.border');

        if (!oldValue || newState.routes.length !== oldState.routes.length) {
          this._borderWidth = nav.offsetWidth / newState.routes.length;
          border.style.width = `${this._borderWidth}px`;
        }

        const currentChanged = newCurrentIndex !== oldCurrentIndex;

        newState.routes.forEach((item, index) => {
          const existingItem = navElements[index];
          if (existingItem) {
            if (currentChanged) {
              if (item.current) {
                window.requestAnimationFrame(() => {
                  existingItem.classList.add('current');
                  existingItem.classList.add('hide');
                  border.classList.add('show');

                  window.requestAnimationFrame(() => {
                    border.style.transform = `translate(${newCurrentIndex * this._borderWidth}px)`;
                  });
                });

                border.addEventListener('transitionend', (event) => {
                  existingItem.classList.remove('hide');
                  border.classList.remove('show');
                }, {
                  once: true,
                });
              } else {
                existingItem.classList.remove('current');
              }
            }

            if (item.id === 'timers') {
              existingItem.querySelector('span').textContent =
                newState.timerCount ? newState.timerCount : '';

              if (newState.timerCount) {
                existingItem.classList.add('has-count');
              } else {
                existingItem.classList.remove('has-count');
              }
            }
          } else {
            const chronoNavItem = document.createElement('a');
            chronoNavItem.setAttribute('href', item.path);

            chronoNavItem.appendChild(document.createTextNode(item.title));

            if (item.id === 'timers') {
              const countElement = document.createElement('span');
              countElement.textContent = newState.timerCount ? newState.timerCount : '';
              if (newState.timerCount) {
                chronoNavItem.classList.add('has-count');
              }
              chronoNavItem.appendChild(countElement);
            }

            if (item.current) {
              chronoNavItem.classList = 'current';
              border.style.transform = `translate(${newCurrentIndex * this._borderWidth}px)`;
            }
            chronoNavItem.addEventListener('click', this.onClick);

            nav.appendChild(chronoNavItem);
          }
        });

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }

  connectedCallback() {
  }

  disconnectedCallback() {
    const navElements = this.shadowRoot.querySelectorAll('a') || [];
    navElements.forEach(el => el.removeEventListener('click', this.onClick));
  }

  onClick(event) {
    event.preventDefault();

    const navElements = this.shadowRoot.querySelectorAll('a') || [];
    const index = [...navElements].indexOf(event.target);

    this.dispatchEvent(new CustomEvent('route:change', {
      detail: {
        id: this.state.routes[index].id,
      },
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-nav', ChronoNav);
