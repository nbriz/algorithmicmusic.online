/*
  A NoiseSynth is created by running a noise buffer (instead of an oscillator) through an Amplitude Envelope (ADSR), for this reason it's attack methods do not require a "frequency" argument, instead the first argument corresponds to the time it should be triggered. More info can be found on the Tone.js docs for the [NoiseSynth](https://tonejs.github.io/docs/15.0.4/classes/NoiseSynth.html)
*/

const synth = new Tone.NoiseSynth().toDestination()

function attack () {
  synth.triggerAttack()
}

function release () {
  synth.triggerRelease()
}

const presets = {
  default: Tone.NoiseSynth.getDefaults(),
  Gravel: {
    noise: {
      type: 'pink',
      playbackRate: 0.1
    },
    envelope: {
      attack: 0.5,
      decay: 2,
      sustain: 0.5,
      release: 3
    }
  },
  Slap: {
    noise: {
      type: 'white',
      playbackRate: 5
    },
    envelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.3
    }
  },
  Swoosh: {
    noise: {
      type: 'white',
      playbackRate: 0.6
    },
    envelope: {
      attackCurve: 'exponential',
      attack: 0.3,
      decay: 0.2,
      sustain: 0,
      release: 0.2
    }
  },
  Train: {
    noise: {
      type: 'pink',
      playbackRate: 0.2
    },
    envelope: {
      attackCurve: 'ripple',
      releaseCurve: 'ripple',
      attack: 1,
      decay: 0.3,
      sustain: 1,
      release: 1
    }
  }
}

function applyPreset (e) {
  const reset = Tone.NoiseSynth.getDefaults()
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
