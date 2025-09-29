window.data = {
  'Web Audio API': {
    'the basics': [
      {
        title: 'Audio Context',
        path: 'web-audio/the-basics/wa0.js',
        template: []
      },
      {
        title: 'Audio Source Nodes',
        path: 'web-audio/the-basics/wa1.js',
        template: []
      },
      {
        title: 'Audio Processing Nodes',
        path: 'web-audio/the-basics/wa2.js',
        template: []
      },
      {
        title: 'Audio Analyser Node',
        path: 'web-audio/the-basics/wa3.js',
        template: []
      },
      {
        title: 'visualization: canvas',
        path: 'web-audio/the-basics/wa4.js',
        template: []
      },
      {
        title: 'visualization: svg with d3',
        path: 'web-audio/the-basics/wa5.js',
        template: ['d3']
      },
      {
        title: 'Audio Parameters',
        path: 'web-audio/the-basics/wa6.js',
        template: ['body', 'wave']
      },
      {
        title: 'ADSR',
        path: 'web-audio/the-basics/wa7.js',
        template: ['body', 'wave']
      }
    ],
    'Audio Buffers': [
      {
        title: 'Silence',
        path: 'web-audio/audio-buffers/ab0.js',
        template: ['body', 'wave', 'spec']
      },
      {
        title: 'White Noise',
        path: 'web-audio/audio-buffers/ab1.js',
        template: ['body', 'wave', 'spec']
      },
      {
        title: 'Brown Noise',
        path: 'web-audio/audio-buffers/ab2.js',
        template: ['body', 'wave', 'spec']
      },
      {
        title: 'Pink Noise',
        path: 'web-audio/audio-buffers/ab6.js',
        template: ['body', 'wave', 'spec']
      },
      {
        title: 'Sine Wave',
        path: 'web-audio/audio-buffers/ab3.js',
        template: ['body', 'wave', 'spec']
      },
      {
        title: 'Square Wave',
        path: 'web-audio/audio-buffers/ab4.js',
        template: ['body', 'wave', 'spec']
      },
      {
        title: 'Custom Wave',
        path: 'web-audio/audio-buffers/ab5.js',
        template: ['body', 'wave', 'spec']
      },
      {
        title: 'From File',
        path: 'web-audio/audio-buffers/from-file.js',
        template: ['body', 'nn', 'wave', 'spec']
      }
    ]
  },
  'Tone.js': {
    Buffers: [
      {
        title: 'algorithmically generated',
        path: 'tone/buffers/raw-buffer.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'loaded from file',
        path: 'tone/buffers/file-buffer.js',
        template: ['body', 'nn', 'tone', 'wave']
      }
    ],
    Oscillators: [
      {
        title: 'Basic Oscillator',
        path: 'tone/oscillators/t0.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Oscillator Parameters',
        path: 'tone/oscillators/t1.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'AMOscillator',
        path: 'tone/oscillators/am-osc.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'FMOscillator',
        path: 'tone/oscillators/fm-osc.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'FatOscillator',
        path: 'tone/oscillators/fat-osc.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'PWMOscillator',
        path: 'tone/oscillators/pwm-osc.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'PulseOscillator',
        path: 'tone/oscillators/pulse-osc.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'OmniOscillator',
        path: 'tone/oscillators/omni-osc.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'AMOscillator (from scratch)',
        path: 'tone/oscillators/am-osc-scratch.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      }
    ],
    Synths: [
      {
        title: 'Synth',
        path: 'tone/synths/synth.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'AMSynth',
        path: 'tone/synths/am.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'FMSynth',
        path: 'tone/synths/fm.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'MonoSynth',
        path: 'tone/synths/mono.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'NoiseSynth',
        path: 'tone/synths/noise.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      }
    ],
    Sampling: [
      {
        title: 'player (basic)',
        path: 'tone/sampling/player1.js',
        template: ['body', 'nn', 'tone', 'spec']
      },
      {
        title: 'player (timecodes)',
        path: 'tone/sampling/player2.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'sampler (basic)',
        path: 'tone/sampling/sampler1.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'sampler (pitch shifting)',
        path: 'tone/sampling/sampler2.js',
        template: ['body', 'nn', 'tone', 'wave']
      }
    ],
    Effects: [
      {
        title: 'Reverb',
        path: 'tone/effects/reverb.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Distortion',
        path: 'tone/effects/distortion.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'AutoFilter',
        path: 'tone/effects/auto-filter.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'AutoPanner',
        path: 'tone/effects/auto-panner.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      // {
      //   title: 'AutoWah',
      //   path: 'tone/effects/auto-wah.js',
      //   template: ['body', 'nn', 'tone', 'wave', 'spec']
      // }
      {
        title: 'BitCrusher',
        path: 'tone/effects/bitcrusher.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Chebyshev',
        path: 'tone/effects/chebyshev.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Chorus',
        path: 'tone/effects/chorus.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      // {
      //   title: 'JCReverb',
      //   path: 'tone/effects/jc-reverb.js',
      //   template: ['body', 'nn', 'tone', 'wave', 'spec']
      // },
      {
        title: 'FeedbackDelay',
        path: 'tone/effects/feedback-delay.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'PingPongDelay',
        path: 'tone/effects/ping-pong.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Phaser',
        path: 'tone/effects/phaser.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'PitchShift',
        path: 'tone/effects/pitch-shift.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Vibrato',
        path: 'tone/effects/vibrato.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Tremolo',
        path: 'tone/effects/tremolo.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      },
      {
        title: 'Tremolo (from scratch)',
        path: 'tone/effects/tremolo-from-scratch.js',
        template: ['body', 'nn', 'tone', 'wave', 'spec']
      }
    ],
    Transport: [
      {
        title: 'Loop (basic)',
        path: 'tone/transport/loop-basic.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'Loop (phasing)',
        path: 'tone/transport/loop-phasing.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'Loop (kick drum)',
        path: 'tone/transport/loop-kick.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'Loop (drum beat)',
        path: 'tone/transport/loop-drum-beat.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'Loop (randomized drum beat)',
        path: 'tone/transport/loop-random-beat.js',
        template: ['body', 'nn', 'tone']
      }
    ]
  },
  'nn.min.js': {
    'GUI (graphical user interface)': [
      {
        title: 'button',
        path: 'nn.min.js/ui/button.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'input',
        path: 'nn.min.js/ui/input.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'checkbox',
        path: 'nn.min.js/ui/checkbox.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'range',
        path: 'nn.min.js/ui/range.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'select',
        path: 'nn.min.js/ui/select.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'upload file',
        path: 'tone/buffers/file-buffer.js',
        template: ['body', 'nn', 'tone', 'wave']
      }
    ],
    mouse: [
      {
        title: 'movement',
        path: 'nn.min.js/mouse/movement.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'down up',
        path: 'nn.min.js/mouse/down-up.js',
        template: ['body', 'nn', 'tone', 'wave']
      }
    ],
    keyboard: [
      {
        title: 'keydown event',
        path: 'nn.min.js/keyboard/keydown.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'key event object',
        path: 'nn.min.js/keyboard/event-obj.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'keyup event',
        path: 'nn.min.js/keyboard/keyup.js',
        template: ['body', 'nn', 'tone', 'wave']
      },
      {
        title: 'key map object',
        path: 'nn.min.js/keyboard/key-map.js',
        template: ['body', 'nn', 'tone', 'wave']
      }
    ],
    MIDI: [
      {
        title: 'MIDI data',
        path: 'nn.min.js/midi/data.js',
        template: ['body', 'nn']
      },
      {
        title: 'Controlling Effects',
        path: 'nn.min.js/midi/effects.js',
        template: ['body', 'nn', 'tone', 'wave']
      }
    ],
    camera: [
      {
        title: 'accessing stream',
        path: 'nn.min.js/camera/basic.js',
        template: ['body', 'nn']
      },
      {
        title: 'pose detection (AI)',
        path: 'nn.min.js/camera/ai.js',
        template: ['body', 'nn', 'tone', 'pose']
      }
    ]
  }
}
