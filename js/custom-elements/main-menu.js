class MainMenu extends window.HTMLElement {
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

        * { box-sizing: border-box; }

        a {
          color: var(--text-color);
          text-decoration: none;
        }

        a:hover {
          color: var(--accent-color);
        }

        .menu-icon {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 101;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 22px;
          cursor: pointer;
        }

        .menu-icon .line {
          width: 30px;
          height: 2px;
          background-color: var(--text-color);
          transition: all 0.3s ease;
        }

        .menu-icon.active .line:nth-child(1) {
          transform: rotate(45deg) translate(4px, 9px);
        }

        .menu-icon.active .line:nth-child(2) {
          opacity: 0;
        }

        .menu-icon.active .line:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -9px);
        }

        #menu-options {
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.25s;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--background-color);
          padding: 6vw;
          line-height: 3em;
        }

        #menu-options.active {
          visibility: visible;
          opacity: 1;
          overflow: scroll;
        }

        #menu-options > * {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        #menu-options a {
          font-size: 2em;
        }

        .smaller {
          font-size: 1em;
          border-top: 1px solid var(--text-color);
          padding: 1em 2em 0 2em;
          margin-top: 1em;
          flex-direction: column;
          justify-content: space-between;
        }

        .inactive {
          font-size: 2em;
          opacity: 0.25;
          cursor: default;
          text-decoration: none;
        }

        .inactive:hover {
          color: var(--text-color);
          text-decoration: none;
        }
      </style>

      <div class="menu-icon" id="menu">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>

      <nav id="menu-options">

        <span>
          <a href="/#introduction">introduction</a>
        </span>
        <span>
          <a  href='/sound'>sound</a>
        </span>
        <span>
          <a href="/sampling">sampling</a>
        </span>
        <span>
          <a href="/signals">signals</a>
        </span>
        <span>
          <a href="/synths">synths</a>
        </span>
        <span>
          <a href="/scales">modes + scales</a>
        </span>
        <span>
          <a class="inactive">rhythm + melody&nbsp;</a>
        </span>
        <span>
          <a class="inactive">&nbsp;&nbsp;chords + arpeggios</a>
        </span>
        <span>
          <a class="inactive">algorithmic composition</a>
        </span>


        <!-- v1 MENU -->

        <!-- <span>
          <a href="/#introduction">introduction</a>
        </span>
        <span>
          <a href="/sound">what is sound</a>
        </span>
        <span>
          <a href="/signals">signals and synths</a>
        </span>
        <span>
          <a href="/sampling">audio sampling</a>
        </span>
        <span>
          <a href="/scales">chords and scales</a>
        </span>
        <span>
          <a class="inactive">rythm and melody</a>
        </span>
        <span>
          <a href="/coldplay">algorithmic composition</a>
        </span> -->

        <div class="smaller">
          <span>
            <a href="/assignments">assignments</a>
          </span>
          <span>
            <a href="/ai-policy">ai policy + protocol</a>
          </span>
          <span>
            <a href="/editor">code editor + demos</a>
          </span>
        </div>

        <!-- Slot for external content like the switch -->
        <slot name="menu-items"></slot>
      </nav>
    `

    // Bind event listener for menu toggling
    this._menuIcon = this.shadowRoot.querySelector('#menu')
    this._menuOptions = this.shadowRoot.querySelector('#menu-options')
    this._menuIcon.addEventListener('click', this.toggleMenu.bind(this))

    this.shadowRoot.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (this._menuIcon.classList.contains('active')) this.toggleMenu()
      })
    })

    // Setup light/dark mode logic (on page load)
    if (document.body.classList.contains('dark-mode')) {
      this.updateTheme('dark')
    } else {
      this.updateTheme('light')
    }
  }

  toggleMenu () {
    this._menuIcon.classList.toggle('active')
    this._menuOptions.classList.toggle('active')
  }

  updateTheme (theme) {
    // Update the internal custom properties for the MainMenu component
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
    if (this.callback) this.callback(theme)
  }
}

// Define the custom element
window.customElements.define('main-menu', MainMenu)
