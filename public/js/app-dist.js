/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <div class='container'>
    <h1 id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</h1>
    <div id='splits'>
      ${[...timer.splits].reverse().map((split, splitIndex) => `<chrono-timersplit id='split-${splitIndex}' state='${JSON.stringify(split)}'></chrono-timersplit>`)}
    </div>
    <form id='pause'>
      <chrono-button>Pause</chrono-button>
    </form>
    <form id='split'>
      <chrono-button>Split</chrono-button>
    </form>
  </div>
`);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const style = __webpack_require__(23);
const template = __webpack_require__(2);

class ChronoTimer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.initShadowRoot();

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this.animation = null;
    this._lastElapsed = 0;
    this._resolution = 100;

    this.pause = this.pause.bind(this);
    this.increment = this.increment.bind(this);
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
    return ['state'];
  }

  get state() {
    const jsonString = this.getAttribute('state');

    return jsonString ? JSON.parse(jsonString) : {
      id: false,
      start: false,
      end: false,
      splits: [],
    };
  }

  set state(state) {
    this.setAttribute('state', JSON.stringify(state));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state':
        this.update(JSON.parse(newValue));
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    const formPause = this.shadowRoot.querySelector('form#pause');
    formPause.addEventListener('submit', this.pause);
    formPause.addEventListener('chrono:buttonclick', this.pause);

    this.animation = window.requestAnimationFrame(this.increment);
  }

  disconnectedCallback() {
    const formPause = this.shadowRoot.querySelector('form#pause');
    formPause.removeEventListener('submit', this.pause);
    formPause.removeEventListener('chrono:buttonclick', this.pause);

    window.cancelAnimationFrame(this.animation);
  }

  update(timer) {
    let elapsed = timer.end ? (timer.end - timer.start) : (Date.now() - timer.start);
    elapsed = Math.floor(elapsed / (1000 / this._resolution));
    elapsed = elapsed.toString();
    if (elapsed.length < 2) {
      elapsed = `0${elapsed}`;
    }
    if (elapsed.length < 3) {
      elapsed = `0${elapsed}`;
    }
    if (elapsed.length < 4) {
      elapsed = `0${elapsed}`;
    }

    elapsed = `${elapsed.substring(0, 2)}:${elapsed.substring(2)}`;
    this.shadowRoot.querySelector('#elapsed').textContent = elapsed;

    this.setAttribute('stateid', timer.id);
  }

  pause(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerpause', {
      detail: {
        id: this.state.id,
      },
      bubbles: true,
      composed: true,
    }));

    if (!this.state.paused) {
      this.animation = window.requestAnimationFrame(this.increment);
    }
  }

  increment() {
    const diff = Math.floor((Date.now() - this.state.start) / (1000 / this._resolution));

    if (diff > this._lastElapsed) {
      this.update(this.state);
    }

    this._lastElapsed = diff;
    if (!this.state.end && !this.state.paused) {
      this.animation = window.requestAnimationFrame(this.increment);
    }
  }
}

window.customElements.define('chrono-timer', ChronoTimer);

module.exports = ChronoTimer;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <div id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</div>
  <div id='actions'>
    <form id='pause'>
      <chrono-button>Pause</chrono-button>
    </form>
  </div>
`);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const templateTimerBrief = __webpack_require__(34);
const templateTimerFull = __webpack_require__(0);

module.exports = (timers = [], isFull = false) => (`
  <div id='timers'>
    ${[...timers].reverse().map(timer => (
      isFull ? templateTimerFull(timer) : templateTimerBrief(timer)
    )).join('')}
  </div>
`);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const style = __webpack_require__(14);
const template = __webpack_require__(15);

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
  }

  connectedCallback() {
    this.addEventListener('click', this.onClick);

    if (this.hasAttribute('iscircle')) {
      this.shadowRoot.querySelector('button').classList.add('circle');
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
  }

  onClick(event) {
    event.preventDefault();

    if (this.parentElement.tagName === 'FORM') {
      this.dispatchEvent(new CustomEvent('chrono:buttonclick', {
        bubbles: true,
        composed: true,
      }));
    }
  }
}

window.customElements.define('chrono-button', ChronoButton);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(17);
const style = __webpack_require__(16);

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
        data: this.state.routes[index],
      },
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-nav', ChronoNav);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const style = __webpack_require__(18);
const templateHasTimer = __webpack_require__(20);
const templateHasNoTimer = __webpack_require__(19);

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
        if (!oldValue) {
          if (newState.timers.length) {
            this.initComponent(newState.timers[newState.timers.length - 1]);
          } else {
            this.initComponent();
          }
        } else {
          if (newState.timers.length && oldState.timers.length) {
            this.updateTimer(newState.timers[newState.timers.length - 1]);
          } else if (newState.timers.length && !oldState.timers.length) {
            this.initComponent(newState.timers[newState.timers.length - 1]);
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const style = __webpack_require__(21);
const template = __webpack_require__(22);

class ChronoPageTimers extends HTMLElement {
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
      case 'state':
        this.update(JSON.parse(newValue));
        break;
      default:
        break;
    }
  }

  update(state) {
    const timersElement = this.shadowRoot.querySelector('chrono-timers');

    timersElement.setAttribute('state', JSON.stringify(state.timers));
  }
}

