/*
  More info can be found on the Tone.js docs for the [AutoWah](https://tonejs.github.io/docs/15.0.4/classes/AutoWah.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.AutoWah()

osc.connect(effect)
effect.toDestination()

const presets = {
  default: Tone.AutoWah.getDefaults(),
  Talker: {
    baseFrequency: 140,
    octaves: 4,
    sensitivity: 0,
    Q: 7,
    gain: 5,
    rolloff: -48,
    follower: {
      attack: 0.5,
      release: 0.1
    }
  },
  Yes: {
    baseFrequency: 250,
    octaves: 3.1,
    sensitivity: 0,
    Q: 2,
    gain: 5,
    rolloff: -24,
    follower: {
      attack: 0.3,
      release: 0.1
    }
  }
}

function applyPreset (e) {
  const reset = Tone.AutoWah.getDefaults()
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
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
