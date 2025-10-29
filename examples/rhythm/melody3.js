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
  // selected key (ex: C) + octave (ex: 3) = 'C3'
  const root = keyList.value + 3
  // pattern for a minor scale
  // describes steps between notes starting from the root key
  const minor = [2, 1, 2, 2, 1, 2, 2]
  const scale = nn.createScale(root, minor)
  scaleLabel.content(`scale: ${scale}`)

  const note = nn.random(scale)
  synth.triggerAttackRelease(note, '4n', time)

  // update the piano UI
  pressPianoKey(note, '4n', time)
}

new Tone.Loop(play).start()

// UI

const keyList = nn.create('select')
  .set('options', nn.notes)
  .addTo('body')

const toggleBtn = nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', toggle)

const bpmInput = nn.create('input')
  .set('type', 'number')
  .set('value', Tone.Transport.bpm.value)
  .addTo('body')
  .on('change', updateBPM)

const scaleLabel = nn.create('label')
  .content('notes:')
  .addTo('body')

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [3, 5]
})
