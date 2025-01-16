/*
  More info can be found on the Tone.js docs for the [Phaser](https://tonejs.github.io/docs/15.0.4/classes/Phaser.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.Phaser()

osc.connect(effect)
effect.toDestination()

const presets = {
  default: Tone.Phaser.getDefaults(),
  Bubbles: {
    frequency: 0.5,
    octaves: 3.3,
    Q: 8,
    baseFrequency: 250
  },
  Jetsons: {
    frequency: 12,
    octaves: 3.3,
    Q: 8,
    baseFrequency: 250
  },
  Landing: {
    frequency: 4,
    octaves: 0.4,
    Q: 20,
    baseFrequency: 800
  },
  Testing: {
    frequency: 10,
    octaves: 0.2,
    Q: 2,
    baseFrequency: 700
  }
}

function applyPreset (e) {
  const reset = Tone.Phaser.getDefaults()
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
