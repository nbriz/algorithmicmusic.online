/*
  In addition to the basic source nodes, Tone.js offers a "higher-level" category of source nodes called Instruments, which are all variations on the "[synth](https://tonejs.github.io/docs/15.0.4/classes/Synth.html)". These instruments combine multiple components—such as oscillators (which generate raw tones), envelopes (which shape a sound’s behavior using an ADSR or amplitude envelope), and filters (which adjust a sound's character)—into an easy-to-use package. Inspired by analog synthesizers, these instruments provide additional methods for shaping a source's timbre and offer a ready-to-play interface that simplifies sound generation while still allowing for extensive customization and flexibility.
*/

const synth = new Tone.Synth().toDestination()

function attack () {
  const freq = 440
  synth.triggerAttack(freq)
}

function release () {
  synth.triggerRelease()
}

const presets = {
  default: Tone.Synth.getDefaults(),
  alienChorus: {
    oscillator: {
      type: 'fatsine4',
      spread: 60,
      count: 10
    },
    envelope: {
      attack: 0.4,
      decay: 0.01,
      sustain: 1,
      attackCurve: 'sine',
      releaseCurve: 'sine',
      release: 0.4
    }
  },
  delicateWindPart: {
    portamento: 0.0,
    oscillator: {
      type: 'square4'
    },
    envelope: {
      attack: 2,
      decay: 1,
      sustain: 0.2,
      release: 2
    }
  },
  dropPulse: {
    oscillator: {
      type: 'pulse',
      width: 0.8
    },
    envelope: {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.2,
      releaseCurve: 'bounce',
      release: 0.4
    }
  },
  lectric: {
    portamento: 0.2,
    oscillator: {
      type: 'sawtooth'
    },
    envelope: {
      attack: 0.03,
      decay: 0.1,
      sustain: 0.2,
      release: 0.02
    }
  },
  marimba: {
    oscillator: {
      partials: [1, 0, 2, 0, 3]
    },
    envelope: {
      attack: 0.001,
      decay: 1.2,
      sustain: 0,
      release: 1.2
    }
  },
  steelPan: {
    oscillator: {
      type: 'fatcustom',
      partials: [0.2, 1, 0, 0.5, 0.1],
      spread: 40,
      count: 3
    },
    envelope: {
      attack: 0.001,
      decay: 1.6,
      sustain: 0,
      release: 1.6
    }
  },
  superSaw: {
    oscillator: {
      type: 'fatsawtooth',
      count: 3,
      spread: 30
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4,
      attackCurve: 'exponential'
    }
  },
  treeTrunk: {
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.1,
      release: 1.2
    }
  }
}

function applyPreset (e) {
  const reset = Tone.Synth.getDefaults()
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
