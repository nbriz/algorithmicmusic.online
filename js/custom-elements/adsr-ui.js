/* global nn, Tone, d3 */
class AdsrUI extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this.width = 600
    this.height = 300

    // Create the UI structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --text-color: black;
          --background-color: white;
          --accent-color: #de09ab;
          --grid-lines: #ccc;
          display: block;
          padding: 10px;
          font-family: Arial, sans-serif;
        }

        * { box-sizing: border-box; }

        .controls {
          display: flex;
          align-items: center;
          justify-content: start;
        }

        button {
          border: 1px solid var(--text-color);
          background: var(--background-color);
          color: var(--text-color);
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
        }

        button.active {
          background: var(--accent-color1);
          border-color: var(--accent-color1);
        }

        #adsrEnvelope {
          border-right: 2px solid var(--text-color);
          border-bottom: 2px solid var(--text-color);
          background:
            linear-gradient(to right, var(--grid-lines) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-lines) 1px, transparent 1px);
          background-size: 20px 20px; /* Grid cell size */
        }

        button:hover {
          opacity: 0.8;
        }

        .envelope-svg {
          margin-top: 20px;
        }
      </style>


      <div class="controls">
        <button id="synth-hold" data-down="false">press && hold</button>
        <svg id="waveform-element"></svg>
      </div>
      <svg id="adsrEnvelope" class="envelope-svg" width="${this.width}" height="${this.height}"></svg>
    `

    this.synth = new Tone.Synth().toDestination()

    this.svg = this.shadowRoot.getElementById('adsrEnvelope')

    this.params = {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }

    this.displayValues = false

    this.max = 2

    this.margins = { top: 20, right: 80, bottom: 20, left: 20 }

    this.shadowRoot.querySelector('#synth-hold').addEventListener('mousedown', (e) => {
      if (e.target.dataset.down === 'false') {
        e.target.style.background = 'var(--accent-color)'
        e.target.style.borderColor = 'var(--accent-color)'
        e.target.style.color = 'var(--background-color)'
        this.attack()
      }
      e.target.dataset.down = 'true'
    })

    this.shadowRoot.querySelector('#synth-hold').addEventListener('mouseup', (e) => {
      e.target.style.background = 'var(--background-color)'
      e.target.style.borderColor = 'var(--text-color)'
      e.target.style.color = 'var(--text-color)'
      this.release()
      e.target.dataset.down = 'false'
    })

    this.drawEnvelope()

    this.wave = this.createWaveform()
    this.synth.connect(this.wave)

    // Setup light/dark mode logic (on page load)
    if (document.body.classList.contains('dark-mode')) {
      this.updateTheme('dark')
    } else {
      this.updateTheme('light')
    }
  }

  onChange (func) {
    this.cb = func
  }

  updateTheme (theme) {
    // Update the internal custom properties for the MainMenu component
    const root = this.shadowRoot.host
    if (theme === 'dark') {
      root.style.setProperty('--background-color', 'black')
      root.style.setProperty('--text-color', 'white')
      root.style.setProperty('--accent-color', '#ff7de9')
      root.style.setProperty('--grid-lines', '#333')
    } else {
      root.style.setProperty('--background-color', 'white')
      root.style.setProperty('--text-color', 'black')
      root.style.setProperty('--accent-color', '#de09ab')
      root.style.setProperty('--grid-lines', '#ccc')
    }
  }

  play (d) {
    this.synth.triggerAttackRelease(440, d || '8n')
  }

  attack () {
    this.synth.triggerAttack(440)
  }

  release () {
    this.synth.triggerRelease(Tone.now())
  }

  createWaveform () {
    const ele = this.shadowRoot.querySelector('#waveform-element')
    ele.style.display = 'block'
    ele.style.width = '477px'
    ele.style.height = '150px'
    ele.style.background = 'transparent'
    const stroke = 'var(--text-color)'
    const lineWidth = 2
    const sensativity = 0.5
    const binSize = 1024
    const audioCtx = Tone.context
    const fftNode = audioCtx.createAnalyser()
    fftNode.fftSize = binSize
    fftNode.smoothingTimeConstant = 0.7

    const svg = d3.select(ele)
    const width = 477
    const height = 150

    // Set up scales for x and y
    const xScale = d3.scaleLinear()
      .domain([0, binSize - 1])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([height, 0])

    // Append a path element for the waveform
    const path = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', stroke)
      .attr('stroke-width', lineWidth)

    svg.append('text')
      .attr('x', 0)
      .attr('y', 250)
      .attr('fill', 'var(--text-color)')
      .attr('font-size', '1em')
      .text('test')

    // Create a D3 line generator
    const line = d3.line()
      .x((_, i) => xScale(i)) // Map index to x-position
      .y(d => yScale(d)) // Map waveform value to y-position
      .curve(d3.curveCatmullRom) // Smooth curve interpolation

    const dataArray = new Float32Array(fftNode.fftSize)
    function animate () {
      // const vals = waveNode.getValue()
      fftNode.getFloatTimeDomainData(dataArray)
      path.attr('d', line(dataArray))
      window.requestAnimationFrame(animate)
    }

    animate()

    const gainNode = audioCtx.createGain ? audioCtx.createGain() : audioCtx.createGainNode()
    gainNode.gain.value = sensativity
    gainNode.connect(fftNode)

    const node = gainNode
    node.ele = ele
    node.svg = svg
    node.animate = animate

    return node
  }

  updateEnvelope (param, value) {
    // console.log('updateEnvelope', param, value);
    this.params[param] = value
    this.synth.envelope[param] = value
    this.drawEnvelope()
    if (this.cb) this.cb(this.params)
  }

  drawEnvelope () {
    const { attack, decay, sustain, release } = this.params
    const { top, right, bottom, left } = this.margins

    const plotWidth = this.width - left - right
    const plotHeight = this.height - top - bottom
    const max = plotWidth * 0.3

    const aX = nn.map(attack, 0, this.max, 0, max)
    const dX = nn.map(decay, 0, this.max, 0, max)
    const sY = nn.map(sustain, 1, 0, top, plotHeight + top)
    const rX = nn.map(release, 0, this.max, 0, max)

    const rnd = (n) => Math.round(n * 10) / 10
    const aL = this.displayValues ? `Attack ${rnd(attack)}s` : 'Attack'
    const dL = this.displayValues ? `Decay ${rnd(decay)}s / Sustain ${rnd(sustain)}%` : 'Decay / Sustain'
    const rL = this.displayValues ? `Release ${rnd(release)}s` : 'Release'

    const points = [
      // Start
      { x: left, y: top + plotHeight },
      // Attack peak
      { l: aL, x: left + aX, y: top },
      // Decay/Sustain
      { l: dL, x: left + aX + dX, y: sY },
      // End of Sustain
      { x: left + aX + dX + (plotWidth * 0.1), y: sY },
      // Release (bottom-right corner)
      { l: rL, x: left + aX + dX + (plotWidth * 0.1) + rX, y: top + plotHeight }
    ]

    const line = d3.line()
      .x(d => d.x)
      .y(d => d.y)

    const area = d3.area()
      .x(d => d.x)
      .y0(top + plotHeight)
      .y1(d => d.y)

    const svg = d3.select(this.svg)
    svg.selectAll('*').remove()

    svg.append('path')
      .datum(points)
      .attr('fill', 'var(--text-color)')
      .attr('opacity', 0.1)
      .attr('d', area)

    svg.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-color)')
      .attr('stroke-width', 2)
      .attr('d', line)

    points.forEach((point, i) => {
      if (i > 0 && i < points.length && point.l) {
        svg.append('circle')
          .attr('cx', point.x)
          .attr('cy', point.y)
          .attr('r', 5)
          .attr('stroke', 'var(--accent-color)')
          .attr('stroke-width', 2)
          .attr('fill', 'var(--background-color)')
          .style('cursor', 'pointer')
          .call(d3.drag()
            .on('drag', (event) => this.handleDrag(event, i, points)))

        svg.append('text')
          .attr('x', point.x + 5)
          .attr('y', point.y - 5)
          .attr('fill', 'var(--text-color)')
          .attr('font-size', '1em')
          .text(point.l)
          .attr('class', `label-${i}`)
      }
    })
  }

  handleDrag (event, index, points) {
    const { top, right, bottom, left } = this.margins
    const { attack, decay } = this.params

    const plotWidth = this.width - left - right
    const plotHeight = this.height - top - bottom
    const max = plotWidth * 0.3
    const maxY = plotHeight + top

    if (index === 1) {
      // Adjust attack
      const aX = nn.clamp(event.x, left, left + max)
      const aV = nn.map(aX, left, left + max, 0, this.max)
      this.updateEnvelope('attack', aV)
    } else if (index === 2) {
      // Adjust decay and sustain
      const aX = nn.map(attack, 0, this.max, left, left + max)
      const dX = nn.clamp(event.x, aX, aX + max)
      const dV = nn.map(dX, aX, aX + max, 0, this.max)
      this.updateEnvelope('decay', dV)

      const sY = nn.clamp(event.y, top, maxY)
      const sV = nn.map(sY, top, maxY, 1, 0)
      this.updateEnvelope('sustain', sV)
    } else if (index === 4) {
      // Adjust release
      const aX = nn.map(attack, 0, this.max, left, left + max)
      const dX = nn.map(decay, 0, this.max, aX, aX + max)
      const sX = plotWidth * 0.1
      const rX = nn.clamp(event.x, dX + sX, dX + sX + max)
      const rV = nn.map(rX, dX + sX, dX + sX + max, 0, this.max)
      this.updateEnvelope('release', rV)
    }
  }
}

// Define the custom element
window.customElements.define('adsr-ui', AdsrUI)
