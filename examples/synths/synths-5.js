const synth = new Tone.PolySynth().toDestination()

const keyMap = {
  q: { note: 'A4', pressed: false },
  w: { note: 'B4', pressed: false },
  e: { note: 'C#5', pressed: false },
  r: { note: 'D5', pressed: false },
  t: { note: 'E5', pressed: false },
  y: { note: 'F#5', pressed: false },
  u: { note: 'G#5', pressed: false },
  i: { note: 'A5', pressed: false }
}

function attack (e) {
  const obj = keyMap[e.key]
  if (obj && !obj.pressed) {
    synth.triggerAttack(obj.note)
    obj.pressed = true
  }
}

function release (e) {
  const obj = keyMap[e.key]
  if (obj && obj.pressed) {
    synth.triggerRelease(obj.note)
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
