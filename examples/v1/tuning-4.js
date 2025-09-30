const root = 264 // C4 (change to 440 for an A4)
const keyMap = {
  'q': { num: 0, pressed: false },
  'w': { num: 1, pressed: false },
  'e': { num: 2, pressed: false },
  'r': { num: 3, pressed: false },
  't': { num: 4, pressed: false },
  'y': { num: 5, pressed: false },
  'u': { num: 6, pressed: false },
  'i': { num: 7, pressed: false }
}

const synth = new Tone.PolySynth().toDestination()

const label = nn.create('label').content('frequency:').addTo('body')

// Calculate the frequencies for a "note" in Meantone Temperment
function calcNote (rootFreq, num) {
  const ratios = [
    1,        // Unison (1/1)
    Math.pow(2, 1 / 6), // Meantone Major Second
    5 / 4,    // Meantone Major Third
    4 / 3,    // Perfect Fourth
    3 / 2,    // Perfect Fifth
    5 / 3,    // Major Sixth
    8 / 5,    // Major Seventh (Meantone adjusted)
    2         // Octave (2/1)
  ]
  return rootFreq * ratios[num]
}

function updateLabel (freq) {
  const n = Tone.Frequency(freq).toNote()
  label.content(`frequency: ${freq} -- note: ${n}`)
}

function attack (e) {
  const obj = keyMap[e.key]
  if (obj && !obj.pressed) {
    const pitch = calcNote(root, obj.num)
    synth.triggerAttack(pitch)
    updateLabel(pitch)
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
// events listeners
nn.on('keydown', attack)
nn.on('keyup', release)
