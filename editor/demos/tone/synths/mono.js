/*
  More info can be found on the Tone.js docs for the [MonoSynth](https://tonejs.github.io/docs/15.0.4/classes/MonoSynth.html)
*/

const synth = new Tone.MonoSynth().toDestination()

function attack () {
  const freq = 440
  synth.triggerAttack(freq)
}

function release () {
  synth.triggerRelease()
}

const presets = {
  default: Tone.MonoSynth.getDefaults(),
  Bah: {
    volume: 10,
    oscillator: {
      type: 'sawtooth'
    },
    filter: {
      Q: 2,
      type: 'bandpass',
      rolloff: -24
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.6
    },
    filterEnvelope: {
      attack: 0.02,
      decay: 0.4,
      sustain: 1,
      release: 0.7,
      releaseCurve: 'linear',
      baseFrequency: 20,
      octaves: 5
    }
  },
  BassGuitar: {
    oscillator: {
      type: 'fmsquare5',
      modulationType: 'triangle',
      modulationIndex: 2,
      harmonicity: 0.501
    },
    filter: {
      Q: 1,
      type: 'lowpass',
      rolloff: -24
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.4,
      release: 2
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.8,
      release: 1.5,
      baseFrequency: 50,
      octaves: 4.4
    }
  },
  Bassy: {
    portamento: 0.08,
    oscillator: {
      partials: [2, 1, 3, 2, 0.4]
    },
    filter: {
      Q: 4,
      type: 'lowpass',
      rolloff: -48
    },
    envelope: {
      attack: 0.04,
      decay: 0.06,
      sustain: 0.4,
      release: 1
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.6,
      release: 1.5,
      baseFrequency: 50,
      octaves: 3.4
    }
  },
  BrassCircuit: {
    portamento: 0.01,
    oscillator: {
      type: 'sawtooth'
    },
    filter: {
      Q: 2,
      type: 'lowpass',
      rolloff: -24
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.6,
      release: 0.5
    },
    filterEnvelope: {
      attack: 0.05,
      decay: 0.8,
      sustain: 0.4,
      release: 1.5,
      baseFrequency: 2000,
      octaves: 1.5
    }
  },
  CoolGuy: {
    oscillator: {
      type: 'pwm',
      modulationFrequency: 1
    },
    filter: {
      Q: 6,
      rolloff: -24
    },
    envelope: {
      attack: 0.025,
      decay: 0.3,
      sustain: 0.9,
      release: 2
    },
    filterEnvelope: {
      attack: 0.245,
      decay: 0.131,
      sustain: 0.5,
      release: 2,
      baseFrequency: 20,
      octaves: 7.2,
      exponent: 2
    }
  },
  Pianoetta: {
    oscillator: {
      type: 'square'
    },
    filter: {
      Q: 2,
      type: 'lowpass',
      rolloff: -12
    },
    envelope: {
      attack: 0.005,
      decay: 3,
      sustain: 0,
      release: 0.45
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.32,
      sustain: 0.9,
      release: 3,
      baseFrequency: 700,
      octaves: 2.3
    }
  },
  Pizz: {
    oscillator: {
      type: 'sawtooth'
    },
    filter: {
      Q: 3,
      type: 'highpass',
      rolloff: -12
    },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0,
      release: 0.9
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0,
      release: 0.1,
      baseFrequency: 800,
      octaves: -1.2
    }
  }
}

function applyPreset (e) {
  const reset = Tone.MonoSynth.getDefaults()
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
