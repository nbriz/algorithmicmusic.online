let step = 0
let notes = [
  'C4', 'E4', 'G4', // C major (4th octave)
  'C5', 'E5', 'G5' // C major (5th octave)
]

// FUNCTIONS ...........................................................

function play (time) {
  const i = step % notes.length
  const note = notes[i]
  piano.triggerAttackRelease(note, '8n', time)
  step++ // increase step counter by 1
}

// timing events ...................................................
new Tone.Loop(play, '8n').start()