window.customElements.define('chrono-pagetimers', ChronoPageTimers);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const templateHome = __webpack_require__(29);
const templateTimers = __webpack_require__(30);

class ChronoRouter extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = {};
  }

  connectedCallback() {
    window.addEventListener('popstate', (event) => {
      this.dispatchEvent(new CustomEvent('route:change', {
        detail: {
          replace: true,
          data: event.state,
        },
        bubbles: true,
        composed: true,
      }));
    });
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }

  static get observedAttributes() {
    return ['state'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state': {
        const newState = JSON.parse(newValue);

        const oldRoute = this._state.routes && this._state.routes.find(route => route.current);
        const newRoute = newState.routes.find(route => route.current);

        const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];

        if (!oldRoute || oldRoute.id !== newRoute.id) {
          switch (newRoute.id) {
            case 'home': {
              main.innerHTML = templateHome({
                state: newState,
              });
              break;
            }
            case 'timers': {
              main.innerHTML = templateTimers({
                state: newState,
              });
              break;
            }
            default:
              break;
          }
        } else {
          switch (newRoute.id) {
            case 'home':
              main.querySelector('chrono-pagehome').setAttribute('state', newValue);
              break;
            case 'timers':
              main.querySelector('chrono-pagetimers').setAttribute('state', newValue);
              break;
            default:
              break;
          }
        }

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('chrono-router', ChronoRouter);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const StateClient = __webpack_require__(27);

class ChronoState extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = new StateClient();
  }

  connectedCallback() {
    this.addEventListener('route:change', (event) => {
      this.onStateChange('route:change', Object.assign({}, event.detail.data, {
        replace: event.detail.replace,
      }));
    });

    this.addEventListener('state:timeradd', (event) => {
      this.onStateChange('state:timeradd', event.detail);
    });

    this.addEventListener('state:timerreset', (event) => {
      this.onStateChange('state:timerreset', event.detail);
    });

    this.addEventListener('state:timerend', (event) => {
      this.onStateChange('state:timerend', event.detail);
    });

    this.addEventListener('state:timerpause', (event) => {
      this.onStateChange('state:timerpause', event.detail);
    });

    this.addEventListener('state:timersplit', (event) => {
      this.onStateChange('state:timersplit', event.detail);
    });

    this.addEventListener('state:timerremove', (event) => {
      this.onStateChange('state:timerremove', event.detail);
    });
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }

  onStateChange(action, data) {
    switch (action) {
      case 'route:change': {
        this._state.changeRoute(data);
        break;
      }
      case 'state:timeradd': {
        this._state.addTimer(data);
        break;
      }
      case 'state:timerreset': {
        this._state.resetTimer();
        break;
      }
      case 'state:timerend': {
        this._state.endTimer(data);
        break;
      }
      case 'state:timerpause': {
        this._state.pauseTimer(data);
        break;
      }
      case 'state:timersplit': {
        this._state.splitTimer(data);
        break;
      }
      case 'state:timerremove': {
        this._state.removeTimer(data);
        break;
      }
      default:
        break;
    }

    this.setAttribute('state', JSON.stringify(this._state.toObject()));
  }

  static get observedAttributes() {
    return ['state'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state': {
        this._state = StateClient.fromObject(JSON.parse(newValue));

        const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];

        const nav = main.querySelector('chrono-nav');
        nav.setAttribute('state', JSON.stringify({
          routes: this._state.routes,
          timerCount: this._state.timers.length,
        }));

        const router = main.querySelector('chrono-router');
        router.setAttribute('state', JSON.stringify(this._state.toObject()));

        // console.log('state', this._state);
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('chrono-state', ChronoState);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(24);

class ChronoTimerAdd extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }

        * {
          box-sizing: border-box;
        }
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this._state = {};

    this.onAdd = this.onAdd.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('form').addEventListener('submit', this.onAdd);
    this.shadowRoot.querySelector('form').addEventListener('chrono:buttonclick', this.onAdd);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('form').removeEventListener('submit', this.onAdd);
    this.shadowRoot.querySelector('form').removeEventListener('chrono:buttonclick', this.onAdd);
  }

  onAdd(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timeradd', {
      detail: Date.now(),
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-timeradd', ChronoTimerAdd);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const ChronoTimer = __webpack_require__(1);

const style = __webpack_require__(25);
const template = __webpack_require__(0);

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
      window.requestAnimationFrame(() => {
        const fromElement = this.shadowRoot.querySelectorAll('.time')[0];
        const fromElementRect = fromElement.getBoundingClientRect();

        const toElement = document.querySelector('chrono-nav').shadowRoot.querySelector('nav a:last-child');
        const toElementRect = toElement.getBoundingClientRect();

        const element = fromElement.cloneNode();
        element.removeAttribute('id');
        element.textContent = oldState.end ?
          (oldState.end - oldState.start) :
          (Date.now() - oldState.start);

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

    const splitsContainer = this.shadowRoot.querySelector('#splits');

    timer.splits.forEach((split, splitIndex) => {
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


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(3);

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
            if (!this._state.some(existingTimer => existingTimer.start === newTimer.start)) {
              this.addTimer(newTimer);
            } else {
              this.editTimer(newTimer);
            }
          });

          this._state.forEach((existingTimer) => {
            if (!newState.some(newTimer => newTimer.start === existingTimer.start)) {
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
    chronoTimer.setAttribute('state', JSON.stringify(timer));
    const timersElement = this.shadowRoot.querySelector('#timers');
    timersElement.insertBefore(chronoTimer, timersElement.firstChild);
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


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(26);

class ChronoTimerSplit extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }

        * {
          box-sizing: border-box;
        }
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);
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
        this.update(JSON.parse(newValue));
        break;
      default:
        break;
    }
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  update(split) {
    const container = this.shadowRoot.querySelector('.chrono-timersplit');

    container.textContent = split / 1000;
  }
}

window.customElements.define('chrono-timersplit', ChronoTimerSplit);


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = () => (`

:host {

}

button {
  border: none;
  background: #E91E63;
  box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24);
  border-radius: 2px;
  font-family: Roboto;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  padding: 6px 12px;
  text-transform: uppercase;
}

button:active {
  box-shadow: 0 0 8px 0 rgba(0,0,0,0.12), 0 8px 8px 0 rgba(0,0,0,0.24);
}

button.small {
  font-size: 12px;
}

button.circle {
  width: 80px;
  height: 80px;
  border-radius: 80px;

  font-family: Roboto-Light;
  font-size: 36px;
}

`);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

const template = (title = '', isCircle = false) => (`
  <button class='${isCircle ? 'circle' : ''}'><slot>${title}</slot></button>
`);

module.exports = template;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = () => (`

:host {
  display: block;
  position: relative;
  text-transform: uppercase;
  background-color: red;
}

nav {
  display: flex;
  align-items: center;
  justify-content: center;
}

.border {
  position: absolute;
  bottom: 0;
  left: 0;
  bottom: 0;
  height: 5px;
  width: 0;
  background-color: #E91E63;

  transform: translate(0px);
  transition: transform 0.05s ease-in 0s;

  display: none;
}

.border.show {
  display: block;
}

a {
  flex-grow: 1;
  width: 100%;
  display: block;
  text-align: center;
  padding: 1em 0;

  border-bottom: 5px solid transparent;
  text-decoration: none;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

a span {
  pointer-events: none;
}

a.has-count span {
  width: 1.2rem;
  height: 0.9rem;
  border-radius: 1rem;
  color: white;
  background-color: #E91E63;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

a.current {
  border-bottom-color: #E91E63;
}

a.hide {
  border-bottom-color: transparent;
}

`);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

const templateNav = (state = {
  routes: [],
  timerCount: 0,
}) => (`
  <nav>
    ${state.routes.map(item => (`
      ${item.id === 'timers' ? `
        <a id='${item.id}' class='${state.timerCount ? 'has-count' : ''}' href='${item.path}'>${item.title}<span>${state.timerCount ? state.timerCount : ''}</span></a>
      ` : `
        <a id='${item.id}' href='${item.path}'>${item.title}</a>
      `}
    `)).join('')}
  </nav>
  <div class='border'></div>
`);

module.exports = templateNav;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = () => (`

:host {
}

`);

/***/ }),
/* 19 */
/***/ (function(module, exports) {

const template = () => (`
  <div id='no-timers'>No timers</div>
`);

module.exports = template;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const templateTimerFull = __webpack_require__(0);

const template = (timer = false) => {
  if (timer) {
    return `
      <chrono-timerfull state='${JSON.stringify(timer)}' minimiseToSelector='#item'>
        ${templateTimerFull(timer)}
      </chrono-timerfull>
    `;
  }

  return '<chrono-timerfull minimiseToSelector="#item"></chrono-timerfull>';
};

module.exports = template;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = () => (`

:host {

}

`);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const templateTimers = __webpack_require__(3);

const template = (timers = []) => {

  return `
    <chrono-timers state='${JSON.stringify(timers)}'>
      ${templateTimers(timers)}
    </chrono-timers>
  `;
};

module.exports = template;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = () => (`

:host {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0.5rem 0;
}

h1 {
  font-weight: normal;
}

chrono-timersplit {
  text-align: center;
}

.time {
  flex-grow: 1;
}

#actions {
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

`);

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = () => (`
  <div class='chrono-addtimer'>
    <form>
      <chrono-button iscircle>+</chrono-button>
    </form>
  </div>
`);


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = () => (`

:host {
}

.container {
  position: relative;
}

h1 {
  font-weight: normal;
  font-size: 5rem;
  margin: 0;
  padding: 2rem;
}

chrono-timersplit {
  text-align: center;
}

#elapsed {
  z-index: 2;
}

.dyn {
  position: absolute;
  opacity: 1;
  visibility: hidden;
  z-index: 1;
}

.dyn.show {
  opacity: 0;
  visibility: visible;
  transition: transform 0.2s ease-out 0s, opacity 0.2s ease-out 0s;
}

`);

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = (split = 0) => (`
  <div class='chrono-timersplit'>
    ${split}
  </div>
`);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const State = __webpack_require__(28);

class StateClient extends State {
  changeRoute(route) {
    super.changeRoute(route);

    if (route.replace) {
      history.replaceState(route, route.title, route.path);
    } else {
      history.pushState(route, route.title, route.path);
    }

    document.title = `Chrono - ${route.title}`;
  }
}

module.exports = StateClient;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

let nextTimerId = 0;

class State {
  constructor({
    routes = [],
    timers = [],
  } = {}) {
    this.routes = routes;
    this.timers = timers;
  }

  toObject() {
    return {
      routes: this.routes,
      timers: this.timers,
    };
  }

  static fromObject(data) {
    try {
      return new this({
        routes: data.routes,
        timers: data.timers,
      });
    } catch (err) {
      return new this({
        routes: [],
        timers: [],
      });
    }
  }

  changeRoute(newRoute) {
    this.routes = this.routes.map(route => (
      Object.assign({}, route, {
        current: route.id === newRoute.id,
      })
    ));
  }

  addTimer(start) {
    const timer = {
      id: false,
      start,
      end: false,
      paused: false,
      splits: [],
    };

    this.timers.push(Object.assign({}, timer, {
      id: nextTimerId,
    }));
    nextTimerId += 1;

    return timer;
  }

  resetTimer() {
    this.timers = [];
  }

  endTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.end = data.time;
  }

  pauseTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.paused = !foundTimer.paused;
  }

  splitTimer(data) {
    const foundTimer = this.timers.find(timer => timer.id === data.id);
    foundTimer.splits.push(data.time - foundTimer.start);
  }

  removeTimer(data) {
    const foundTimerIndex = this.timers.findIndex(timer => timer.id === data.id);
    this.timers.splice(foundTimerIndex, 1);
  }
}

