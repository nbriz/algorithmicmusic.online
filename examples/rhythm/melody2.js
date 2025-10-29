const synth = new Tone.PolySynth().toDestination()

Tone.Transport.bpm.value = 120

function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start')
  }
}

function updateBPM () {
  Tone.Transport.bpm.value = this.value
}

function pressPianoKey (note, dur, time) {
  const delay = time + Tone.Time(dur).toSeconds()
  Tone.Draw.schedule(() => pianoKeys.attack(note), time)
  Tone.Draw.schedule(() => pianoKeys.release(note), delay)
}

function play (time) {
  // we'll choose a random note
  // by combining a random note and octave
  const key = nn.random(nn.notes)
  const oct = nn.randomInt(3, 4)
  const note = key + oct

  // we'll choose a random duration
  const durations = [
    '1n',   // whole note
    '2n',   // half note
    '4n',   // quarter note
    '8n',   // eighth note
    '16n',  // sixteenth note
    '32n',  // thirty-second note
    '64n'   // sixty-fourth note
  ]
  const dur = nn.random(durations)

  synth.triggerAttackRelease(note, dur, time)

  // update the piano UI
  pressPianoKey(note, dur, time)
}

new Tone.Loop(play).start()

// UI
const toggleBtn = nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', toggle)

const bpmInput = nn.create('input')
  .set('type', 'number')
  .set('value', Tone.Transport.bpm.value)
  .addTo('body')
  .on('change', updateBPM)

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [3, 5]
})
