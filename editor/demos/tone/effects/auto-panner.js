/*
  More info can be found on the Tone.js docs for the [AutoPanner](https://tonejs.github.io/docs/15.0.4/classes/AutoPanner.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.AutoPanner().start() // need to call "start

osc.connect(effect)
effect.toDestination()

const presets = {
  default: {
    wet: 1,
    frequency: 1,
    type: 'sine',
    depth: 1
  },
  Square: {
    frequency: '8n',
    type: 'square6',
    depth: 0.8
  },
  Uneven: {
    frequency: 0.6,
    type: 'sine3',
    depth: 1
  }
}

function applyPreset (e) {
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
    effect.wet.value = Number(e.target.value)
  })

const mlabel = nn.create('label')
  .content('mix: 1')
  .addTo('body')

// Visualization
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
