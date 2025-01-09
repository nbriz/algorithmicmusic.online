/* global d3, Tone */
/*

// set it up like this
// --------------------

const spec = createSpectrum()

// or
const spec = createSpectrum({
  ele: '#spectrum-element',
  width: '700px',
  height: '200px',
  background: 'black',
  color: 'white',
  range: [], // frequency range to display
  harmonics: true, // display harmonic overtone markers for 440 Hz
  labels: true, // display the "frequency" and "harmonics" labels
  audioCtx: ctx, // if u prefer to use a non Tone.js context
  binSize: 1024, // fft bin size
  sensativity: 0.08, // higher, more sensitive
  manuallyCallAnimate: false

})

// use it like this
// ------------------

const synth = new Tone.Synth({
  volume: -5,
  oscillator: { type: "square" }
}).toDestination()

synth.connect(spec.node)

nn.create('button')
  .content('play synth')
  .addTo('body')
  .on('click', () => synth.triggerAttackRelease(440, 3))

*/
function createSpectrum (opts) {
  opts = opts || {}
  const ele = typeof opts.ele === 'string'
    ? document.querySelector(opts.ele)
    : document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  if (typeof opts.ele !== 'string') {
    document.body.appendChild(ele)
  } else if (!ele || ele.nodeName.toLowerCase() !== 'svg') {
    console.error('createSpectrum: "ele" expecting reference to <svg> element')
    return
  }

  ele.style.display = 'block'
  ele.style.width = opts.width || '700px'
  ele.style.height = opts.height || '200px'
  ele.style.background = opts.background || 'transparent'

  const harm = opts.harmonics || false
  const labl = opts.labels || false

  const canvasWidth = parseInt(ele.style.width)
  const canvasHeight = parseInt(ele.style.height)

  const margins = { top: 10, right: 10, bottom: 30, left: 20 }
  const plotWidth = canvasWidth - margins.left - margins.right
  const plotHeight = canvasHeight - margins.top - margins.bottom

  const sensativity = opts.sensativity || 0.08
  const binSize = opts.binSize || 1024
  // NOTE: using Tone.js's FFT node wasn't working correctly,
  // kept mappting a 440 Hz tone as 880 Hz
  // after lots of debugging the only thing that seemed to work
  // was to replace it with the Web Audio API fft analyzers
  const audioCtx = opts.audioCtx || Tone.context
  const fftNode = audioCtx.createAnalyser()
  fftNode.fftSize = binSize
  fftNode.smoothingTimeConstant = 0.7
  const frequencyData = new Uint8Array(fftNode.frequencyBinCount)
  const frequencyPerBin = audioCtx.sampleRate / binSize

  const svg = d3.select(ele)
  const xRange = d3.scaleLinear().range([margins.left, plotWidth])
  const yRange = d3.scaleLinear().range([plotHeight + margins.top, margins.top])

  // const halfSR = audioCtx.sampleRate / 2
  // xRange.domain([20, halfSR])
  const range = opts.range || [20, 20000]
  xRange.domain(range)
  yRange.domain([0.0, 1.2])

  const xAxis = d3.axisBottom(xRange)
    .tickSize(3)
    .tickValues([440, 440 * 4, 440 * 8, 440 * 16, 440 * 32])
    .tickFormat(d3.format(',.0f'))

  const yAxis = d3.axisLeft(yRange)
    .tickSize(0)
    .ticks(0)
    .tickValues([1])
    .tickFormat(d3.format('.1f'))

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${yRange(0)})`)
    .call(xAxis)

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margins.left}, 0)`)
    .call(yAxis)

  if (harm) {
    for (let i = 1; i <= 40; i++) {
      const harmFreq = (i + 1) * 440

      svg.append('line')
        .attr('x1', xRange(harmFreq))
        .attr('y1', yRange(0))
        .attr('x2', xRange(harmFreq))
        .attr('y2', yRange(0) + 15)
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', '5,1')
        .style('opacity', 0.8)

      svg.append('text')
        .attr('x', xRange(harmFreq) - 1)
        .attr('y', yRange(0) + 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text(i + 1)
    }
  }

  if (labl) {
    svg.append('text')
      .attr('x', plotWidth - 75)
      .attr('y', yRange(0) + 12)
      .attr('text-anchor', 'begin')
      .style('font-size', '10px')
      .style('background', opts.background)
      .text('Frequency (Hz)')
    if (harm) {
      svg.append('text')
        .attr('x', plotWidth - 80)
        .attr('y', yRange(0) + 25)
        .attr('text-anchor', 'begin')
        .style('font-size', '10px')
        .text('Harmonic Number')
    }
  }

  const line = d3.line()
    .x((_, i) => xRange(i * frequencyPerBin))
    .y((d) => yRange(d / 255))

  const path = svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', opts.color || 'black')
    .attr('stroke-width', 1.0)
    .attr('opacity', 0.8)

  function animate () {
    fftNode.getByteFrequencyData(frequencyData)
    path.attr('d', line(Array.from(frequencyData)))
    window.requestAnimationFrame(animate)
  }

  if (!opts.manuallyCallAnimate) animate()

  const gainNode = audioCtx.createGain ? audioCtx.createGain() : audioCtx.createGainNode()
  gainNode.gain.value = sensativity
  gainNode.connect(fftNode)

  const node = gainNode
  node.ele = ele
  node.svg = svg
  node.animate = animate

  return node
}

window.createSpectrum = createSpectrum
