nn.create('label').content('press the "a" and "s" keys to play').addTo('body')
const wave = createWaveform()
const synth = new Tone.PolySynth().toDestination()
synth.connect(wave)

function createScale (root, mode) {
  const scale = [root]
  let note = root.slice(0, -1) // ex: 'C' from 'C4'
  let octave = parseInt(root.slice(-1)) // ex: 4 from 'C4'
  const notes = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ]

  for (const step of mode) {
    const noteIndex = notes.indexOf(note)
    const nextNoteIndex = (noteIndex + step) % notes.length
    if (nextNoteIndex < noteIndex) octave += 1
    note = notes[nextNoteIndex]
    scale.push(note + octave)
  }

  return scale
}

// first we'll arbitrarily choose the "ionian" mode to create a "major" scale
const mode = [2, 2, 1, 2, 2, 2, 1]

// then we'll create a scale for our "bass" notes
const bassScale = createScale('C2', mode)

// then we'll create a matching scale for our "lead" notes
const leadScale = createScale('C4', mode)

// we'll use this to keep track of which notes we're playing
const keysPressed = {}
let noteIndex = 0

// lastly, we'll create a similar attack/release functions
// as we did in our other keyboard examples

function attack (e) {
  // if we press 'a', play the bass note
  if (e.key === 'a' && !keysPressed.a) {
    const note = bassScale[noteIndex % bassScale.length]
    noteIndex++
    synth.triggerAttack(note)
    keysPressed.a = note

  } // if we press 's' play "improvised" lead note
  else if (e.key === 's' && !keysPressed.s) {
    const note = nn.random(leadScale)
    synth.triggerAttack(note)
    keysPressed.s = note
  }
}

// here we do the inverse of the function above
function release (e) {
  if (e.key === 'a' && keysPressed.a) {
    synth.triggerRelease(keysPressed.a)
    delete keysPressed.a
  } else if (e.key === 's' && keysPressed.s) {
    synth.triggerRelease(keysPressed.s)
    delete keysPressed.s
  }
}

// register events listeners
nn.on('keydown', attack)
nn.on('keyup', release)
