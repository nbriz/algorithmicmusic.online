// ...work in progress...
// ...bairly in use...
class AMCore extends window.HTMLElement {
  static get observedAttributes () {
    return ['theme']
  }

  // Called when the observed attribute changes
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'theme') {
      this.updateTheme(newValue)
    }
  }

  setup () {
    const script = document.querySelector('script[src$="algo-music-ui.js"]')
    const defaultTheme = script ? script.getAttribute('data-theme') : 'light'

    if (!this.hasAttribute('theme')) {
      this.setAttribute('theme', defaultTheme)
    }

    this.updateTheme(this.getAttribute('theme'))
  }

  updateTheme (theme) {
    const root = this.shadowRoot.host
    if (theme === 'dark') {
      root.style.setProperty('--background-color', 'black')
      root.style.setProperty('--text-color', 'white')
      root.style.setProperty('--accent-color', '#ff7de9')
    } else {
      root.style.setProperty('--background-color', 'white')
      root.style.setProperty('--text-color', 'black')
      root.style.setProperty('--accent-color', '#de09ab')
    }
  }
}
window.customElements.define('am-core', AMCore)

class AMButton extends AMCore {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    // Create the menu structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --text-color: black;
          --background-color: white;
          --accent-color: #de09ab;
        }

        * {
          font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
          font-weight: 300;
          box-sizing: border-box;
        }

        button {
          border: 1px solid var(--text-color);
          background: var(--background-color);
          color: var(--text-color);
          padding: 8px 16px;
          border-radius: 12px;
        }

        button:hover {
          cursor: pointer;
          background: var(--text-color);
          color: var(--background-color)
        }

        button.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
        }
      </style>

      <button>
        <!-- slot for content -->
        <slot></slot>
      </button>
    `

    const b = this.shadowRoot.querySelector('button')
    b.addEventListener('mousedown', () => {
      b.classList.add('active')
    })
    b.addEventListener('mouseup', () => {
      b.classList.remove('active')
    })

    this.setup()
  }
}
window.customElements.define('am-button', AMButton)

class AMSwitch extends AMCore {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    // Create the menu structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --text-color: black;
          --background-color: white;
          --accent-color: #de09ab;
        }

        * {
          font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
          font-weight: 300;
          box-sizing: border-box;
        }

        /* The switch - the box around the slider */
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 35px;
        }

        /* Hide default HTML checkbox */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        /* The slider */
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform: translateY(-6px);
          background-color: var(--text-color);
          border: 1px solid var(--background-color);
          border-radius: 34px;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: var(--background-color);
          border-radius: 50%;
          transition: .4s;
        }

        input:checked + .slider { background-color: var(--accent-color); }
        input:focus + .slider { box-shadow: 0 0 1px var(--accent-color); }
        input:checked + .slider:before { transform: translateX(26px); }


        .content {
          display: inline-block;
          position: relative;
          left: 60px;
        }
      </style>

      <label class="switch">
        <input type="checkbox">
        <span class="slider"></span>
        <span class="content">
          <!-- slot for content -->
          <slot></slot>
        </span>
      </label>
    `

    this.setup()
  }
}
window.customElements.define('am-switch', AMSwitch)

class AMRange extends AMCore {
  static get observedAttributes () {
    return [...(super.observedAttributes || []), 'min', 'max', 'step', 'value']
  }

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --text-color: black;
          --background-color: white;
          --accent-color: #de09ab;
        }

        * {
          font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
          font-weight: 300;
          box-sizing: border-box;
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          background: var(--text-color);
          border-radius: 4px;
          outline: none;
          transition: background 0.3s ease;
        }

        input[type="range"]:hover {
          background: var(--text-color);
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--background-color);
          border-radius: 50%;
          border: 1px solid var(--text-color);
          cursor: pointer;
          transition: background 0.3s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: var(--text-color);
        }

        input[type="range"]::-webkit-slider-thumb:active {
          background: var(--text-color);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--background-color);
          border-radius: 50%;
          border: 1px solid var(--text-color);
          cursor: pointer;
          transition: background 0.3s ease;
        }

        input[type="range"]::-moz-range-track {
          background: var(--text-color);
          height: 8px;
          border-radius: 4px;
        }

        input[type="range"]::-ms-thumb {
          width: 20px;
          height: 20px;
          background: var(--background-color);
          border-radius: 50%;
          cursor: pointer;
        }

        input[type="range"]::-ms-track {
          background: var(--text-color);
          height: 8px;
          border: none;
          color: transparent;
        }

        input[type="range"]::-ms-fill-lower {
          background: var(--text-color);
        }

        input[type="range"]::-ms-fill-upper {
          background: var(--text-color);
        }
      </style>

      <input type="range" />
    `

    this.input = this.shadowRoot.querySelector('input[type="range"]')
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback()
    this.syncAttributes()
    this.input.addEventListener('input', this.handleInput.bind(this))
  }

  disconnectedCallback () {
    super.disconnectedCallback && super.disconnectedCallback()
    this.input.removeEventListener('input', this.handleInput.bind(this))
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (['min', 'max', 'step', 'value'].includes(name)) {
      this.syncAttributes()
    }
    super.attributeChangedCallback && super.attributeChangedCallback(name, oldValue, newValue)
  }

  handleInput (event) {
    this.setAttribute('value', event.target.value)
    this.dispatchEvent(new window.Event('input'))
  }

  syncAttributes () {
    const attributes = ['min', 'max', 'step', 'value']
    attributes.forEach((attr) => {
      if (this.hasAttribute(attr)) {
        this.input.setAttribute(attr, this.getAttribute(attr))
      } else {
        this.input.removeAttribute(attr)
      }
    })

    // Sync internal input value with custom element's value
    if (this.hasAttribute('value')) {
      this.input.value = this.getAttribute('value')
    }
  }

  get min () { return this.getAttribute('min') }

  set min (value) { this.setAttribute('min', value) }

  get max () { return this.getAttribute('max') }

  set max (value) { this.setAttribute('max', value) }

  get step () { return this.getAttribute('step') }

  set step (value) { this.setAttribute('step', value) }

  get value () {
    return this.input.value // Return the current value from the internal input
  }

  set value (value) {
    this.setAttribute('value', value) // Update the custom element's attribute
    this.input.value = value // Synchronize the internal input's value
  }
}

window.customElements.define('am-range', AMRange)
