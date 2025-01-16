window.effectPresets = {
  AutoFilter: {
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
  },
  AutoPanner: {
    Square: {
      frequency: '8n',
      type: 'square6',
      depth: 0.8
    },
    Uneven: {
      frequency: 0.6,
      type: 'sine3',
      depth: 1
    }
  },
  AutoWah: {
    Talker: {
      baseFrequency: 140,
      octaves: 4,
      sensitivity: 0,
      Q: 7,
      gain: 5,
      rolloff: -48,
      follower: {
        attack: 0.5,
        release: 0.1
      }
    },
    Yes: {
      baseFrequency: 250,
      octaves: 3.1,
      sensitivity: 0,
      Q: 2,
      gain: 5,
      rolloff: -24,
      follower: {
        attack: 0.3,
        release: 0.1
      }
    }
  },
  BitCrusher: {
    '8bit': {
      bits: 8
    },
    Destroy: {
      bits: 1
    }
  },
  Chebyshev: {
    CoinOperated: {
      order: 108
    },
    Hornsy: {
      order: 50
    },
    Peaker: {
      order: 11
    }
  },
  Chorus: {
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
  },
  Distortion: {
    Clean: {
      distortion: 0.08
    },
    Fried: {
      distortion: -0.08
    },
    Growl: {
      distortion: 1.4
    },
    Saturate: {
      distortion: 0.08,
      wet: 0.3
    },
    Thick: {
      distortion: 0.6
    }
  },
  FeedbackDelay: {
    Counterpoints: {
      delayTime: '8t',
      feedback: 0.2
    },
    DecayDelay: {
      delayTime: '8n',
      feedback: 0.4
    },
    Minimalist: {
      delayTime: '4n',
      feedback: 0.7
    }
  },
  Freeverb: {
    Bigplate: {
      roomSize: 0.9,
      dampening: 2000
    },
    Cave: {
      roomSize: 0.95,
      dampening: 1200
    },
    Glassroom: {
      roomSize: 0.7,
      dampening: 4300
    }
  },
  JCReverb: {
    BounceHall: {
      roomSize: 0.8
    },
    NotNormal: {
      roomSize: 0.5
    }
  },
  Phaser: {
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
  },
  PingPongDelay: {
    RhythmicDelay: {
      delayTime: '8n',
      feedback: 0.6
    },
    SlowSteady: {
      delayTime: '4n',
      feedback: 0.2
    },
    ThickStereo: {
      delayTime: '16t',
      feedback: 0.3
    }
  },
  PitchShift: {
    Chimes: {
      pitch: 2,
      windowSize: 0.04,
      delayTime: 0.03,
      feedback: 0.5
    },
    DownTheWell: {
      pitch: -5,
      windowSize: 0.05,
      delayTime: 0.3,
      feedback: 0.2
    },
    Fifths: {
      pitch: 7,
      windowSize: 0.1,
      delayTime: 0,
      feedback: 0,
      wet: 0.5
    }
  },
  Tremolo: {
    Classic: {
      frequency: 10,
      type: 'sine',
      depth: 0.5,
      spread: 180
    },
    Tremble: {
      frequency: 5,
      type: 'triangle',
      depth: 0.6,
      spread: 0
    }
  },
  Vibrato: {
    Phonograph: {
      frequency: 2.3,
      depth: 0.4,
      type: 'triangle'
    },
    Singer: {
      frequency: 5,
      depth: 0.2,
      type: 'sine'
    }
  }
}
