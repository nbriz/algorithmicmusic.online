// Create a GainNode to control the amplitude
const gainNode = new Tone.Gain(0.75).toDestination()

// Create the main oscillator (sound source)
const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'sine'
}).connect(gainNode) // connect it to the GainNode

// Create an LFO to modulate the GainNode's "gain" (the level)
const lfo = new Tone.LFO({
  frequency: 9, // Tremolo rate in Hz
  min: 0,       // Minimum gain value
  max: 1        // Maximum gain value
})

// Connect the LFO to the gain node
lfo.connect(gainNode.gain)

// ----------------------------------------
// Function to start/stop and edit settings
// ----------------------------------------
function start () {
  osc.start()
  lfo.start()
}

function stop () {
  osc.stop()
  lfo.stop()
}

function updateDepth (e) {
  const depth = Number(e.target.value)
  gainNode.set({ gain: depth })
  depthLabel.content(`depth: ${depth.toFixed(2)}`)
}

function updateRate (e) {
  const rate = Number(e.target.value)
  lfo.set({ frequency: rate })
  rateLabel.content(`rate: ${rate.toFixed(2)}`)
}

// ----------------------------------------
// UI for control
// ----------------------------------------
nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', start)

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', stop)

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 0.75 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateDepth)

const depthLabel = nn.create('label')
  .content('depth: 0.75')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0.1, max: 20, step: 0.1, value: 9 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateRate)

const rateLabel = nn.create('label')
  .content('rate: 9.00')
  .addTo('body')

// ----------------------------------------
// Visualization
// ----------------------------------------
const waveAM = viz.createWaveform()
const specAM = viz.createSpectrum({ range: [20, 7040] })
gainNode.connect(waveAM)
gainNode.connect(specAM)
