Tone.getContext().lookAhead = 0.01 // adjust latency

// our starting frequency
const root = 264 // C4 (change to 440 for an A4)
const wave = viz.createWaveform()

const synth = new Tone.PolySynth()
synth.set({
  oscillator: {
    type: 'sine',
    volume: -10
  }
})

// sgnal chain
synth.toDestination()
synth.connect(wave)


// Calculate the frequencies for a "note" in 12-tone equal temperament
function calcNote (rootFreq, num) {
  const tr2 = Math.pow(2, 1 / 12) // the twelth root of 2
  const freq = rootFreq * Math.pow(tr2, num)
  return freq
}

const keyMap = {
  'q': { num: 0, pressed: false },
  'w': { num: 1, pressed: false },
  'e': { num: 2, pressed: false },
  'r': { num: 3, pressed: false },
  't': { num: 4, pressed: false },
  'y': { num: 5, pressed: false },
  'u': { num: 6, pressed: false },
  'i': { num: 7, pressed: false },
  'o': { num: 8, pressed: false },
  'p': { num: 9, pressed: false },
  '[': { num: 10, pressed: false },
  ']': { num: 11, pressed: false },
  '\\': { num: 12, pressed: false }
}

function attack (e) {
  const obj = keyMap[e.key]
  if (obj && !obj.pressed) {
    // calculate the pitch
    const pitch = calcNote(root, obj.num)
    synth.triggerAttack(pitch)

    // update the label
    const n = nn.frequencyToNote(pitch)
    label.content(`frequency: ${pitch} -- note: ${n}`)

    obj.pressed = true
  }
}

// here we do the inverse of the function above
function release (e) {
  const obj = keyMap[e.key]
  if (obj && obj.pressed) {
    const pitch = calcNote(root, obj.num)
    synth.triggerRelease(pitch)
    obj.pressed = false
  }
}

// UI
const label = nn.create('label').content('frequency:').addTo('body')

nn.on('keydown', attack)
nn.on('keyup', release)
