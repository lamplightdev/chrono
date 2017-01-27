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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Part {
  constructor({
    id = null,
    type = null,
    string = '',
  } = {}) {
    this._id = id;
    this._type = type;
    this._string = string;
  }

  toObject() {
    return {
      id: this.getId(),
      type: this.getType(),
      string: this.getString(),
    };
  }

  static fromObject(data) {
    return new this(data);
  }

  setId(id) {
    this._id = id;
  }

  getId() {
    return this._id;
  }

  setType(type) {
    this._type = type;
  }

  getType() {
    return this._type;
  }

  setString(string) {
    this._string = string;
  }

  getString() {
    return this._string;
  }
}

module.exports = Part;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Part = __webpack_require__(0);

class Parts {
  constructor({
    parts = [],
  } = {}) {
    this._parts = parts;

    this._nextId = this._parts.reduce((previous, part) => {
      if (part.getId() + 1 > previous) {
        return part.getId() + 1;
      }

      return previous;
    }, 0);
  }

  toObject() {
    return this.getParts().map(part => part.toObject());
  }

  static fromObject(data) {
    return new this({
      parts: data.map(datum => Part.fromObject(datum)),
    });
  }

  getParts() {
    return this._parts;
  }

  addPart(part) {
    part.setId(this._nextId);
    this._parts.push(part);
    this._nextId += 1;

    return part;
  }

  savePart(part) {
    const existingPartIndex =
      this._parts.findIndex(existingPart => existingPart.getId() === part.getId());
    this._parts[existingPartIndex] = part;

    return part;
  }

  deletePart(partId) {
    const existingPartIndex =
      this._parts.findIndex(existingPart => existingPart.getId() === partId);

    return this._parts.splice(existingPartIndex, 1);
  }
}

module.exports = Parts;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const State = __webpack_require__(3);

class StateClient extends State {
  addPart() {
    const part = super.addPart();

    fetch('/api/part', {
      method: 'put',
    })
    .then(response => response.json())
    .then((data) => {
      console.log('addPart request succeeded with JSON response', data);
    })
    .catch((error) => {
      console.log('addPart request failed', error);
    });

    return part;
  }

