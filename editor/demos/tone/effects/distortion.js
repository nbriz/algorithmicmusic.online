/*
  This is a simple Distortion effect. All effects have a "wet" property, this is a value between 0-1 which dictates how much the effect should apply to the signal, 0 = none, 0.5 = equal parts original signal and effect, 1 = only effect's output. In addition to the "wet" property all other effects have their own specific properties, in the case of the Distortion effect the only special property is "distortion", also a value between 0-1 stipulating the amount of distortion to apply. More info can be found on the Tone.js docs for the [Distortion](https://tonejs.github.io/docs/15.0.4/classes/Distortion.html)

*/

const synth = new Tone.Synth()
const effect = new Tone.Distortion()

synth.connect(effect)
effect.toDestination()

// functions
function updateDistortion (e) {
  const val = e.target.value
  dlabel.content(val)
  effect.set({ distortion: val })
}

function updateMix (e) {
  const val = e.target.value
  mlabel.content(val)
  effect.set({ wet: val })
}

// UI
nn.create('input')
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 0.4 })
  .addTo('body')
  .on('input', updateDistortion)

const dlabel = nn.create('label')
  .content('distortion: 0.4')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 1 })
  .addTo('body')
  .on('input', updateMix)

const mlabel = nn.create('label')
  .content('mix (dry/wet): 1')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('button')
  .content('hold')
  .addTo('body')
  .on('mousedown', () => synth.triggerAttack(440))
  .on('mouseup', () => synth.triggerRelease())

// Visualization
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
