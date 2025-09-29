/*

  In this example we use the [D3](https://d3js.org/) library to create an <svg> visualization of our waveform from the fft data.

*/
const ctx = new window.AudioContext()

const osc = ctx.createOscillator()
osc.frequency.value = 440
osc.type = 'square'

const gain = ctx.createGain()
gain.gain.value = 0.5

const fft = ctx.createAnalyser()
fft.fftSize = 2048

osc.connect(gain)
gain.connect(ctx.destination)
gain.connect(fft)

osc.start(ctx.currentTime)
osc.stop(ctx.currentTime + 2)

// Set up the D3.js visualization
let path, line, dataArray

function setup () {
  // create an <svg> element
  const ele = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  ele.setAttribute('width', 700)
  ele.setAttribute('height', 200)
  document.body.appendChild(ele)

  // Use the D3 library to select the newly created SVG element
  const svg = d3.select(ele)
  const width = 700
  const height = 200

  // Set up scales for x and y
  const xScale = d3.scaleLinear()
    .domain([0, fft.fftSize - 1])
    .range([0, width])

  const yScale = d3.scaleLinear()
    .domain([-1, 1])
    .range([height, 0])

  // Append a path element for the waveform
  path = svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#f92672')
    .attr('stroke-width', 2)

  // Create a D3 line generator
  line = d3.line()
    .x((_, i) => xScale(i)) // Map index to x-position
    .y(d => yScale(d)) // Map waveform value to y-position
    .curve(d3.curveCatmullRom) // Smooth curve interpolation

  // Set up a buffer for the waveform data
  dataArray = new Float32Array(fft.fftSize)
}

function loop () {
  // call the loop recursively (12 fps)
  setTimeout(loop, 1000 / 12)

  // Get time-domain waveform data from the AnalyserNode
  fft.getFloatTimeDomainData(dataArray)

  // Update the path with the new waveform data
  path.attr('d', line(dataArray))
}

window.addEventListener('load', setup)
window.addEventListener('load', loop)
