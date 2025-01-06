/* global d3, Tone */
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
  binSize: 1024,
  sensativity: 0.08 // higher, more sensative
  lineWidth: 2
})

// use it like this
// ------------------

const synth = new Tone.Synth({
  volume: -5,
  oscillator: { type: "square" }
}).toDestination()

synth.connect(wave.node)

nn.create('button')
  .content('play synth')
  .addTo('body')
  .on('click', () => synth.triggerAttackRelease(440, 3))

*/
function createWaveform (opts) {
  opts = opts || {}
  const ele = typeof opts.ele === 'string'
    ? document.querySelector(opts.ele)
    : document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  if (typeof opts.ele !== 'string') {
    document.body.appendChild(ele)
  } else if (!ele || ele.nodeName.toLowerCase() !== 'svg') {
    console.log(ele, ele.nodeName)
    console.error('createWaveform: "ele" expecting reference to <svg> element')
    return
  }

  ele.style.display = 'block'
  ele.style.width = opts.width || '700px'
  ele.style.height = opts.height || '200px'
  ele.style.background = opts.background || 'transparent'
  const stroke = opts.color || 'black'
  const lineWidth = opts.lineWidth || 2

  const sensativity = opts.sensativity || 0.08
  const binSize = opts.binSize || 1024
  const waveNode = new Tone.Waveform(binSize)

  const svg = d3.select(ele)
  // const width = parseInt(svg.style('width'))
  // const height = parseInt(svg.style('height'))
  const width = ele.clientWidth || 700
  const height = ele.clientHeight || 200

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

  // Create a D3 line generator
  const line = d3.line()
    .x((_, i) => xScale(i)) // Map index to x-position
    .y(d => yScale(d)) // Map waveform value to y-position
    .curve(d3.curveCatmullRom) // Smooth curve interpolation

  function animate () {
    const vals = waveNode.getValue()
    path.attr('d', line(vals))
    window.requestAnimationFrame(animate)
  }

  // const audioCtx = Tone.context
  // const gainNode = audioCtx.createGain ? audioCtx.createGain() : audioCtx.createGainNode()
  // gainNode.gain.value = sensativity
  // gainNode.connect(waveNode)
  const gainNode = new Tone.Gain(sensativity * 2)
  gainNode.connect(waveNode)

  return { node: gainNode, ele, svg, animate }
}

window.createWaveform = createWaveform
