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
      // {
      //   title: 'visualization: svg with d3',
      //   path: 'web-audio/the-basics/wa5.js',
      //   template: ['d3']
      // },
      {
        title: 'Audio Parameters',
        path: 'web-audio/the-basics/wa6.js',
        template: ['body', 'viz']
      },
      {
        title: 'ADSR',
        path: 'web-audio/the-basics/wa7.js',
        template: ['body', 'viz']
      }
    ],
    'Audio Buffers': [
      {
        title: 'Silence',
        path: 'web-audio/audio-buffers/ab0.js',
        template: ['body', 'viz']
      },
      {
        title: 'White Noise',
        path: 'web-audio/audio-buffers/ab1.js',
        template: ['body', 'viz']
      },
      {
        title: 'Brown Noise',
        path: 'web-audio/audio-buffers/ab2.js',
        template: ['body', 'viz']
      },
      {
        title: 'Pink Noise',
        path: 'web-audio/audio-buffers/ab6.js',
        template: ['body', 'viz']
      },
      {
        title: 'Sine Wave',
        path: 'web-audio/audio-buffers/ab3.js',
        template: ['body', 'viz']
      },
      {
        title: 'Square Wave',
        path: 'web-audio/audio-buffers/ab4.js',
        template: ['body', 'viz']
      },
      {
        title: 'Custom Wave',
        path: 'web-audio/audio-buffers/ab5.js',
        template: ['body', 'viz']
      },
      {
        title: 'From File',
        path: 'web-audio/audio-buffers/from-file.js',
        template: ['body', 'nn', 'viz']
      }
    ]
  },
  'Tone.js': {
    Buffers: [
      {
        title: 'algorithmically generated',
        path: 'tone/buffers/raw-buffer.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'loaded from file',
        path: 'tone/buffers/file-buffer.js',
        template: ['body', 'nn', 'tone', 'viz']
      }
    ],
    Oscillators: [
      {
        title: 'Basic Oscillator',
        path: 'tone/oscillators/t0.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Oscillator Parameters',
        path: 'tone/oscillators/t1.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'AMOscillator',
        path: 'tone/oscillators/am-osc.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'FMOscillator',
        path: 'tone/oscillators/fm-osc.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'FatOscillator',
        path: 'tone/oscillators/fat-osc.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'PWMOscillator',
        path: 'tone/oscillators/pwm-osc.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'PulseOscillator',
        path: 'tone/oscillators/pulse-osc.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'OmniOscillator',
        path: 'tone/oscillators/omni-osc.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'AMOscillator (from scratch)',
        path: 'tone/oscillators/am-osc-scratch.js',
        template: ['body', 'nn', 'tone', 'viz']
      }
    ],
    Synths: [
      {
        title: 'Synth',
        path: 'tone/synths/synth.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'AMSynth',
        path: 'tone/synths/am.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'FMSynth',
        path: 'tone/synths/fm.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'MonoSynth',
        path: 'tone/synths/mono.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'NoiseSynth',
        path: 'tone/synths/noise.js',
        template: ['body', 'nn', 'tone', 'viz']
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
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'sampler (basic)',
        path: 'tone/sampling/sampler1.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'sampler (pitch shifting)',
        path: 'tone/sampling/sampler2.js',
        template: ['body', 'nn', 'tone', 'viz']
      }
    ],
    Effects: [
      {
        title: 'Reverb',
        path: 'tone/effects/reverb.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Distortion',
        path: 'tone/effects/distortion.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'AutoFilter',
        path: 'tone/effects/auto-filter.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'AutoPanner',
        path: 'tone/effects/auto-panner.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      // {
      //   title: 'AutoWah',
      //   path: 'tone/effects/auto-wah.js',
      //   template: ['body', 'nn', 'tone', 'viz']
      // }
      {
        title: 'BitCrusher',
        path: 'tone/effects/bitcrusher.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Chebyshev',
        path: 'tone/effects/chebyshev.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Chorus',
        path: 'tone/effects/chorus.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      // {
      //   title: 'JCReverb',
      //   path: 'tone/effects/jc-reverb.js',
      //   template: ['body', 'nn', 'tone', 'viz']
      // },
      {
        title: 'FeedbackDelay',
        path: 'tone/effects/feedback-delay.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'PingPongDelay',
        path: 'tone/effects/ping-pong.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Phaser',
        path: 'tone/effects/phaser.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'PitchShift',
        path: 'tone/effects/pitch-shift.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Vibrato',
        path: 'tone/effects/vibrato.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Tremolo',
        path: 'tone/effects/tremolo.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'Tremolo (from scratch)',
        path: 'tone/effects/tremolo-from-scratch.js',
        template: ['body', 'nn', 'tone', 'viz']
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
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'input',
        path: 'nn.min.js/ui/input.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'checkbox',
        path: 'nn.min.js/ui/checkbox.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'range',
        path: 'nn.min.js/ui/range.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'select',
        path: 'nn.min.js/ui/select.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'upload file',
        path: 'tone/buffers/file-buffer.js',
        template: ['body', 'nn', 'tone', 'viz']
      }
    ],
    mouse: [
      {
        title: 'movement',
        path: 'nn.min.js/mouse/movement.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'down up',
        path: 'nn.min.js/mouse/down-up.js',
        template: ['body', 'nn', 'tone', 'viz']
      }
    ],
    keyboard: [
      {
        title: 'keydown event',
        path: 'nn.min.js/keyboard/keydown.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'key event object',
        path: 'nn.min.js/keyboard/event-obj.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'keyup event',
        path: 'nn.min.js/keyboard/keyup.js',
        template: ['body', 'nn', 'tone', 'viz']
      },
      {
        title: 'key map object',
        path: 'nn.min.js/keyboard/key-map.js',
        template: ['body', 'nn', 'tone', 'viz']
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
        template: ['body', 'nn', 'tone', 'viz']
      }
    ],
    camera: [
      {
        title: 'accessing stream',
        path: 'nn.min.js/camera/basic.js',
        template: ['body', 'nn']
      },
      {
        title: 'processing stream',
        path: 'nn.min.js/camera/process.js',
        template: ['body', 'nn', 'tone']
      }
    ],
    'visuals (basic)': [
      {
        title: 'random background (HTML+CSS)',
        path: 'nn.min.js/visuals/bg-css.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'random elements (HTML+CSS)',
        path: 'nn.min.js/visuals/ran-ele.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'random background (canvas)',
        path: 'nn.min.js/visuals/bg-canvas.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'random circles (circles)',
        path: 'nn.min.js/visuals/circles.js',
        template: ['body', 'nn', 'tone']
      }
    ],
    'visuals (analysis)': [
      {
        title: 'volume meter',
        path: 'nn.min.js/visuals/vol-meter.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'volume + frquency',
        path: 'nn.min.js/visuals/tones.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'waveform',
        path: 'nn.min.js/visuals/wave-form.js',
        template: ['body', 'nn', 'tone']
      },
      {
        title: 'frequency bars',
        path: 'nn.min.js/visuals/freq-bars.js',
        template: ['body', 'nn', 'tone']
      }
    ]
  },
  'tensorflow.js (AI)': {
    'Body Tracking': [
      {
        title: 'hand detection',
        path: 'tensorflow.js/body/hands.js',
        template: ['body', 'nn', 'tone', 'hand']
      },
      {
        title: 'pose detection',
        path: 'tensorflow.js/body/pose.js',
        template: ['body', 'nn', 'tone', 'pose']
      }
    ],
    MusicVAE: [
      {
        title: 'Basic Melody',
        path: 'tensorflow.js/musicVAE/melodies.js',
        template: ['body', 'nn', 'tone', 'viz', 'vae']
      }
    ],
    GANSynth: [
      {
        title: 'random timbre',
        path: 'tensorflow.js/GANSynth/gan-synth.js',
        template: ['body', 'nn', 'tone', 'viz', 'gan']
      },
      {
        title: 'seeded timbre',
        path: 'tensorflow.js/GANSynth/gan-seeded.js',
        template: ['body', 'nn', 'tone', 'viz', 'gan']
      }
    ]
  }
}
