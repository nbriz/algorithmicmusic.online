/*
  In this example we'll use the Web's [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to visualize a waveform using the fft data.
*/
const ctx = new window.AudioContext()

const osc = ctx.createOscillator()
osc.frequency.value = 440
osc.type = 'square'

const gain = ctx.createGain()
gain.gain.value = 0.5

const fft = ctx.createAnalyser()
fft.fftSize = 2048 // set the FFT size for frequency analysis

// Build the audio graph
osc.connect(gain)
gain.connect(ctx.destination)
// Additionally connect our GainNode to the AnalyserNode
gain.connect(fft)

osc.start(ctx.currentTime)
osc.stop(ctx.currentTime + 2)

// Let's create a canvas to visualize our data as well as a couple of global variables used for the visualization
let canvas, canvasCtx, bufferLength, dataArray

function setup () {
  canvas = document.createElement('canvas')
  canvas.width = window.innerWidth - 100
  document.body.appendChild(canvas)
  canvasCtx = canvas.getContext('2d')
  canvasCtx.strokeStyle = '#f92672'
}

function loop () {
  // call loop recursively...
  setTimeout(loop, 1000 / 12) // ...12 frames-per-second
  /*
    TimeDomainData and FrequencyData can be retrieved as bytes or 32-bit floats (more processing, but higher precision). You get this data by creating an array of the appropriate type (Uint8Array or Float32Array) with a length of the FFT's `.frequencyBinCount`, and then using the FFT's `.getByte...` or `.getFloat...` methods for either `.getTimeDomainData()` or `.getFrequencyData()`, passing the array as an argument.
  */
  bufferLength = fft.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)
  fft.getByteTimeDomainData(dataArray)

  // Let's fill the background first
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

  // Now let's draw the `getByteTimeDomainData` copied into the dataArray
  canvasCtx.beginPath()

  const column = canvas.width / bufferLength
  let x = 0
  for (let i = 0; i < bufferLength; i++) {
    //       normalize data       scale to canvas
    const y = (dataArray[i] / 128) * (canvas.height / 2)

    if (i === 0) canvasCtx.moveTo(x, y)
    else canvasCtx.lineTo(x, y)

    x += column
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2)
  canvasCtx.stroke()
}

// run setup and loop functions once the page is ready
window.addEventListener('load', setup)
window.addEventListener('load', loop)
