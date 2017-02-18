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

    this.pause = this.pause.bind(this);
    this.increment = this.increment.bind(this);
  }

  initShadowRoot() {}

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
    this._resolution = this.getAttribute('resolution') || 100;

    const formPause = this.shadowRoot.querySelector('form#pause');
    formPause.addEventListener('submit', this.pause);
    formPause.addEventListener('chrono:buttonclick', this.pause);
  }

  disconnectedCallback() {
    const formPause = this.shadowRoot.querySelector('form#pause');
    formPause.removeEventListener('submit', this.pause);
    formPause.removeEventListener('chrono:buttonclick', this.pause);

    window.cancelAnimationFrame(this.animation);
  }

  update(timer) {
    this.updateElapsed(timer);

    const pauseButton = this.shadowRoot.querySelector('#pause chrono-button');
    const elapsed = this.shadowRoot.querySelector('#elapsed');

    if (!this.state.paused) {
      pauseButton.querySelector('#stop').classList.remove('hide');
      pauseButton.querySelector('#start').classList.add('hide');
      elapsed.classList.remove('paused');

      window.cancelAnimationFrame(this.animation);
      this.increment();
    } else {
      pauseButton.querySelector('#stop').classList.add('hide');
      pauseButton.querySelector('#start').classList.remove('hide');
      elapsed.classList.add('paused');

      window.cancelAnimationFrame(this.animation);
    }

    this.setAttribute('stateid', timer.id);
  }

  updateElapsed(timer) {
    let elapsed = 0;

    if (timer.paused) {
      elapsed = timer.paused;
    } else {
      elapsed = Date.now() - timer.start;
    }

    this.shadowRoot.querySelector('#elapsed').textContent = this.constructor.formatTime(elapsed, this._resolution);
  }

  static formatTime(elapsed, resolution = 100) {
    const hours = Math.floor(elapsed / (60 * 60 * 1000));
    const minutes = Math.floor((elapsed - (hours * 60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((elapsed - (hours * 60 * 60 * 1000) - (minutes * 60 * 1000)) / 1000);
    const ms = elapsed - (hours * 60 * 60 * 1000) - (minutes * 60 * 1000) - (seconds * 1000);

    let remainder = false;
    if (resolution > 1) {
      remainder = Math.floor(ms * (resolution / 1000));
    }

    const timeParts = [];

    if (remainder !== false) {
      timeParts.push(`${remainder < 10 ? `0${remainder}` : remainder}`);
    }

    timeParts.push(`${seconds < 10 ? `0${seconds}` : seconds}`);
    timeParts.push(`${minutes < 10 ? `0${minutes}` : minutes}`);

    if (remainder === false || hours > 0) {
      timeParts.push(`${hours < 10 ? `0${hours}` : hours}`);
    }

    /*
    if (minutes || hours || remainder === false) {
      if (hours) {
        timeParts.push(`${minutes < 10 ? `0${minutes}` : minutes}`);
        timeParts.push(`${hours < 10 ? `0${hours}` : hours}`);
      } else if (minutes > 0 || remainder === false) {
        timeParts.push(`${minutes < 10 ? `0${minutes}` : minutes}`);
      }
    }
    */

    return timeParts.reverse().join(':');
  }

  pause(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerpause', {
      detail: {
        id: this.state.id,
        time: Date.now(),
      },
      bubbles: true,
      composed: true,
    }));
  }

  increment() {
    const diff = Math.floor((Date.now() - this.state.start) / (1000 / this._resolution));

    if (diff > this._lastElapsed) {
      this.updateElapsed(this.state);
    }

    this._lastElapsed = diff;
    if (!this.state.paused) {
      this.animation = window.requestAnimationFrame(this.increment);
    }
  }
}

window.customElements.define('chrono-timer', ChronoTimer);

module.exports = ChronoTimer;
