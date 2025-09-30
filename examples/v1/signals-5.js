// Create an LFO to modulate the value of another node's property
const lfo = new Tone.LFO({
  frequency: 2, // modulation rate in Hz
  min: -50,     // minimum deviation (below 440 Hz)
  max: 50       // maximum deviation (above 440 Hz)
})

const gainNode = new Tone.Gain(0.75)

const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'custom',
  partials: [1, 0, 0.25, 0, 0.125, 0, 0.25, 0, 1]
})

// construct our "audio graph" or "signal chain"
osc.connect(gainNode)
lfo.connect(osc.frequency) // connect our LFO to the osc's frequency
gainNode.toDestination()

// when the range slider changes
// we use the current value of the slider to adjust the LFO's frequency
function adjustRate (e) {
  const rate = Number(e.target.value)
  lfo.set({ frequency: rate })
  rateLabel.content(`rate: ${rate.toFixed(2)}`)
}

function toggle (e) {
  if (e.target.checked) {
    lfo.start() // start the LFO as well
    osc.start()
  } else {
    lfo.stop() // stop the LFO as well
    osc.stop()
  }
}

// UI
nn.create('input')
  .addTo('body')
  .set({ type: 'checkbox' })
  .on('change', toggle)

nn.create('label')
  .content('toggle start/stop')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', value: 2, min: 0.01, max: 10, step: 0.1 })
  .addTo('body')
  .on('input', adjustRate)

const rateLabel = nn.create('label')
  .content('rate: 2')
  .addTo('body')

// visualizations (connecting gainNode not osc)
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
gainNode.connect(wave)
gainNode.connect(spec)
