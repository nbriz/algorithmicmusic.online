window.synthPresets = {
  Synth: {
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
  },
  AMSynth: {
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
  },
  FMSynth: {
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
  },
  MonoSynth: {
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
  },
  NoiseSynth: {
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
}
