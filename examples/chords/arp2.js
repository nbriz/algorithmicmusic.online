const wave = viz.createWaveform()

const synth = new Tone.PolySynth()
synth.connect(wave)
synth.toDestination()

let note
let scale

// instead of keeping track  of the step in a variable
// we'll use the transport to keep track of which beat
// we're on, and use that as our "step"
Tone.Transport.bpm.value = 300
Tone.Transport.loop = true
Tone.Transport.timeSignature = 1
Tone.Transport.loopEnd = '1m'

function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start') // change button's text
  }
}

function updateTimeSig () {
  // make sure there are always as many beats as their are degress
  // in the currently selected chord shape (1 beat per note)
  const shape = chordShapeList.value
  const degress = nn.chords[shape]
  Tone.Transport.timeSignature = degress.length
  Tone.Transport.loopEnd = '1m'
}

function highlightKeys () {
  // if ther was a previously highlightd scale, remove it
  pianoKeys.reset()
  // highlight the current scale in pink
  scale.forEach(note => {
    pianoKeys.attack(note, 'pink')
  })
  // then highlight the current note (in default 'blue' color)
  pianoKeys.attack(note)
}

function play (time) {
  // get the current beat/bar
  const pos = Tone.Transport.position.split(':').map(Number)
  const bar = pos[0]
  const beat = pos[1]
  // create a scale array two octaves long
  scale = [
    ...nn.createScale(keyList.value + 3, modeList.value),
    ...nn.createScale(keyList.value + 4, modeList.value)
  ]
  // create chord shape
  chord = nn.createChord(scale, chordShapeList.value)
  // arpeggiate (ie. play next note in the chord)
  note = chord[beat]
  synth.triggerAttackRelease(note, '4n', time)
  // update piano UI
  highlightKeys()
}

new Tone.Loop(play).start()

// UI
nn.create('label')
  .content('scale: ')
  .addTo('body')

const keyList = nn.create('select')
  .set('options', nn.notes)
  .addTo('body')
  .on('change', highlightKeys)

const modeList = nn.create('select')
  .set('options', Object.keys(nn.modes))
  .addTo('body')
  .on('change', highlightKeys)

nn.create('button')
  .content('start')
  .css('margin-left', 20)
  .addTo('body')
  .on('click', toggle)

const chordShapeList = nn.create('select')
  .set('options', Object.keys(nn.chords))
  .addTo('body')
  .on('change', updateTimeSig)

nn.create('br').addTo('body')
nn.create('br').addTo('body')

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [3, 6]
})
