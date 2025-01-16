/*
  More info can be found on the Tone.js docs for the [AutoFilter](https://tonejs.github.io/docs/15.0.4/classes/AutoFilter.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.AutoFilter().start() // need to call "start"

osc.connect(effect)
effect.toDestination()

const presets = {
  default: Tone.AutoFilter.getDefaults(),
  Evolve: {
    frequency: 1,
    type: 'sine',
    depth: 1,
    baseFrequency: 200,
    octaves: 2.6,
    filter: {
      type: 'lowpass',
      rolloff: -12,
      Q: 1
    }
  },
  RoboLips: {
    frequency: 5,
    type: 'square4',
    depth: 0.4,
    baseFrequency: 150,
    octaves: 3.1,
    filter: {
      type: 'lowpass',
      rolloff: -24,
      Q: 4
    }
  }
}

function applyPreset (e) {
  const reset = Tone.AutoFilter.getDefaults()
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
