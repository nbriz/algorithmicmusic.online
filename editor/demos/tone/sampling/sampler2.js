const piano = new Tone.Sampler({
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
  urls: {
    'C4': 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    'A4': 'A4.mp3'
  },
  release: 1
})

piano.toDestination()

nn.create('label')
  .content('use the "q" through "i" keys to play the  sampler')
  .addTo('body')

const keyMap = {
  q: { note: 'C4', pressed: false },
  w: { note: 'D4', pressed: false },
  e: { note: 'E4', pressed: false },
  r: { note: 'F4', pressed: false },
  t: { note: 'G4', pressed: false },
  y: { note: 'A5', pressed: false },
  u: { note: 'B5', pressed: false },
  i: { note: 'C5', pressed: false }
}

function attack (e) {
  const obj = keyMap[e.key]
  if (obj && !obj.pressed) {
    piano.triggerAttack(obj.note)
    obj.pressed = true
  }
}

function release (e) {
  const obj = keyMap[e.key]
  if (obj && obj.pressed) {
    piano.triggerRelease(obj.note)
    obj.pressed = false
  }
}

// events listeners
nn.on('keydown', attack)
nn.on('keyup', release)

// visualizations
const wave = createWaveform()
piano.connect(wave)
