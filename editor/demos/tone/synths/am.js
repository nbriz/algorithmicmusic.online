/*
  More info can be found on the Tone.js docs for the [AMSynth](https://tonejs.github.io/docs/15.0.4/classes/AMSynth.html)
*/

const synth = new Tone.AMSynth().toDestination()

function attack () {
  const freq = 440
  synth.triggerAttack(freq)
}

function release () {
  synth.triggerRelease()
}

const presets = {
  default: Tone.AMSynth.getDefaults(),
  Harmonics: {
    harmonicity: 3.999,
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.03,
      decay: 0.3,
      sustain: 0.7,
      release: 0.8
    },
    modulation: {
      volume: 12,
      type: 'square6'
    },
    modulationEnvelope: {
      attack: 2,
      decay: 3,
      sustain: 0.8,
      release: 0.1
    }
  },
  Tiny: {
    harmonicity: 2,
    oscillator: {
      type: 'amsine2',
      modulationType: 'sine',
      harmonicity: 1.01
    },
    envelope: {
      attack: 0.006,
      decay: 4,
      sustain: 0.04,
      release: 1.2
    },
    modulation: {
      volume: 13,
      type: 'amsine2',
      modulationType: 'sine',
      harmonicity: 12
    },
    modulationEnvelope: {
      attack: 0.006,
      decay: 0.2,
      sustain: 0.2,
      release: 0.4
    }
  }
}

function applyPreset (e) {
  const reset = Tone.AMSynth.getDefaults()
  synth.set(reset)
  const settings = presets[e.target.value]
  synth.set(settings)
}

const presetNames = Object.keys(presets)
const presetSelect = nn.create('select')
  .set('options', presetNames)
  .addTo('body')
  .on('change', applyPreset)

nn.create('button')
  .content('hold')
  .addTo('body')
  .on('mousedown', attack)
    .on('mouseup', release)

// Visualization
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
synth.connect(wave)
synth.connect(spec)
