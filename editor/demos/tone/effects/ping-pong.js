/*
  More info can be found on the Tone.js docs for the [FeedbackDelay](https://tonejs.github.io/docs/15.0.4/classes/FeedbackDelay.html)
*/

const synth = new Tone.Synth()
const effect = new Tone.FeedbackDelay()

synth.connect(effect)
effect.toDestination()

const presets = {
  default: Tone.FeedbackDelay.getDefaults(),
  RhythmicDelay: {
    delayTime: '8n',
    feedback: 0.6
  },
  SlowSteady: {
    delayTime: '4n',
    feedback: 0.2
  },
  ThickStereo: {
    delayTime: '16t',
    feedback: 0.3
  }
}

function applyPreset (e) {
  const reset = Tone.FeedbackDelay.getDefaults()
  effect.set(reset)
  const settings = presets[e.target.value]
  effect.set(settings)
}

nn.create('button')
  .content('click to play')
  .addTo('body')
  .on('click', (e) => synth.triggerAttackRelease(440, 0.25))

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
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
