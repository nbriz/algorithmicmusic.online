/*
  The [OmniOscillator](https://tonejs.github.io/docs/15.0.4/classes/OmniOscillator.html) combines the functionality of multiple oscillators by supporting various waveform types (sine, square, triangle, etc.) and synthesis methods (AM, FM, PWM). It’s a versatile all-in-one source for exploring different synthesis techniques, far surpassing the capabilities of a simple oscillator.
*/

const omniOsc = new Tone.OmniOscillator({
  frequency: 440,
  type: 'sine'
}).toDestination()

const presets = {
  default: {
    type: 'sine'
  },
  buzzer: {
    type: 'pwm',
    modulationFrequency: 1.2,
    phase: 120
  },
  aliens: {
    type: 'fatcustom',
    partials: [0.2, 1, 0, 0.5, 0.1],
    spread: 40,
    count: 3
  }
}

function applyPreset (e) {
  const name = e.target.value
  const settings = presets[name]
  if (settings) {
    Object.keys(settings).forEach(key => {
      if (key === 'modulationFrequency') {
        omniOsc[key].value = settings[key]
      } else {
        omniOsc[key] = settings[key]
      }
    })
  }
}

nn.create('button')
  .content('Start')
  .addTo('body')
  .on('click', () => omniOsc.start())

nn.create('button')
  .content('Stop')
  .addTo('body')
  .on('click', () => omniOsc.stop())

const presetNames = Object.keys(presets)
const presetSelect = nn.create('select')
  .set('options', presetNames)
  .addTo('body')
  .on('change', applyPreset)

// Visualization
const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })
omniOsc.connect(wave)
omniOsc.connect(spec)
