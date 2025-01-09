/*
  there's a third type of AudioNode besides source-nodes and processing-nodes, it's the only one of it's type, the [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) is essentially your [FFT](https://en.wikipedia.org/wiki/Fast_Fourier_transform), for a good explainer on FFT (and signal processing in general) check out the FFT section in [Seeing Cirlces, Sines and Signals](https://jackschaedler.github.io/circles-sines-signals/dft_introduction.html)

  the AnalyserNode can be used to get 'time-domain' and 'frequency-domain' data from the audio connected to it, this can be used for all kinds of analysis (pitch detection for example) or visualization. Like frequency bar graphs, or (in the case below) wave forms
*/
const ctx = new (window.AudioContext || window.webkitAudioContext)()

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

// let's play our sound for 4 seconds this time
osc.start(ctx.currentTime)
osc.stop(ctx.currentTime + 4)

// here we'll create a looping function to log fft data over time, we'll notice that the numbers change while the sound is playing, when it is not the values level out at 128.
function loop () {
  // call loop recursively...
  setTimeout(loop, 1000) // ...1 frame-per-second
  /*
    TimeDomainData and FrequencyData can be retrieved as bytes or 32-bit floats (more processing, but higher precision). You get this data by creating an array of the appropriate type (Uint8Array or Float32Array) with a length of the FFT's `.frequencyBinCount`, and then using the FFT's `.getByte...` or `.getFloat...` methods for either `.getTimeDomainData()` or `.getFrequencyData()`, passing the array as an argument.
  */
  const bufferLength = fft.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  fft.getByteTimeDomainData(dataArray)

  // open your console to see the values in the fft dataArray
  console.log(dataArray)
}

// run loop functions once the page is ready
window.addEventListener('load', loop)
