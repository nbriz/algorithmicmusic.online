/*
  More info can be found on the Tone.js docs for the [PitchShift](https://tonejs.github.io/docs/15.0.4/classes/PitchShift.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.PitchShift()

osc.connect(effect)
effect.toDestination()

const presets = {
  default: Tone.PitchShift.getDefaults(),
  Chimes: {
    pitch: 2,
    windowSize: 0.04,
    delayTime: 0.03,
    feedback: 0.5
  },
  DownTheWell: {
    pitch: -5,
    windowSize: 0.05,
    delayTime: 0.3,
    feedback: 0.2
  },
  Fifths: {
    pitch: 7,
    windowSize: 0.1,
    delayTime: 0,
    feedback: 0,
    wet: 0.5
  }
}

function applyPreset (e) {
  const reset = Tone.PitchShift.getDefaults()
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
