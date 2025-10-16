const synth = new Tone.PolySynth().toDestination()

const keyMap = {
  q: { freq: 440.00, pressed: false },
  w: { freq: 493.88, pressed: false },
  e: { freq: 523.25, pressed: false },
  r: { freq: 587.33, pressed: false },
  t: { freq: 659.26, pressed: false },
  y: { freq: 698.46, pressed: false },
  u: { freq: 783.99, pressed: false },
  i: { freq: 880, pressed: false }
}

function attack (e) {
  const obj = keyMap[e.key]
  if (obj && !obj.pressed) {
    synth.triggerAttack(obj.freq)
    obj.pressed = true
  }
}

function release (e) {
  const obj = keyMap[e.key]
  if (obj && obj.pressed) {
    synth.triggerRelease(obj.freq)
    obj.pressed = false
  }
}

// events listeners
nn.on('keydown', attack)
nn.on('keyup', release)

nn.create('label')
  .content('use the "q" through "i" keys to play the synth')
  .addTo('body')

// visualizations
const wave = viz.createWaveform()
synth.connect(wave)