  savePart(data) {
    const part = super.savePart(data);

    fetch(`/api/part/${part.getId()}`, {
      method: 'post',
      body: JSON.stringify(part.toObject()),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(response => response.json())
    .then((jsonData) => {
      console.log('savePart request succeeded with JSON response', jsonData);
    })
    .catch((error) => {
      console.log('savePart request failed', error);
    });

    return part;
  }

  deletePart(id) {
    const part = super.deletePart(id);

    fetch(`/api/part/${id}`, {
      method: 'delete',
    })
    .then(response => response.json())
    .then((jsonData) => {
      console.log('deletePart request succeeded with JSON response', jsonData);
    })
    .catch((error) => {
      console.log('deletePart request failed', error);
    });

    return part;
  }
}

module.exports = StateClient;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Part = __webpack_require__(0);
const Parts = __webpack_require__(1);

class State {
  constructor({
    parts = new Parts(),
  } = {}) {
    this.parts = parts;
  }

  toObject() {
    return {
      parts: this.parts.toObject(),
    };
  }

  static fromObject(data) {
    try {
      return new this({
        parts: Parts.fromObject(data.parts),
      });
    } catch (err) {
      return new this({
        parts: new Parts(),
      });
    }
  }

  getParts() {
    return this.parts;
  }

  addPart() {
    return this.parts.addPart(new Part());
  }

  savePart(data) {
    return this.parts.savePart(new Part(data));
  }

  deletePart(id) {
    return this.parts.deletePart(id);
  }
}

module.exports = State;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

const templateAbout = (args = { who: 'Dave' }) => {
  return `
    <h1>About ${args.who}</h1>
  `;
};

module.exports = templateAbout;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

const templateNavItem = (item = {
  id: null,
  type: null,
  string: '',
}) => (`
  <li><a href='${item.path}'>${item.title}</a></li>
`);

module.exports = templateNavItem;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Part = __webpack_require__(0);

const typeOptions = [
  'startOfLine',
  'then',
  'maybe',
  'anything',
  'endOfLine',
];

module.exports = (part = new Part()) => (`
  <form id='save' action='/part/${part.getId()}' method='post'>
    <input type='hidden' name='method' value='save'>
    <input type='hidden' name='id' value='${part.getId()}' />
    <div class='select-outer'>
      <select name='type'>
        ${typeOptions.map(type => (
          `<option value='${type}' ${part.getType() === type ? 'selected' : ''}>${type}</option>`
        )).join('')}
      </select>
    </div>
    <input name='string' type='text' value='${part.getString()}' />
    <button>Save</button>
  </form>
  <form id='delete' action='/part/${part.getId()}}' method='post'>
    <input type='hidden' name='method' value='delete'>
    <input type='hidden' name='id' value='${part.getId()}' />
    <button>Delete</button>
  </form>
`);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Parts = __webpack_require__(1);

const templatePart = __webpack_require__(6);

module.exports = (parts = new Parts()) => (`
  <div id='parts'>
    ${parts.getParts().map(part => (
      templatePart(part)
    )).join('')}
  </div>

  <form id='add' action='/part' method='post'>
    <button>Add</button>
  </form>

  <form id='calculate' action='/calculate' method='post'>
    <input type='hidden' name='parts' value='${JSON.stringify(parts.toObject())}'>
    <textarea name='input'>This is some text that I wrote http://lamplightdev.com</textarea>
    <button>Calculate</button>
    <div id='regexp'></div>
  </form>
`);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(15);

const templateAbout = __webpack_require__(4);

class KleeneNav extends HTMLElement {
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
      case 'state': {
        const newState = newValue ? JSON.parse(newValue) : [];

        const ul = this.shadowRoot.querySelector('ul');
        newState.forEach((item) => {
          const kleeneNavItem = document.createElement('kleene-navitem');
          kleeneNavItem.setAttribute('state', JSON.stringify(item));
          ul.appendChild(kleeneNavItem);
        });

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }

  connectedCallback() {
    this.addEventListener('nav:change', (event) => {
      event.detail.event.preventDefault();

      console.log('nav', event.detail);

      document.querySelector('main').innerHTML = templateAbout({
        who: 'Chris',
      });
    });
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }
}

window.customElements.define('kleene-nav', KleeneNav);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(5);

class KleeneNavItem extends HTMLElement {
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

    this.onClick = this.onClick.bind(this);
  }

  static get observedAttributes() {
    return ['state'];
  }

  connectedCallback() {
    const link = this.shadowRoot.querySelector('a');
    link.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    const link = this.shadowRoot.querySelector('a');
    link.removeEventListener('click', this.onClick);
  }

  onClick(event) {
    this.dispatchEvent(new CustomEvent('nav:change', {
      detail: {
        event,
        data: this.state,
      },
      bubbles: true,
      composed: true,
    }));
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
        const newState = newValue ? JSON.parse(newValue) : {};

        const link = this.shadowRoot.querySelector('a');
        link.setAttribute('href', newState.path);
        link.textContent = newState.title;

        this._state = newState;
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('kleene-navitem', KleeneNavItem);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(6);

class KleenePart extends HTMLElement {
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

        form {
          display: inline-block;
        }

        .select-outer, input, button, textarea {
          font-family: Roboto, Arial, sans-serif;
          font-size: 1rem;
          line-height: 1.2rem;
          display: inline-block;
          background: #eee;
          border: 1px solid #aaa;
          border-radius: 0;
          padding: 0.5rem;

          box-shadow: none;
        }

        .select-outer {
          position: relative;
          min-width: 150px;
        }

        .select-outer:before {
          content: '\\00a0';
        }

        .select-outer:after {
          display: inline-block;
          content: '➜';
          transform: rotate(90deg);

          position: absolute;
          right: 0.5rem;
          pointer-events: none;
        }

        .select-outer select {
          display: inline-block;
          appearance: none;
          -webkit-appearance: none;
          font-family: Roboto, Arial, sans-serif;
          font-size: 1rem;
          padding: 0 0.5rem;

          border: 0;
          border-radius: 0;
          background: transparent;

          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100%;
        }

        form#save button {
          display: none;
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
    this._stateString = JSON.stringify(this._state);

    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
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
        if (this._stateString !== newValue) {
          this._stateString = newValue;
          this._state = this._stateString ? JSON.parse(this._stateString) : {};

          this.init(this._state);
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#save').addEventListener('submit', this.onSave);
    root.querySelector('[name=type]').addEventListener('change', this.onSave);
    root.querySelector('[name=string]').addEventListener('keyup', this.onSave);
    root.querySelector('form#delete').addEventListener('submit', this.onDelete);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#save').removeEventListener('submit', this.onSave);
    root.querySelector('[name=type]').removeEventListener('change', this.onSave);
    root.querySelector('[name=string]').removeEventListener('keyup', this.onSave);
    root.querySelector('form#delete').removeEventListener('submit', this.onDelete);
  }

  init(part) {
    const root = this.shadowRoot;

    [...root.querySelectorAll('[name=id]')].forEach((element) => {
      element.value = part.id;
    });
    [...root.querySelectorAll('[name=type]')].forEach((element) => {
      element.value = part.type;
    });
    [...root.querySelectorAll('[name=string]')].forEach((element) => {
      element.value = part.string;
    });
  }

  onSave(event) {
    event.preventDefault();

    const form = this.shadowRoot.querySelector('form#save');

    const data = [...form.elements].reduce((previous, element) => {
      return Object.assign({}, previous, {
        [element.name]: element.value,
      });
    }, {});

    data.id = this._state.id;

    this.dispatchEvent(new CustomEvent('state:partsave', {
      detail: data,
      bubbles: true,
      composed: true,
    }));
  }

  onDelete(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:partdelete', {
      detail: this._state.id,
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('kleene-part', KleenePart);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const VerEx = __webpack_require__(14);
const template = __webpack_require__(7);

class KleeneParts extends HTMLElement {
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

    this.onAdd = this.onAdd.bind(this);
    this.onCalculate = this.onCalculate.bind(this);
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

          newState.forEach((newPart) => {
            if (!this._state.some(existingPart => existingPart.id === newPart.id)) {
              this.addPart(newPart);
            }
          });

          this._state.forEach((existingPart) => {
            if (!newState.some(newPart => newPart.id === existingPart.id)) {
              this.deletePart(existingPart);
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
    const root = this.shadowRoot;

    root.querySelector('form#add').addEventListener('submit', this.onAdd);
    root.querySelector('form#calculate').addEventListener('submit', this.onCalculate);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#add').removeEventListener('submit', this.onAdd);
    root.querySelector('form#calculate').removeEventListener('submit', this.onCalculate);
  }

  addPart(part) {
    const kleenePart = document.createElement('kleene-part');
    kleenePart.setAttribute('partid', part.id);
    kleenePart.setAttribute('state', JSON.stringify(part));
    this.shadowRoot.querySelector('#parts').appendChild(kleenePart);
  }

  deletePart(part) {
    const partsContainer = this.shadowRoot.querySelector('#parts');
    const kleenePart = partsContainer.querySelector(`[partid='${part.id}']`);
    partsContainer.removeChild(kleenePart);
  }

  onAdd(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:partadd', {
      bubbles: true,
      composed: true,
    }));
  }

  onCalculate(event) {
    event.preventDefault();

    const tester = this.state.reduce((previous, part) => {
      return previous[part.type](part.string);
    }, VerEx());

    const input = this.shadowRoot.querySelector('[name=input]').value;
    const regexp = this.shadowRoot.querySelector('#regexp');

    regexp.textContent = `${tester.test(input)}: ${tester.toRegExp()}`;
  }
}

window.customElements.define('kleene-parts', KleeneParts);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const StateClient = __webpack_require__(2);

class KleeneState extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <slot name='main'></slot>
    `;

    this._state = new StateClient();
  }

  connectedCallback() {
    this.addEventListener('state:partsave', (event) => {
      this.onStateChange('state:partsave', event.detail);
    });

    this.addEventListener('state:partdelete', (event) => {
      this.onStateChange('state:partdelete', event.detail);
    });

    this.addEventListener('state:partadd', (event) => {
      this.onStateChange('state:partadd', event.detail);
    });
  }

  disconnectedCallback() {
    // TODO: remove listeners
  }

  onStateChange(action, data) {
    switch (action) {
      case 'state:partsave': {
        this._state.savePart(data);
        break;
      }
      case 'state:partdelete':
        this._state.deletePart(data);
        break;
      case 'state:partadd': {
        this._state.addPart();
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
        const parts = main.querySelector('kleene-parts');

        parts.setAttribute('state', JSON.stringify(this._state.getParts().toObject()));

        console.log('state', this._state);
        break;
      }
      default:
        break;
    }
  }
}

window.customElements.define('kleene-state', KleeneState);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const templateParts = __webpack_require__(7);

const templateHome = (args) => {
  const state = args.state;

  const stateString = JSON.stringify(state.toObject());

  return `
    <kleene-state state='${stateString}'>
      <div slot='main'>
        <kleene-parts>
          ${templateParts(state.getParts())}
        </kleene-parts>
      </div>
    </kleene-state>
  `;
};

module.exports = templateHome;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * VerbalExpressions JavaScript Library v0.3.0
 * https://github.com/VerbalExpressions/JSVerbalExpressions
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 */

/**
* Define the VerbalExpression class.
* @class
*/
(function verbalExpressionIIFE(root) {
    // Constants
    var MODULE_NAME = 'VerEx';

    /**
    * I am the constructor function.
    * @constructor
    * @alias VerEx
    * @return {RegExp} A new instance of RegExp with injected methods
    */
    function VerbalExpression() {
        var verbalExpression = new RegExp();

        // Add all the class methods
        VerbalExpression.injectClassMethods(verbalExpression);

        // Return the new object.
        return verbalExpression;
    }

    /**
    * @param {RegExp} verbalExpression An instance of RegExp on which to add VerbalExpressions methods
    * @return {RegExp} A new instance of RegExp with injected methods
    */
    VerbalExpression.injectClassMethods = function injectClassMethods(verbalExpression) {
        var method;
        // Loop over all the prototype methods
        for (method in VerbalExpression.prototype) {
            // Make sure this is a local method.
            if (VerbalExpression.prototype.hasOwnProperty(method)) {
                // Add the method
                verbalExpression[method] = VerbalExpression.prototype[method];
            }
        }

        return verbalExpression;
    };

    /**
    * Define the class methods.
    */
    VerbalExpression.prototype = {
        // Variables to hold the whole
        // expression construction in order
        _prefixes: '',
        _source: '',
        _suffixes: '',
        _modifiers: 'gm', // default to global multiline matching

        /**
        * Sanitation function for adding anything safely to the expression
        * @param {String} value string to sanitize
        * @return {String} sanitized value
        */
        sanitize: function sanitize(value) {
            var reRegExpEscape;

            if (value.source) {
                return value.source;
            }

            if (typeof value === 'number') {
                return value;
            }

            // Regular expression meta characters, URL: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
            reRegExpEscape = /([\].|*?+(){}^$\\:=[])/g;

            // Escape RegExp special characters only
            // $& => Last match, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastMatch
            return value.replace(reRegExpEscape, '\\$&');
        },

        /**
        * Function to add stuff to the expression. Also compiles the new expression so it's ready to be used.
        * @param {string} value literal expression, not sanitized
        * @return {VerbalExpression} Freshly recompiled instance of VerbalExpression
        */
        add: function add(value) {
            this._source += value || '';
            this.compile(this._prefixes + this._source + this._suffixes, this._modifiers);

            return this;
        },

        /**
        * Control start-of-line matching
        * @param {Boolean} enable Control start-of-line matching
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        startOfLine: function startOfLine(enable) {
            enable = (enable !== false);
            this._prefixes = enable ? '^' : '';
            return this.add();
        },

        /**
        * Control end-of-line matching
        * @param {Boolean} enable Control end-of-line matching
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        endOfLine: function endOfLine(enable) {
            enable = (enable !== false);
            this._suffixes = enable ? '$' : '';
            return this.add();
        },

        /**
        * We try to keep the syntax as user-friendly as possible. So we can use the "normal" behaviour to split the "sentences" naturally.
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        then: function then(value) {
            value = this.sanitize(value);
            return this.add('(?:' + value + ')');
        },

        /**
        * And because we can't start with "then" function, we create an alias to be used as the first function of the chain.
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        find: function find(value) {
            return this.then(value);
        },

        /*
        * Maybe is used to add values with ?
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        maybe: function maybe(value) {
            value = this.sanitize(value);
            return this.add('(?:' + value + ')?');
        },

        /**
        * Any character any number of times
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        anything: function anything() {
            return this.add('(?:.*)');
        },

        /**
        * Anything but these characters
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        anythingBut: function anythingBut(value) {
            value = this.sanitize(value);
            return this.add('(?:[^' + value + ']*)');
        },

        /**
        * Any character at least one time
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        something: function something() {
            return this.add('(?:.+)');
        },

        /**
        * Any character at least one time except for these characters
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        somethingBut: function somethingBut(value) {
            value = this.sanitize(value);
            return this.add('(?:[^' + value + ']+)');
        },

        /**
        * Shorthand function for the String.replace function to give more logical flow if, for example, we're doing multiple replacements on one regexp.
        * @param {String} source string to search for
        * @param {String} value value to replace with
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        replace: function replace(source, value) {
            source = source.toString();
            return source.replace(this, value);
        },

        /// Add regular expression special ///
        /// characters                     ///

        /**
        * Line break
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        lineBreak: function lineBreak() {
            return this.add('(?:\\r\\n|\\r|\\n)'); // Unix + Windows CRLF
        },

        /**
        * And a shorthand for html-minded
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        br: function br() {
            return this.lineBreak();
        },

        /**
        * Tab (duh?)
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        tab: function tab() {
            return this.add('\\t');
        },

        /**
        * Any alphanumeric
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        word: function word() {
            return this.add('\\w+');
        },

        /**
        * Any digit
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        digit: function digit() {
            this.add('\\d');
            return this;
        },

        /**
        * Any whitespace
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        whitespace: function whitespace() {
            return this.add('\\s');
        },

        /**
        * Any given character
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        anyOf: function anyOf(value) {
            value = this.sanitize(value);
            return this.add('[' + value + ']');
        },

        /**
        * Shorthand
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        any: function any(value) {
            return this.anyOf(value);
        },

        /**
        * Usage: .range( from, to [, from, to ... ] )
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        range: function range() {
            var length = arguments.length;

            // Create a string buffer instead of concatenating on iteration
            var buffer = new Array(length / 2);
            var index = 0;
            var i = 0;
            var from;
            var to;

            buffer[index++] = '[';

            while (i < length) {
                from = this.sanitize(arguments[i++]);
                to = this.sanitize(arguments[i++]);
                buffer[index++] = from + '-' + to;
            }

            buffer[index++] = ']';

            return this.add(buffer.join(''));
        },

        /// Modifiers      ///

        /**
        * Modifier abstraction
        * @param {String} modifier modifier to add
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        addModifier: function addModifier(modifier) {
            if (this._modifiers.indexOf(modifier) === -1) {
                this._modifiers += modifier;
            }

            return this.add();
        },

        /**
        * Remove modifier
        * @param {String} modifier modifier to remove
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        removeModifier: function removeModifier(modifier) {
            this._modifiers = this._modifiers.replace(modifier, '');
            return this.add();
        },

        /**
        * Case-insensitivity modifier
        * @param {Boolean} enable Control case-insensitive matching
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        withAnyCase: function withAnyCase(enable) {
            return enable !== false ? this.addModifier('i') : this.removeModifier('i');
        },

        /**
        * Default behaviour is with "g" modifier, so we can turn this another way around than other modifiers
        * @param {Boolean} enable Control global matching
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        stopAtFirst: function stopAtFirst(enable) {
            return enable !== false ? this.removeModifier('g') : this.addModifier('g');
        },

        /**
        * Multiline, also reversed
        * @param {Boolean} enable Control multi-line matching
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        searchOneLine: function searchOneLine(enable) {
            return enable !== false ? this.removeModifier('m') : this.addModifier('m');
        },

        /**
        * Repeats the previous item exactly n times or between n and m times.
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        repeatPrevious: function repeatPrevious() {
            var value;
            var reIsInteger = /\d+/;
            var length = arguments.length;
            var values = new Array(length);
            var i = 0;
            var j = 0;
            for (i = 0; i < length; i++) {
                if (reIsInteger.test(arguments[i])) {
                    values[j++] = arguments[i];
                }
            }

            if (j > 0) {
                // Set the new length of the array, thus reducing to the elements that have content
                values.length = j;
                value = '{' + values.join(',') + '}';
            }


            return this.add(value);
        },

        /**
        * Repeats the previous at least once
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        oneOrMore: function oneOrMore() {
            return this.add('+');
        },

        /// Loops  ///

        /**
        * Matches the value zero or more times
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        multiple: function multiple(value) {
            // Use expression or string
            value = value.source || this.sanitize(value);
            if (arguments.length === 1) {
                this.add('(?:' + value + ')*');
            }

            if (arguments.length > 1) {
                this.add('(?:' + value + ')');
                this.add('{' + arguments[1] + '}');
            }

            return this;
        },

        /**
        * Adds alternative expressions
        * @param {String} value value to find
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        or: function or(value) {
            this._prefixes += '(?:';
            this._suffixes = ')' + this._suffixes;

            this.add(')|(?:');
            if (value) {
                this.then(value);
            }

            return this;
        },

        /**
        * Starts a capturing group
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        beginCapture: function beginCapture() {
            // Add the end of the capture group to the suffixes for now so compilation continues to work
            this._suffixes += ')';
            return this.add('(');
        },

        /**
        * Ends a capturing group
        * @return {VerbalExpression} Same instance of VerbalExpression to allow method chaining
        */
        endCapture: function endCapture() {
            // Remove the last parentheses from the _suffixes and add to the regex itself
            this._suffixes = this._suffixes.substring(0, this._suffixes.length - 1);
            return this.add(')');
        },

        /**
        * Convert to RegExp object
        * @return {RegExp} Converted RegExp instance
        */
        toRegExp: function toRegExp() {
            var array = this.toString().match(/\/(.*)\/([gimuy]+)?/);
            return new RegExp(array[1], array[2]);
        }
    };

    /**
    * @return {VerbalExpression} Returns a new instance of VerbalExpressions
    */
    function createVerbalExpression() {
        return new VerbalExpression();
    }

    // UMD (Universal Module Definition), URL: https://github.com/umdjs/umd
    // Supports AMD, CommonJS and the browser
    if (typeof module !== 'undefined' && module.exports) {
        // Node.js Module
        module.exports = createVerbalExpression;
    } else if (true) {
        // AMD Module
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function define() {
            return VerbalExpression;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        // Browser
        root[MODULE_NAME] = createVerbalExpression;
    }
}(this));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const templateNavItem = __webpack_require__(5);

const templateNav = (items = []) => (`
  <nav>
    <ul>
    ${items.map(item => (
      templateNavItem(item)
    )).join('')}
    </ul>
  </nav>
`);

module.exports = templateNav;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(2);

__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(12);
__webpack_require__(11);
__webpack_require__(10);

__webpack_require__(13);
__webpack_require__(4);


/***/ })
/******/ ]);