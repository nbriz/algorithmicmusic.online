/*
  More info can be found on the Tone.js docs for the [FMSynth](https://tonejs.github.io/docs/15.0.4/classes/FMSynth.html)
*/

const synth = new Tone.FMSynth().toDestination()

function attack () {
  const freq = 440
  synth.triggerAttack(freq)
}

function release () {
  synth.triggerRelease()
}

const presets = {
  default: Tone.FMSynth.getDefaults(),
  ElectricCello: {
    harmonicity: 3.01,
    modulationIndex: 14,
    oscillator: {
      type: 'triangle'
    },
    envelope: {
      attack: 0.2,
      decay: 0.3,
      sustain: 0.1,
      release: 1.2
    },
    modulation: {
      type: 'square'
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.5,
      sustain: 0.2,
      release: 0.1
    }
  },
  Kalimba: {
    harmonicity: 8,
    modulationIndex: 2,
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.001,
      decay: 2,
      sustain: 0.1,
      release: 2
    },
    modulation: {
      type: 'square'
    },
    modulationEnvelope: {
      attack: 0.002,
      decay: 0.2,
      sustain: 0,
      release: 0.2
    }
  },
  ThinSaws: {
    harmonicity: 0.5,
    modulationIndex: 1.2,
    oscillator: {
      type: 'fmsawtooth',
      modulationType: 'sine',
      modulationIndex: 20,
      harmonicity: 3
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.1,
      release: 1.2
    },
    modulation: {
      volume: 0,
      type: 'triangle'
    },
    modulationEnvelope: {
      attack: 0.35,
      decay: 0.1,
      sustain: 1,
      release: 0.01
    }
  }
}

function applyPreset (e) {
  const reset = Tone.FMSynth.getDefaults()
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
const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })
synth.connect(wave)
synth.connect(spec)
