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
