const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })

const osc = new Tone.Oscillator(440)
const gain = new Tone.Gain(0.75)
// our graph
osc.connect(gain)
gain.toDestination()
gain.connect(wave)
gain.connect(spec)
/*
  osc --> gain --> 🔈 (destination)
             `---> 🖥️ (wave/spec)
*/

function toggle () {
  // "this" is the checkbox
  if (this.checked) osc.start()
  else osc.stop()
}

function adjustLevel () {
  // "this" is the range-slider
  gain.set({ gain: this.value })
}

// UI
nn.create('input')
  .addTo('body')
  .set({ type: 'checkbox' })
  .on('change', toggle)

nn.create('label')
  .content('toggle start/stop')
  .addTo('body')

nn.create('br').addTo('body') // line break

nn.create('input')
  .set({
    type: 'range',
    value: 0.75, // match initial gain value
    min: 0,
    max: 1,
    step: 0.01
  })
  .addTo('body')
  .on('input', adjustLevel)
