// a gain node with it's value set to 0.75 to start
const gainNode = new Tone.Gain(0.75)
gainNode.toDestination() // connet it to the destination

const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'custom',
  partials: [1, 0, 0.25, 0, 0.125, 0, 0.25, 0, 1]
})

// connecting osc to gain instead of destination
osc.connect(gainNode)

// when the range slider changes
// we use the current value of the slider to update the gain
function adjustLevel (e) {
  const val = e.target.value
  gainNode.set({ gain: val })
}

function toggle (e) {
  if (e.target.checked) osc.start()
  else osc.stop()
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
  .set({ type: 'range', value: 0.75, min: 0, max: 1, step: 0.01 })
  .addTo('body')
  .on('input', adjustLevel)

nn.create('label')
  .content('volume')
  .addTo('body')

// visualizations (connecting gainNode not osc)
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
gainNode.connect(wave)
gainNode.connect(spec)
