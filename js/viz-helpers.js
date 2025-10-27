/* global Tone */
window.viz = {}
/*

// set it up like this
// --------------------

const spec = viz.createSpectrum()

// or
const spec = viz.createSpectrum({
  ele: '#spectrum-element',
  width: '700px',
  height: '200px',
  background: 'black',
  color: 'white',
  range: [20, 20000], // frequency range to display (Hz), linear scale
  harmonics: true, // draw harmonic markers for 440 Hz (2x, 4x, 8x, ...)
  labels: true, // draw "Frequency (Hz)" and "Harmonic Number" labels
  audioCtx: ctx, // if u prefer to use a non Tone.js context
  binSize: 1024, // FFT size (power of 2)
  sensativity: 0.08, // higher, more sensitive
  manuallyCallAnimate: false,
  lineWidth: 1 // optional stroke width of the spectrum trace
})

// use it like this
// ------------------

const synth = new Tone.Synth({
  volume: -5,
  oscillator: { type: 'square' }
}).toDestination()

synth.connect(spec)

nn.create('button')
  .content('play synth')
  .addTo('body')
  .on('click', () => synth.triggerAttackRelease(440, 3))

*/
/*

// set it up like this
// --------------------

const wave = viz.createWaveform()

// or
const wave = viz.createWaveform({
  ele: '#waveform-element',
  width: '700px',
  height: '200px',
  background: 'black',
  color: 'white',
  lineWidth: 2,
  audioCtx: ctx, // if u prefer to use a non Tone.js context
  binSize: 1024, // fft bin size (power of 2)
  sensativity: 0.08, // higher, more sensitive
  manuallyCallAnimate: false,
  smooth: false // optional: curve smoothing (default true)
})

// use it like this
// ------------------

const synth = new Tone.Synth({
  volume: -5,
  oscillator: { type: "square" }
}).toDestination()

synth.connect(wave)

nn.create('button')
  .content('play synth')
  .addTo('body')
  .on('click', () => synth.triggerAttackRelease(440, 3))

*/
window.viz.createWaveform = function (opts) {
  opts = opts || {}

  // svg element (use provided selector or create one)
  const svg = (typeof opts.ele === 'string'
    ? document.querySelector(opts.ele)
    : null) || document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  if (!svg) {
    console.error('createWaveform: "ele" selector did not match an element')
    return
  }
  if (!svg.parentNode) document.body.appendChild(svg)
  if (svg.nodeName.toLowerCase() !== 'svg') {
    console.error('createWaveform: "ele" expecting reference to <svg> element')
    return
  }

  // styling
  svg.style.display = 'block'
  svg.style.width = opts.width || '100%'
  svg.style.height = opts.height || '200px'
  svg.style.background = opts.background || 'transparent'

  const stroke = opts.color || 'black'
  const lineWidth = opts.lineWidth || 2
  const sensitivity = opts.sensativity || 0.5
  const binSize = opts.binSize || 1024
  const smooth = opts.smooth !== false // allow opts.smooth=false to disable smoothing

  // audio analyser
  const audioCtx = opts.audioCtx || Tone.context
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = binSize
  analyser.smoothingTimeConstant = 0.7
  let dataArray = new Float32Array(analyser.fftSize)

  // svg path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', stroke)
  path.setAttribute('stroke-width', lineWidth)
  svg.appendChild(path)

  // helpers
  const getSize = () => {
    const w = svg.clientWidth || parseInt(svg.style.width, 10) || 700
    const h = svg.clientHeight || parseInt(svg.style.height, 10) || 200
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h)
    return { w, h }
  }

  const mapX = (i, n, w) => n <= 1 ? 0 : (i / (n - 1)) * w
  const mapY = (v, h) => (1 - (v + 1) / 2) * h // [-1,1] -> [h,0]

  // Catmull-Rom (uniform) to cubic Bezier approximation; simple and fast
  const buildPath = (arr, w, h, doSmooth) => {
    const n = arr.length
    if (!n) return ''
    const pts = new Array(n)
    for (let i = 0; i < n; i++) pts[i] = [mapX(i, n, w), mapY(arr[i], h)]

    if (!doSmooth || n < 4) {
      let d = 'M' + pts[0][0] + ' ' + pts[0][1]
      for (let i = 1; i < n; i++) d += 'L' + pts[i][0] + ' ' + pts[i][1]
      return d
    }

    let d = 'M' + pts[0][0] + ' ' + pts[0][1]
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[i - 1] || pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] || p2
      // Catmull-Rom (uniform) → Bezier control points
      const c1x = p1[0] + (p2[0] - p0[0]) / 6
      const c1y = p1[1] + (p2[1] - p0[1]) / 6
      const c2x = p2[0] - (p3[0] - p1[0]) / 6
      const c2y = p2[1] - (p3[1] - p1[1]) / 6
      d += 'C' + c1x + ' ' + c1y + ',' + c2x + ' ' + c2y + ',' + p2[0] + ' ' + p2[1]
    }
    return d
  }

  const draw = () => {
    const { w, h } = getSize()
    if (dataArray.length !== analyser.fftSize) {
      dataArray = new Float32Array(analyser.fftSize)
    }
    analyser.getFloatTimeDomainData(dataArray)
    path.setAttribute('d', buildPath(dataArray, w, h, smooth))
  }

  function animate () {
    draw()
    window.requestAnimationFrame(animate)
  }
  if (!opts.manuallyCallAnimate) animate()

  // input node you can connect audio into
  const gain = audioCtx.createGain ? audioCtx.createGain() : audioCtx.createGainNode()
  gain.gain.value = sensitivity
  gain.connect(analyser)

  // public surface (keeps previous API shape)
  const node = gain
  node.ele = svg
  node.animate = animate
  node.draw = draw
  node.destroy = () => {
    try { gain.disconnect() } catch {}
    try { analyser.disconnect() } catch {}
    if (path.parentNode) path.parentNode.removeChild(path)
    if (!opts.ele && svg.parentNode) svg.parentNode.removeChild(svg)
  }

  return node
}
// createSpectrum — d3-free SVG frequency spectrum visualizer (connect like a GainNode)
window.viz.createSpectrum = function (opts) {
  opts = opts || {}

  // resolve or create the SVG
  const svg = (typeof opts.ele === 'string'
    ? document.querySelector(opts.ele)
    : null) || document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  if (!svg) {
    console.error('createSpectrum: "ele" selector did not match any element')
    return
  }
  if (svg.nodeName.toLowerCase() !== 'svg') {
    console.error('createSpectrum: "ele" expecting reference to <svg> element')
    return
  }
  if (!svg.parentNode) document.body.appendChild(svg)

  // style
  svg.style.display = 'block'
  svg.style.width = opts.width || '100%'
  svg.style.height = opts.height || '200px'
  svg.style.background = opts.background || 'transparent'

  // options
  const stroke = opts.color || 'black'
  const lineWidth = opts.lineWidth || 1
  const showHarmonics = !!opts.harmonics
  const showLabels = !!opts.labels
  const sensitivity = opts.sensativity || 0.08
  const binSize = opts.binSize || 1024
  const range = Array.isArray(opts.range) && opts.range.length === 2 ? opts.range : [20, 20000]
  const baseHz = 440 // for harmonic markers

  // margins + geometry
  const margins = { top: 10, right: 10, bottom: 30, left: 25 }
  const getSize = () => {
    const canvasWidth = svg.clientWidth || parseInt(svg.style.width, 10) || 700
    const canvasHeight = svg.clientHeight || parseInt(svg.style.height, 10) || 200
    const plotWidth = canvasWidth - margins.left - margins.right
    const plotHeight = canvasHeight - margins.top - margins.bottom
    svg.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`)
    return { canvasWidth, canvasHeight, plotWidth, plotHeight }
  }

  // audio bits
  const AC = window.AudioContext || window.webkitAudioContext
  const audioCtx = opts.audioCtx || (typeof Tone !== 'undefined' ? Tone.context : (AC ? new AC() : null))
  if (!audioCtx) {
    console.error('createSpectrum: no AudioContext available (provide opts.audioCtx or include Tone.js)')
    return
  }
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = binSize
  analyser.smoothingTimeConstant = 0.7
  const frequencyData = new Uint8Array(analyser.frequencyBinCount)
  const frequencyPerBin = audioCtx.sampleRate / binSize // Hz per index (linear)

  // scales (linear)
  const xScale = (f, dims) => {
    const [minF, maxF] = range
    const clamped = Math.max(minF, Math.min(maxF, f))
    const x = (clamped - minF) / (maxF - minF)
    return margins.left + x * dims.plotWidth
  }
  const yScale = (v, dims) => {
    // amplitude 0..1.2 mapped to screen (bottom at 0)
    const minV = 0
    const maxV = 1.2
    const y = (v - minV) / (maxV - minV)
    return margins.top + (1 - y) * dims.plotHeight
  }

  // static groups
  const gAxes = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  const gHarm = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  const gPath = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  svg.appendChild(gAxes)
  svg.appendChild(gHarm)
  svg.appendChild(gPath)

  // axis elements
  const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  xAxisLine.setAttribute('stroke', stroke)
  xAxisLine.setAttribute('stroke-width', 1)
  xAxisLine.setAttribute('opacity', 0.6)
  gAxes.appendChild(xAxisLine)

  // y-axis domain line + a single tick label at 1.0
  const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  yAxisLine.setAttribute('stroke', stroke)
  yAxisLine.setAttribute('stroke-width', 1)
  yAxisLine.setAttribute('opacity', 0.6)
  gAxes.appendChild(yAxisLine)

  const yTick1 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  yTick1.setAttribute('fill', stroke)
  yTick1.setAttribute('font-size', '10')
  yTick1.setAttribute('text-anchor', 'end') // left of axis
  yTick1.setAttribute('dominant-baseline', 'middle')
  yTick1.textContent = '1.0'
  gAxes.appendChild(yTick1)

  const xTicks = []
  const tickFreqs = [baseHz, baseHz * 2, baseHz * 4, baseHz * 8, baseHz * 16, baseHz * 32]
  tickFreqs.forEach(freq => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    l.setAttribute('stroke', stroke)
    l.setAttribute('stroke-width', 1)
    l.setAttribute('opacity', 0.6)
    gAxes.appendChild(l)
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    t.setAttribute('fill', stroke)
    t.setAttribute('font-size', '10')
    t.setAttribute('text-anchor', 'middle')
    t.textContent = Math.round(freq).toString()
    gAxes.appendChild(t)
    xTicks.push({ freq, l, t })
  })

  // labels
  let labelFreq = null
  let labelHarm = null
  if (showLabels) {
    labelFreq = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    labelFreq.setAttribute('fill', stroke)
    labelFreq.setAttribute('font-size', '10')
    labelFreq.textContent = 'Frequency (Hz)'
    gAxes.appendChild(labelFreq)
    if (showHarmonics) {
      labelHarm = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      labelHarm.setAttribute('fill', stroke)
      labelHarm.setAttribute('font-size', '10')
      labelHarm.textContent = 'Harmonic Number'
      gAxes.appendChild(labelHarm)
    }
  }

  // harmonic markers
  const harmLines = []
  const harmTexts = []
  if (showHarmonics) {
    for (let i = 1; i <= 40; i++) {
      const freq = (i + 1) * baseHz
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      l.setAttribute('stroke', 'grey')
      l.setAttribute('stroke-dasharray', '5,1')
      l.setAttribute('opacity', 0.8)
      gHarm.appendChild(l)
      harmLines.push({ freq, l })

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      txt.setAttribute('fill', 'grey')
      txt.setAttribute('font-size', '10')
      txt.setAttribute('text-anchor', 'middle')
      txt.textContent = String(i + 1)
      gHarm.appendChild(txt)
      harmTexts.push({ freq, txt })
    }
  }

  // spectrum path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', stroke)
  path.setAttribute('stroke-width', lineWidth)
  path.setAttribute('opacity', 0.8)
  gPath.appendChild(path)

  // layout pass (axes, ticks, markers, labels)
  const layout = () => {
    const dims = getSize()
    const y0 = yScale(0, dims)
    const y1 = yScale(1, dims)
    const top = margins.top
    const bottom = margins.top + dims.plotHeight
    const left = margins.left
    const right = margins.left + dims.plotWidth

    // x-axis baseline
    xAxisLine.setAttribute('x1', left)
    xAxisLine.setAttribute('y1', y0)
    xAxisLine.setAttribute('x2', right)
    xAxisLine.setAttribute('y2', y0)

    // y-axis domain (vertical line at left)
    yAxisLine.setAttribute('x1', left)
    yAxisLine.setAttribute('y1', top)
    yAxisLine.setAttribute('x2', left)
    yAxisLine.setAttribute('y2', bottom)

    // y tick label at 1.0
    yTick1.setAttribute('x', left - 4) // a few px left of the axis
    yTick1.setAttribute('y', y1)

    // ticks at selected freqs (if in range)
    xTicks.forEach(({ freq, l, t }) => {
      if (freq < range[0] || freq > range[1]) {
        l.setAttribute('visibility', 'hidden')
        t.setAttribute('visibility', 'hidden')
        return
      }
      const x = xScale(freq, dims)
      l.setAttribute('visibility', 'visible')
      t.setAttribute('visibility', 'visible')
      l.setAttribute('x1', x)
      l.setAttribute('x2', x)
      l.setAttribute('y1', y0)
      l.setAttribute('y2', y0 + 3)
      t.setAttribute('x', x)
      t.setAttribute('y', y0 + 12)
    })

    // labels
    if (labelFreq) {
      labelFreq.setAttribute('x', left + dims.plotWidth - 75)
      labelFreq.setAttribute('y', y0 + 12)
    }
    if (labelHarm) {
      labelHarm.setAttribute('x', left + dims.plotWidth - 80)
      labelHarm.setAttribute('y', y0 + 25)
    }

    // harmonics (short dashed lines + numbers)
    if (showHarmonics) {
      for (let i = 0; i < harmLines.length; i++) {
        const { freq, l } = harmLines[i]
        const { txt } = harmTexts[i]
        if (freq < range[0] || freq > range[1]) {
          l.setAttribute('visibility', 'hidden')
          txt.setAttribute('visibility', 'hidden')
          continue
        }
        const x = xScale(freq, dims)
        l.setAttribute('visibility', 'visible')
        txt.setAttribute('visibility', 'visible')
        l.setAttribute('x1', x)
        l.setAttribute('x2', x)
        l.setAttribute('y1', y0)
        l.setAttribute('y2', y0 + 15)
        txt.setAttribute('x', x - 1)
        txt.setAttribute('y', y0 + 25)
      }
    }
  }

  // build the spectrum polyline/path string
  const buildPath = (dims) => {
    const n = frequencyData.length
    if (!n) return ''
    let d = ''
    // iterate through bins, map to freq and amplitude
    for (let i = 0; i < n; i++) {
      const f = i * frequencyPerBin
      if (f < range[0] || f > range[1]) continue
      const x = xScale(f, dims)
      const v = frequencyData[i] / 255 // normalize 0..1
      const y = yScale(v, dims)
      d += (d ? 'L' : 'M') + x + ' ' + y
    }
    return d
  }

  // draw once
  const draw = () => {
    const dims = getSize()
    const d = buildPath(dims)
    path.setAttribute('d', d)
  }

  // animate loop
  function animate () {
    analyser.getByteFrequencyData(frequencyData)
    draw()
    window.requestAnimationFrame(animate)
  }

  // initial layout + loop
  layout()
  if (!opts.manuallyCallAnimate) animate()

  // respond to resizes (optional but nice)
  const ro = new (window.ResizeObserver || function (cb) {
    window.addEventListener('resize', () => cb([{ contentRect: svg.getBoundingClientRect() }]))
  })(() => layout())
  if (ro.observe) ro.observe(svg)

  // return a GainNode you can connect into
  const gain = audioCtx.createGain ? audioCtx.createGain() : audioCtx.createGainNode()
  gain.gain.value = sensitivity
  gain.connect(analyser)

  // public API
  const node = gain
  node.ele = svg
  node.animate = animate
  node.draw = draw
  node.layout = layout
  node.destroy = () => {
    try { gain.disconnect() } catch {}
    try { analyser.disconnect() } catch {}
    if (ro.unobserve) ro.unobserve(svg)
    if (path.parentNode) path.parentNode.removeChild(path)
    while (gAxes.firstChild) gAxes.removeChild(gAxes.firstChild)
    while (gHarm.firstChild) gHarm.removeChild(gHarm.firstChild)
    while (gPath.firstChild) gPath.removeChild(gPath.firstChild)
    if (!opts.ele && svg.parentNode) svg.parentNode.removeChild(svg)
  }

  return node
}
/*

// set it up like this
// --------------------

const spec = viz.createPianoUI()

// or
const pianoGUI = viz.createPianoUI({
  ele: '#piano-svg', // parent SVG element
  width: 700, // width of the piano
  height: 200, // height of the piano
  accentColor: '#6c8cff', // when key is pressed
  labels: true, // show key/note names
  octaves: 2, // number of octaves to render
  on: { // optional event listeners
    mouseover: (n) => console.log(n),
    mousedown: (n) => console.log(n),
    mouseup: (n) => console.log(n),
  }
})

// can also use it like this
// ------------------

piano.attack('C4') // will highlight 'C4' key in accent color
piano.release('C4') // will revert 'C4' key to normal white color

*/
window.viz.createPianoUI = function (options = {}) {
  const defaults = {
    ele: null,
    width: 700,
    height: 200,
    accentColor: '#6c8cff',
    labels: false,
    octaves: 4,
    on: {}
  }

  const settings = { ...defaults, ...options }

  // Ensure `ele` is an SVG element
  const ele = typeof settings.ele === 'string'
    ? document.querySelector(settings.ele)
    : document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  if (typeof settings.ele !== 'string') {
    document.body.appendChild(ele)
  } else if (!ele || ele.nodeName.toLowerCase() !== 'svg') {
    console.error('createPianoUI: "ele" expecting reference to <svg> element')
    return
  }

  // Clear any existing content in the SVG
  ele.innerHTML = ''

  // Determine octave range
  const octaveRange = Array.isArray(settings.octaves)
    ? settings.octaves
    : [settings.octaves, settings.octaves + 1]

  // Calculate correct total white keys
  const totalWhiteKeys = (octaveRange[1] - octaveRange[0]) * 7
  const whiteKeyWidth = settings.width / totalWhiteKeys
  // const totalWhiteKeys = settings.octaves * 7
  // const whiteKeyWidth = settings.width / totalWhiteKeys
  const blackKeyWidth = whiteKeyWidth * 0.6
  const blackKeyHeight = settings.height * 0.6

  const keyMap = [
    { note: 'C', isBlack: false }, { note: 'C#', isBlack: true },
    { note: 'D', isBlack: false }, { note: 'D#', isBlack: true },
    { note: 'E', isBlack: false }, { note: 'F', isBlack: false },
    { note: 'F#', isBlack: true }, { note: 'G', isBlack: false },
    { note: 'G#', isBlack: true }, { note: 'A', isBlack: false },
    { note: 'A#', isBlack: true }, { note: 'B', isBlack: false }
  ]

  this.notes = []
  // TODO: keep track of all the rendered notes

  ele.setAttribute('width', settings.width)
  ele.setAttribute('height', settings.height)
  ele.setAttribute('viewBox', `0 0 ${settings.width} ${settings.height}`)

  const keys = {}
  let x = 0 // Position for white keys
  const whiteKeyPositions = []
  const notes = [] // Track all rendered notes

  // **Generate white keys**
  for (let octave = octaveRange[0]; octave < octaveRange[1]; octave++) {
    keyMap.forEach(({ note, isBlack }) => {
      if (!isBlack) {
        createKey(note, octave, x, false)
        whiteKeyPositions.push({ note, octave, x })
        x += whiteKeyWidth
      }
    })
  }

  // **Generate black keys in correct positions**
  whiteKeyPositions.forEach(({ note, octave, x }) => {
    const blackKeyNote = keyMap.find(k => k.note === note + '#' && k.isBlack)
    if (blackKeyNote) {
      createKey(blackKeyNote.note, octave, x + (whiteKeyWidth * 0.7), true)
    }
  })

  function createKey (note, octave, x, isBlack) {
    const keyLabel = `${note}${octave}`
    notes.push({ note, octave, isBlack, x }) // Track keys
    const key = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    key.setAttribute('x', x)
    key.setAttribute('y', 0)
    key.setAttribute('width', isBlack ? blackKeyWidth : whiteKeyWidth)
    key.setAttribute('height', isBlack ? blackKeyHeight : settings.height)
    key.setAttribute('fill', isBlack ? 'black' : 'white')
    key.setAttribute('stroke', 'black')
    key.setAttribute('data-key', keyLabel)

    keys[keyLabel] = key
    ele.appendChild(key)

    // **Add labels**
    if (settings.labels) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', x + (isBlack ? blackKeyWidth / 2 : whiteKeyWidth / 2))
      text.setAttribute('y', isBlack ? blackKeyHeight - 15 : settings.height - 20)
      text.setAttribute('fill', isBlack ? 'white' : 'black')
      text.setAttribute('font-size', isBlack ? '12' : '16')
      text.setAttribute('font-family', 'Arial, sans-serif')
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      text.textContent = keyLabel
      ele.appendChild(text)
    }

    key.addEventListener('mouseover', (e) => settings.on.mouseover?.(keyLabel, e))
    key.addEventListener('mousedown', (e) => {
      settings.on.mousedown?.(keyLabel, e)
      highlightKey(keyLabel)
    })
    key.addEventListener('mouseup', (e) => {
      settings.on.mouseup?.(keyLabel, e)
      resetKey(keyLabel)
    })
  }

  function highlightKey (keyLabel) {
    if (keys[keyLabel]) {
      keys[keyLabel].setAttribute('fill', settings.accentColor)
    }
  }

  function resetKey (keyLabel) {
    if (keys[keyLabel]) {
      const isBlack = keys[keyLabel].getAttribute('height') === `${blackKeyHeight}`
      keys[keyLabel].setAttribute('fill', isBlack ? 'black' : 'white')
    }
  }

  function attackRelease (keyLabel, time) {
    highlightKey(keyLabel)
    setTimeout(() => resetKey(keyLabel), time * 1000)
  }

  function resetAll () {
    notes.forEach(n => resetKey(n.note + n.octave))
  }

  return {
    notes: notes,
    attack: highlightKey,
    release: resetKey,
    attackRelease: attackRelease,
    reset: resetAll
  }
}

/*
Piano Roll — quick start & API
==============================

Set it up like this
-------------------

const pr = viz.createPianoRoll()

// or with options
const pr = viz.createPianoRoll({
  notes: ['C4', 'C5'],        // pitch rows (inclusive range) → C5 included
  measures: 4,                // number of measures (columns = measures * beats)
  beats: 4,                   // beats per measure
  parent: '#roll',           // element or selector to append into (default: document.body)
  style: {
    measureA: '#ffffff',      // background for even-numbered measures (0-based)
    measureB: '#f6f6f6',      // background for odd-numbered measures
    accent: '#4a90e2',        // note block color (stroke + fill)
    border: '#e0e0e0',        // grid line color
    cellWidth: 28,            // width of one beat cell (px)
    cellHeight: 22,           // height of one pitch row (px)
    gutterWidth: 64,          // left label column width (px)
    font: '12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  }
})

Interaction model
-----------------
• Click on a cell → adds a 1-beat note at that pitch/start.
• Click + drag within a row → adds ONE note whose duration spans the drag.
• Click on any cell covered by an existing note (start/middle/end) → removes that entire note.

Reading & mutating state
------------------------
pr.state
  // Array of notes currently placed:
  // [{ id, pitch: 'C4', start: <col>, duration: <beats> }, ...]

pr.clear()
  // Removes all notes (state + visuals)

Notes about layout & visuals
----------------------------
• The component renders into a Shadow DOM and injects its own styles; it won’t leak CSS.
• Measure backgrounds alternate via measure index; customize with style.measureA/measureB.
• The pitch range is INCLUSIVE when you pass two notes, e.g. ['C4','C5'] → rows C5..C4 (top→bottom).

Minimal example
---------------
const pr = viz.createPianoRoll({
  notes: ['C3', 'C5'],
  measures: 8,
  beats: 4,
  parent: '#roll'
  style: { accent: '#7c4dff' }
})

// later…
console.log(pr.state) // inspect placed notes
pr.clear()                    // wipe the roll
*/

window.viz.createPianoRoll = function (opts = {}) {
  const defaults = {
    notes: ['C4', 'C5'],
    measures: 4,
    beats: 4,
    parent: document.body,
    style: {
      measureA: '#ffffff',
      measureB: '#f6f6f6',
      accent: '#4a90e2',
      border: '#e0e0e0',
      cellWidth: 28,
      cellHeight: 22,
      gutterWidth: 64,
      font: '12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    }
  }

  const cfg = merge(defaults, opts)
  if (typeof cfg.parent === 'string') {
    const el = document.querySelector(cfg.parent)
    if (el) cfg.parent = el
  }

  const cols = cfg.measures * cfg.beats
  const pitches = buildPitchRows(cfg.notes)

  const state = []
  let nextId = 1
  const listeners = { change: new Set() }

  let dragging = false
  let dragRow = null
  let dragStartCol = null
  let hoverCol = null
  let suppressNextPointerUp = false// event system

  const host = document.createElement('div')
  const shadow = host.attachShadow({ mode: 'open' })
  cfg.parent.appendChild(host)

  const styleTag = document.createElement('style')
  styleTag.textContent = `
    .pr-wrap { position: relative; user-select: none; font: var(--pr-font, ${cfg.style.font}); }
    .pr-row-labels {
      position: absolute; inset: 0 auto 0 0; width: var(--pr-gutter-w);
      border-right: 1px solid var(--pr-border); background: #fff; z-index: 3;
    }
    .pr-row-label {
      height: var(--pr-cell-h); display: flex; align-items: center; justify-content: flex-end;
      padding: 0 8px; color: #444; border-bottom: 1px solid var(--pr-border); box-sizing: border-box;
    }
    .pr-canvas { position: absolute; left: var(--pr-gutter-w); right: 0; top: 0; bottom: 0; overflow: scroll }
    .pr-cells { position: absolute; inset: 0; display: grid; z-index: 1; }
    .pr-notes { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
    .pr-cell {
      pointer-events: auto; border-right: 1px solid var(--pr-border); border-bottom: 1px solid var(--pr-border)
    }
    .pr-cell.measureA { background: var(--pr-measure-a) }
    .pr-cell.measureB { background: var(--pr-measure-b) }
    .pr-cell.dragging { outline: 2px solid var(--pr-accent); outline-offset: -2px }
    .pr-note {
      position: absolute; border: 1px solid var(--pr-accent);
      /* color-mix is nice, but in case a browser lacks it, fall back via background + opacity */
      background: color-mix(in srgb, var(--pr-accent) 35%, transparent);
      border-radius: 4px; box-sizing: border-box; height: calc(var(--pr-cell-h) - 2px)
    }
    @supports not (background: color-mix(in srgb, red 50%, white)) {
      .pr-note { background: var(--pr-accent); opacity: .25 }
    }
    .pr-playhead {
      position: absolute; inset: 0 auto 0 0;
      width: 2px; background: var(--pr-accent);
      opacity: .85; transform: translateX(0);
      pointer-events: none; z-index: 4; display: none;
    }
  `
  shadow.appendChild(styleTag)

  const wrap = el('div', 'pr-wrap')
  wrap.style.setProperty('--pr-measure-a', cfg.style.measureA)
  wrap.style.setProperty('--pr-measure-b', cfg.style.measureB)
  wrap.style.setProperty('--pr-accent', cfg.style.accent)
  wrap.style.setProperty('--pr-border', cfg.style.border)
  wrap.style.setProperty('--pr-cell-w', cfg.style.cellWidth + 'px')
  wrap.style.setProperty('--pr-cell-h', cfg.style.cellHeight + 'px')
  wrap.style.setProperty('--pr-gutter-w', cfg.style.gutterWidth + 'px')
  wrap.style.height = `calc(${pitches.length} * var(--pr-cell-h))`
  shadow.appendChild(wrap)

  const labels = el('div', 'pr-row-labels')
  pitches.forEach(p => labels.appendChild(textRow(p)))
  wrap.appendChild(labels)

  const canvas = el('div', 'pr-canvas')
  wrap.appendChild(canvas)

  // IMPORTANT: put cells first (z-index:1), then notes (z-index:2) so notes stay visible
  const cells = el('div', 'pr-cells')
  cells.style.gridTemplateColumns = `repeat(${cols}, var(--pr-cell-w))`
  cells.style.gridTemplateRows = `repeat(${pitches.length}, var(--pr-cell-h))`
  canvas.appendChild(cells)

  const notesLayer = el('div', 'pr-notes')
  canvas.appendChild(notesLayer)
  const playhead = el('div', 'pr-playhead')
  canvas.appendChild(playhead)

  for (let r = 0; r < pitches.length; r++) {
    for (let c = 0; c < cols; c++) {
      const m = Math.floor(c / cfg.beats)
      const cell = el('div', `pr-cell ${m % 2 === 0 ? 'measureA' : 'measureB'}`)
      cell.dataset.row = String(r)
      cell.dataset.col = String(c)
      cell.setAttribute('draggable', 'false')

      cell.addEventListener('pointerdown', e => {
        e.preventDefault()

        // if clicking on an existing note (anywhere it spans), remove it
        const existing = findNoteAt(r, c)
        if (existing) {
          removeNoteById(existing.id)
          suppressNextPointerUp = true
          return // don't start a drag when we just deleted
        }

        cell.setPointerCapture?.(e.pointerId)
        startDrag(r, c)
      })

      cell.addEventListener('pointerup', e => {
        e.preventDefault()

        if (suppressNextPointerUp) {
          suppressNextPointerUp = false
          return
        }

        if (dragging) finishDrag()
        else addOneBeat(r, c)
      })

      cells.appendChild(cell)
    }
  }

  const end = () => {
    if (dragging) finishDrag()
    suppressNextPointerUp = false
  }
  shadow.addEventListener('pointerup', end)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
  window.addEventListener('blur', end)
  shadow.addEventListener('pointermove', pointerMove)

  function findNoteAt (row, col) {
    const pitch = pitches[row]
    // return the first note that covers this cell
    return state.find(n => n.pitch === pitch && col >= n.start && col < (n.start + n.duration))
  }

  function removeNoteById (id) {
    // remove from state
    const i = state.findIndex(n => n.id === id)
    if (i !== -1) state.splice(i, 1)

    // remove the visual block
    const el = notesLayer.querySelector(`.pr-note[data-id="${id}"]`)
    if (el && el.parentNode) el.parentNode.removeChild(el)
    emit('change', { type: 'remove', id })
  }

  function startDrag (row, col) {
    dragging = true
    dragRow = row
    dragStartCol = col
    hoverCol = col
    clearDraggingPreview()
    paintDraggingPreview(row, col, col)
  }

  function finishDrag () {
    const row = dragRow
    const [a, b] = sortCols(dragStartCol, hoverCol)
    const duration = (b - a) + 1
    clearDraggingPreview()
    if (duration > 1) addNote(row, a, duration)
    else addOneBeat(row, a)
    dragging = false
    dragRow = null
    dragStartCol = null
    hoverCol = null
  }

  function colFromClientX (clientX) {
    const rect = cells.getBoundingClientRect()
    // outside grid? bail gracefully
    if (clientX < rect.left) return 0
    if (clientX > rect.right) return cols - 1
    const x = clientX - rect.left
    const w = parseFloat(window.getComputedStyle(wrap).getPropertyValue('--pr-cell-w')) || cfg.style.cellWidth
    let col = Math.floor(x / w)
    if (col < 0) col = 0
    if (col > cols - 1) col = cols - 1
    return col
  }

  function pointerMove (e) {
    if (!dragging) return
    const col = colFromClientX(e.clientX)
    if (col == null) return
    // row is locked to dragRow; only column changes
    if (col !== hoverCol) {
      hoverCol = col
      clearDraggingPreview()
      const [a, b] = sortCols(dragStartCol, hoverCol)
      paintDraggingPreview(dragRow, a, b)
    }
  }

  // ....

  function addOneBeat (row, col) {
    addNote(row, col, 1)
  }

  function addNote (row, startCol, duration) {
    const id = nextId++
    const pitch = pitches[row]
    const note = { id, pitch, start: startCol, duration }
    state.push({ id, pitch, start: startCol, duration })
    drawNoteBlock(row, startCol, duration, id)
    emit('change', { type: 'add', note })
  }

  function drawNoteBlock (row, startCol, duration, id) {
    const x = startCol * cfg.style.cellWidth
    const y = row * cfg.style.cellHeight
    const w = duration * cfg.style.cellWidth
    const h = cfg.style.cellHeight - 2

    const block = el('div', 'pr-note')
    block.dataset.id = String(id)
    block.title = `${pitches[row]} • ${duration} beat${duration > 1 ? 's' : ''}`
    block.style.left = x + 'px'
    block.style.top = (y + 1) + 'px'
    block.style.width = (w - 2) + 'px'
    block.style.height = h + 'px'
    notesLayer.appendChild(block)
  }

  function cellEl (r, c) {
    return cells.querySelector(`.pr-cell[data-row="${r}"][data-col="${c}"]`)
  }

  function paintDraggingPreview (row, startCol, endCol) {
    for (let c = startCol; c <= endCol; c++) {
      const cel = cellEl(row, c)
      if (cel) cel.classList.add('dragging')
    }
  }

  function clearDraggingPreview () {
    shadow.querySelectorAll('.pr-cell.dragging').forEach(el => el.classList.remove('dragging'))
  }

  function sortCols (a, b) { return a <= b ? [a, b] : [b, a] }

  function el (tag, className) {
    const n = document.createElement(tag)
    if (className) n.className = className
    return n
  }

  function textRow (text) {
    const r = el('div', 'pr-row-label')
    r.textContent = text
    return r
  }

  function merge (a, b) {
    const out = { ...a, ...b }
    out.style = { ...a.style, ...(b.style || {}) }
    return out
  }

  function buildPitchRows (notes) {
    if (notes.length === 2) {
      const a = noteToMidi(notes[0])
      const b = noteToMidi(notes[1])
      const step = a <= b ? 1 : -1
      const count = Math.abs(b - a) + 1
      const arr = []
      for (let i = 0; i < count; i++) arr.push(midiToNote(a + i * step))
      return arr.reverse() // higher pitches at top
    } else {
      return [...notes].reverse()
    }
  }

  function noteToMidi (note) {
    const m = /^([A-Ga-g])([#b]?)(\d+)$/.exec(note)
    if (!m) throw new Error('Bad note: ' + note)
    const n = m[1].toUpperCase()
    const acc = m[2]
    const oct = parseInt(m[3], 10)
    const semis = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[n]
    let val = semis
    if (acc === '#') val += 1
    if (acc === 'b') val -= 1
    return 12 * (oct + 1) + val
  }

  function midiToNote (midi) {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const pc = ((midi % 12) + 12) % 12
    const octave = Math.floor(midi / 12) - 1
    return names[pc] + octave
  }

  // event utils .....

  function emit (type, payload) {
    const set = listeners[type]
    if (!set) return
    for (const fn of set) fn(payload)
  }

  function on (type, fn) {
    if (!listeners[type]) listeners[type] = new Set()
    listeners[type].add(fn)
    // return unsubscribe
    return () => off(type, fn)
  }

  function off (type, fn) {
    listeners[type]?.delete(fn)
  }

  // ... play head
  function setPlayheadByCol (col) {
    const x = (Math.max(0, col)) * cfg.style.cellWidth
    playhead.style.transform = `translateX(${x}px)`
  }

  function setPlayheadFromPosition (position, opts = {}) {
    const beatsPerMeasure = opts.beatsPerMeasure || cfg.beats || 4
    if (typeof position !== 'string') return
    const [barsStr = '0', beatsStr = '0', sixStr = '0'] = position.split(':')
    const bars = parseInt(barsStr, 10) || 0
    const beats = parseInt(beatsStr, 10) || 0
    const sixteenth = parseInt(sixStr, 10) || 0
    const colFloat = (bars * beatsPerMeasure) + beats + (sixteenth / 4)
    setPlayheadByCol(colFloat)
  }

  function showPlayhead (show) {
    playhead.style.display = show ? 'block' : 'none'
  }

  // convert current grid state → Tone.js event objects
  function toToneEvents (opts = {}) {
    const beatsPerMeasure = opts.beatsPerMeasure || cfg.beats || 4

    return state.map(n => {
      const bar = Math.floor(n.start / beatsPerMeasure)
      const beat = n.start % beatsPerMeasure
      // time is bars:beats:sixteenths (we align to the beat, so sixteenths = 0)
      const time = `${bar}:${beat}:0`
      // duration as a TransportTime string equal to <n.duration> beats
      // (e.g., 1 beat → '0:1:0', 3 beats → '0:3:0')
      const dur = `0:${n.duration}:0`
      return { time, pitch: n.pitch, dur }
    })
  }

  return {
    host,
    shadow,
    state,
    pitches,
    config: cfg,
    showPlayhead,
    setPlayheadByCol,
    setPlayheadFromPosition,
    toToneEvents,
    on,
    off,
    add: (note, beat, dur = 1) => {
      const row = pitches.indexOf(note)
      addNote(row, beat, dur)
    },
    clear: () => {
      state.length = 0
      notesLayer.innerHTML = ''
      clearDraggingPreview()
      emit('change', { type: 'clear' })
    }
  }
}

// -----------------------------
// -----------------------------

window.viz.createStepSequencer = function (opts = {}) {
  const cfg = {
    pattern: opts.sequence,
    transport: opts.transport || null,
    parent: opts.parent || document.body, // element or selector
    labelWidth: opts.labelWidth || 72,
    gap: opts.gap || 6,
    color: opts.color || '#6c8cff',
    dividerColor: opts.dividerColor || '#d0d3e2',
    dividerWidth: opts.dividerWidth || 2,
    beatsPerBar: opts.beatsPerBar || null // fallback if no transport
  }
  if (typeof cfg.parent === 'string') cfg.parent = document.querySelector(cfg.parent)

  if (cfg.pattern instanceof Array) cfg.labelWidth = 0

  // inject minimal styles once
  if (!document.querySelector('#ss-styles')) {
    const s = document.createElement('style')
    s.id = 'ss-styles'
    s.textContent = `
      .ss-wrap { font: 12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
      .ss-row { display: grid; align-items: center; margin: 4px 0; }
      .ss-label { opacity: .8; text-align: right; padding-right: 8px; }
      .ss-cells { display: grid; gap: var(--ss-gap, 6px); }
      .ss-cell { position: relative; padding: 4px; border-radius: 6px; }
      .ss-cell.is-current { outline: 2px solid ${cfg.color}; outline-offset: 2px; background: ${cfg.color}1e; }
      .ss-cell input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
      .ss-cell input[type="number"] { width: 56px; padding: 4px 6px; }
      .ss-cells { position: relative; } /* needed for clean borders */
      .ss-cell.is-measure-start { border-left: var(--ss-divider-w, 2px) solid var(--ss-divider, #d0d3e2); }
      .ss-cell.is-measure-end   { border-right: var(--ss-divider-w, 2px) solid var(--ss-divider, #d0d3e2); }
    `
    document.head.appendChild(s)
  }

  // normalize to { label -> array }
  const isArray = Array.isArray(cfg.pattern)
  const rows = isArray ? { '': cfg.pattern } : cfg.pattern

  // compute length (assume consistent; otherwise use max)
  const len = Object.values(rows).reduce((m, arr) => Math.max(m, arr.length), 0)

  // build DOM
  const wrap = document.createElement('div')
  wrap.className = 'ss-wrap'
  wrap.style.setProperty('--ss-gap', cfg.gap + 'px')
  wrap.style.setProperty('--ss-divider', cfg.dividerColor)
  wrap.style.setProperty('--ss-divider-w', cfg.dividerWidth + 'px')

  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.rowGap = '6px'
  wrap.appendChild(grid)

  // track cells per column for highlighting
  const colCells = Array.from({ length: len }, () => new Set())
  let lastBeatsPerBar = null

  Object.entries(rows).forEach(([label, arr]) => {
    const row = document.createElement('div')
    row.className = 'ss-row'
    row.style.gridTemplateColumns = `${cfg.labelWidth}px 1fr`

    const lab = document.createElement('div')
    lab.className = 'ss-label'
    lab.textContent = isArray ? '' : label
    row.appendChild(lab)

    const cells = document.createElement('div')
    cells.className = 'ss-cells'
    cells.style.gridTemplateColumns = `repeat(${len}, max-content)`
    row.appendChild(cells)

    // decide once per row: checkboxes only if ALL values are strictly binary (0/1/true/false or empty)
    const allBinary = (arr || []).every(v => v === 0 || v === 1 || v === true || v === false || v == null)
    const useNumberInputs = !allBinary

    for (let i = 0; i < len; i++) {
      const cell = document.createElement('div')
      const bpb = getBeatsPerBar()
      if (i % bpb === 0) cell.classList.add('is-measure-start')
      if ((i + 1) % bpb === 0) cell.classList.add('is-measure-end')

      cell.className = 'ss-cell'
      cell.dataset.col = String(i)

      const raw = arr[i]
      const val = Number.isFinite(raw) ? raw : 0

      if (useNumberInputs) {
        const input = document.createElement('input')
        input.type = 'number'
        input.min = '0'
        input.max = '1'
        input.step = '0.01'
        input.value = String(val)
        input.addEventListener('input', () => {
          const v = Math.max(0, Math.min(1, parseFloat(input.value)))
          input.value = String(Number.isFinite(v) ? v : 0)
          arr[i] = Number.isFinite(v) ? v : 0 // mutate original pattern with a float
        })
        cell.appendChild(input)
      } else {
        const input = document.createElement('input')
        input.type = 'checkbox'
        input.checked = !!Math.round(Number(val) || 0)
        input.addEventListener('change', () => {
          arr[i] = input.checked ? 1 : 0 // mutate original pattern as 0/1
        })
        cell.appendChild(input)
      }

      cells.appendChild(cell)
      colCells[i].add(cell)
    }

    grid.appendChild(row)
  })

  // attach if asked
  if (cfg.parent) cfg.parent.appendChild(wrap)
  lastBeatsPerBar = getBeatsPerBar()
  refreshMeasureDividers()

  // highlight management
  let currentCol = null
  function setCurrentCol (col) {
    // clear previous
    if (currentCol != null && colCells[currentCol]) {
      colCells[currentCol].forEach(el => el.classList.remove('is-current'))
    }
    currentCol = col
    if (currentCol != null && colCells[currentCol]) {
      colCells[currentCol].forEach(el => el.classList.add('is-current'))
    }
  }

  function getBeatsPerBar () {
    if (cfg.transport && cfg.transport.timeSignature != null) {
      const ts = cfg.transport.timeSignature
      return Array.isArray(ts) ? ts[0] : ts
    }
    return cfg.beatsPerBar || 4
  }

  function refreshMeasureDividers () {
    const bpb = getBeatsPerBar()
    for (let c = 0; c < colCells.length; c++) {
      colCells[c].forEach(cell => {
        cell.classList.remove('is-measure-start', 'is-measure-end')
        if (c % bpb === 0) cell.classList.add('is-measure-start')
        if ((c + 1) % bpb === 0) cell.classList.add('is-measure-end')
      })
    }
  }

  function getWrapCols () {
    const bpb = getBeatsPerBar()
    return Math.ceil(len / bpb) * bpb // round pattern length up to full bars
  }

  // public API
  return {
    el: wrap,
    pattern: cfg.pattern, // the same reference you passed; mutated live
    remove: () => wrap.remove(),
    attachTransport (t) { cfg.transport = t },
    update () {
      const bpb = getBeatsPerBar()
      if (lastBeatsPerBar == null || bpb !== lastBeatsPerBar) {
        lastBeatsPerBar = bpb
        refreshMeasureDividers()
      }

      if (!cfg.transport || typeof cfg.transport.position !== 'string' || len === 0) {
        setCurrentCol(null)
        return
      }

      const [barStr = '0', beatStr = '0'] = cfg.transport.position.split(':')
      const bar = parseInt(barStr, 10) || 0
      const beat = parseInt(beatStr, 10) || 0

      const wrapCols = getWrapCols() // e.g. len=6, bpb=4 → 8
      const abs = (bar * bpb) + beat
      const idx = ((abs % wrapCols) + wrapCols) % wrapCols

      // only highlight if that column actually exists in the pattern
      setCurrentCol(idx < len ? idx : null)
    }

  }
}
