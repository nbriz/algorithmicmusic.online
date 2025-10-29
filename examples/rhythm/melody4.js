const synth = new Tone.PolySynth().toDestination()

const oct = 4 // octave
const measures = 2 // aka bar
const beats = 4 // beats per bar
const melody = [
  // first bar
  [
    { pitch: 'C4', dur: '4n'},
    { pitch: 'D4', dur: '4n'},
    { pitch: 'E4', dur: '4n'},
    { pitch: 'F4', dur: '4n'}
  ],
  // second bar
  [
    { pitch: 'G4', dur: '4n'},
    { pitch: 'A4', dur: '4n'},
    { pitch: 'B4', dur: '4n'},
    { pitch: 'C5', dur: '4n'}
  ]
]

// set Transport details to match above
Tone.Transport.bpm.value = nn.randomInt(90, 240)
Tone.Transport.timeSignature = beats
Tone.Transport.loop = true
Tone.Transport.loopEnd = measures + 'm'

function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start')
  }
}

function play (time) {
  const pos = Tone.Transport.position.split(':').map(Number)
  const bar = pos[0]
  const beat = pos[1]
  // choose next note in the melody
  const note = melody[bar][beat]
  // play the note (unless it's a rest)
  synth.triggerAttackRelease(note.pitch, note.dur, time)
  // update piano roll playhead
  roll.update()
}

new Tone.Loop(play).start()

// UI
const toggleBtn = nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', toggle)

const label = nn.create('label')
  .content('notes:')
  .addTo('body')

// create a piano roll visual
const roll = viz.createPianoRoll({
  transport: Tone.Transport,
  notes: [`C${oct}`, `C${oct + 1}`],
  measures: measures,
  beats: beats
})

// add the hand coded notes to the piano roll
nn.times(measures, m => {
  nn.times(beats, b => {
    const note = melody[m][b]
    const step = (m * beats) + b
    roll.add(note.pitch, step, note.dur)
  })
})
