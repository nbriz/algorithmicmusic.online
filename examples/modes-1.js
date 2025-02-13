const modes = {
  ionian: [2, 2, 1, 2, 2, 2, 1], // major
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  aeolian: [2, 1, 2, 2, 1, 2, 2], // minor
  locrian: [1, 2, 2, 1, 2, 2, 2]
}

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

// ----- UI ----------------
// -------------------------
function updateLabel () {
  const root = rootNote.value
  const mode = modes[greekMode.value]
  const scale = createScale(root, mode)
  // update piano UI
  pianoUI.reset()
  scale.forEach(note => pianoUI.attack(note))
  // update output content
  output.content(scale.join(', '))
}

const pianoUI = createPianoUI({
  labels: true,
  octaves: [4, 6],
  accentColor: '#0576e8'
})

nn.create('br').addTo('body')

const rootNote = nn.create('select')
  .set({ options: ['A4', 'C4', 'E4', 'G#4'] })
  .addTo('body')
  .on('input', updateLabel)

const greekMode = nn.create('select')
  .set({ options: Object.keys(modes) })
  .addTo('body')
  .on('input', updateLabel)

const output = nn.create('pre').addTo('body')
