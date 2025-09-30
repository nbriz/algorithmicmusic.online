// Create a GainNode to control the amplitude this time
const lfo = new Tone.LFO({
  frequency: 9,
  min: 0,
  max: 1
})

const gainNode = new Tone.Gain(0.75)

const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'custom',
  partials: [1, 0, 0.25, 0, 0.125, 0, 0.25, 0, 1]
})

// construct our "audio graph" or "signal chain"
osc.connect(gainNode)
lfo.connect(gainNode.gain) // connect our LFO to the Gain Node's gain
gainNode.toDestination()

// function to update the depth of the effect
// by chaining the gain value
function updateDepth (e) {
  const depth = Number(e.target.value)
  gainNode.set({ gain: depth })
  depthLabel.content(`depth: ${depth.toFixed(2)}`)
}

// function to update the rate of the effect
function updateRate (e) {
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
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 0.75 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateDepth);

const depthLabel = nn.create('label')
  .content('depth: 0.75')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0.01, max: 20, step: 0.1, value: 9 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateRate)

const rateLabel = nn.create('label')
  .content('rate: 9.00')
  .addTo('body')

// visualizations (connecting gainNode not osc)
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
gainNode.connect(wave)
gainNode.connect(spec)
