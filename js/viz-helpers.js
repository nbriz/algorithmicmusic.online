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
  accentColor: 'red', // when key is pressed
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
    accentColor: 'red',
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
