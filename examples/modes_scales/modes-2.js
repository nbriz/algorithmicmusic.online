function randomMode () {
  let steps = []
  let total = 0

  while (total < 12) {
    let step = (Math.random() < 0.4 || total > 10) ? 1 : 2
    if (total + step <= 12) {
      steps.push(step)
      total += step
    }
  }

  // make sure there's only 7 steps
  while (steps.length !== 7) {
    if (steps.length < 7) steps.push(1)
    else steps.pop() // remove last item
  }

  return steps
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
  const mode = randomMode()
  const scale = createScale(root, mode)
  // update piano UI
  pianoUI.reset()
  scale.forEach(note => pianoUI.attack(note))
  // update output content
  const s = scale.join(', ') + '<br>' + mode.join(', ')
  output.content(s)
}

const pianoUI = viz.createPianoUI({
  labels: true,
  octaves: [4, 6],
  accentColor: '#0576e8'
})

nn.create('br').addTo('body')

const rootNote = nn.create('select')
  .set({ options: ['A4', 'C4', 'E4', 'G#4'] })
  .addTo('body')

const btn = nn.create('button')
  .content('random scale')
  .addTo('body')
  .on('click', updateLabel)

const output = nn.create('pre').addTo('body')

nn.on('load', updateLabel)
