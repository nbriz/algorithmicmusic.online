const wave = createWaveform()
const synth = new Tone.PolySynth().toDestination()
synth.set({ oscillator: { type: 'sine', volume: -10 } })
synth.connect(wave)

// while we could borrow the "createScale" function from the previous examples to algorithmically derive a scale before creating chords from it, lets keep this simple and just define two octaves in the C Major scale manually
const scale = [
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5',
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'
]

const chordShapes = {
  rootOnly: [1],
  // basic chords
  powerChord: [1, 5], // popular in rock/punk music
  triad: [1, 3, 5], // used to derive major and minor chords (from their respective scales)

  // seventh chords, to derive major7, minor7, dominant7, dim7
  seventh: [1, 3, 5, 7],

  // extended chords
  ninth: [1, 3, 5, 7, 9], // 9th chords (major9, minor9, dominant9)
  eleventh: [1, 3, 5, 7, 9, 11], // 11th chords
  thirteenth: [1, 3, 5, 7, 9, 11, 13], // 13th chords

  // suspended chords
  sus2: [1, 2, 5], // suspended 2nd
  sus4: [1, 4, 5], // suspended 4th
  dominant7sus4: [1, 4, 5, 7],

  // couple more
  add9: [1, 3, 5, 9],
  sixChord: [1, 3, 5, 6]
}

// this function takes a scale (array of note values) and a shape (array of  integers representing "degrees" in that scale)
function deriveChord (scale, shape) {
  const chord = []
  for (const degree of shape) {
    // Convert degree to array index
    const scaleIndex = (degree - 1) % scale.length
    const note = scale[scaleIndex]
    chord.push(note)
  }
  return chord
}

function playChord () {
  const shapeType = shapeSelection.value
  const shapeArr = chordShapes[shapeType]
  const chord = deriveChord(scale, shapeArr)
  synth.triggerAttackRelease(chord, 1)
  // update piano UI
  chord.forEach(note => pianoUI.attack(note))
  // update output content
  output.content(chord.join(', '))
}

function resetUI () {
  pianoUI.reset()
  output.content('')
}

// UI --------------------------
const pianoUI = createPianoUI({
  labels: true,
  octaves: [4, 6],
  accentColor: '#0576e8'
})

nn.create('br').addTo('body')

const shapeSelection = nn.create('select')
  .set({ options: Object.keys(chordShapes) })
  .on('input', resetUI)
  .addTo('body')

nn.create('button')
  .content('play chord')
  .addTo('body')
  .on('click', playChord)

const output = nn.create('pre').addTo('body')