module.exports = State;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

const templateHome = (args) => {
  const state = args.state;

  return `
    <chrono-pagehome state='${JSON.stringify(state)}'></chrono-pagehome>
  `;
};

module.exports = templateHome;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

const template = (args = {}) => {
  const state = args.state;

  return `
    <chrono-pagetimers state='${JSON.stringify(state)}'></chrono-pagetimers>
  `;
};

module.exports = template;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(9);
__webpack_require__(8);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(10);
__webpack_require__(1);
__webpack_require__(32);
__webpack_require__(11);
__webpack_require__(13);
__webpack_require__(12);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const ChronoTimer = __webpack_require__(1);

const style = __webpack_require__(33);
const template = __webpack_require__(34);

class ChronoTimerBrief extends ChronoTimer {
  constructor() {
    super();

    this.removeTimer = this.removeTimer.bind(this);
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

    const formRemove = this.shadowRoot.querySelector('form#remove');
    formRemove.addEventListener('submit', this.removeTimer);
    formRemove.addEventListener('chrono:buttonclick', this.removeTimer);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const formRemove = this.shadowRoot.querySelector('form#remove');
    formRemove.removeEventListener('submit', this.removeTimer);
    formRemove.removeEventListener('chrono:buttonclick', this.removeTimer);
  }

  removeTimer(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerremove', {
      detail: {
        id: this.state.id,
      },
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-timerbrief', ChronoTimerBrief);

module.exports = ChronoTimerBrief;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = () => (`

:host {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0.5rem 0;
}

h1 {
  font-weight: normal;
}

chrono-timersplit {
  text-align: center;
}

.time {
  flex-grow: 1;
}

#actions {
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

`);

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <div id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</div>
  <div id='actions'>
    <form id='pause'>
      <chrono-button>Pause</chrono-button>
    </form>
    <form id='remove'>
      <chrono-button>Remove</chrono-button>
    </form>
  </div>
`);


/***/ })
/******/ ]);