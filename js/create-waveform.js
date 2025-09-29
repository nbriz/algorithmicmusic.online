/* global Tone */
/*

// set it up like this
// --------------------

const wave = createWaveform()

// or
const wave = createWaveform({
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
function createWaveform (opts) {
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
  svg.style.width = opts.width || '700px'
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

window.createWaveform = createWaveform
