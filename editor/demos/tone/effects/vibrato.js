/*
  More info can be found on the Tone.js docs for the [Vibrato](https://tonejs.github.io/docs/15.0.4/classes/Vibrato.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.Vibrato()

osc.connect(effect)
effect.toDestination()

const presets = {
  default: Tone.Vibrato.getDefaults(),
  Phonograph: {
    frequency: 2.3,
    depth: 0.4,
    type: 'triangle'
  },
  Singer: {
    frequency: 5,
    depth: 0.2,
    type: 'sine'
  }
}

function applyPreset (e) {
  const reset = Tone.Vibrato.getDefaults()
  effect.set(reset)
  const settings = presets[e.target.value]
  effect.set(settings)
}

nn.create('input')
  .set('type', 'checkbox')
  .addTo('body')
  .on('change', (e) => {
    if (e.target.checked) osc.start()
    else osc.stop()
  })

nn.create('label')
  .content('toggle (on/off)')
  .addTo('body')

nn.create('br').addTo('body')

const presetNames = Object.keys(presets)
const presetSelect = nn.create('select')
  .set('options', presetNames)
  .addTo('body')
  .on('change', applyPreset)

nn.create('input')
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 1 })
  .addTo('body')
  .on('input', (e) => {
    mlabel.content(`mix: ${e.target.value}`)
    effect.set({ wet: e.target.value })
  })

const mlabel = nn.create('label')
  .content('mix: 1')
  .addTo('body')

// Visualization
const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
