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
  // A4 = 440
  // 4n = quarter note (1 beat)
  synth.triggerAttackRelease('A4', '4n', time)

  // update the piano UI
  pressPianoKey('A4', '4n', time)
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
