/*
  More info can be found on the Tone.js docs for the [Chorus](https://tonejs.github.io/docs/15.0.4/classes/Chorus.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.Chorus().start() // need to call "start"

osc.connect(effect)
effect.toDestination()

const presets = {
  default: Tone.Chorus.getDefaults(),
  Ether: {
    frequency: 0.3,
    delayTime: 8,
    type: 'triangle',
    depth: 0.8,
    feedback: 0.4,
    spread: 180
  },
  Harmony: {
    frequency: 12,
    delayTime: 3.5,
    type: 'sine2',
    depth: 0.8,
    feedback: 0.1,
    spread: 180
  },
  Rattler: {
    frequency: '16n',
    delayTime: 15,
    type: 'square',
    depth: 0.2,
    feedback: 0.3,
    spread: 80
  },
  Thirds: {
    frequency: 4,
    delayTime: 16,
    type: 'triangle',
    depth: 1,
    feedback: 0.1,
    spread: 80
  },
  TinCan: {
    frequency: 0.2,
    delayTime: 20,
    type: 'sine',
    depth: 1,
    feedback: 0.45,
    spread: 180
  }
}

function applyPreset (e) {
  const reset = Tone.Chorus.getDefaults()
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
