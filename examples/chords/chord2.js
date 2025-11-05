const wave = viz.createWaveform()

const synth = new Tone.PolySynth()
synth.connect(wave)
synth.toDestination()

let chord
let scale

function highlightScale () {
  // if ther was a previously highlightd scale, remove it
  if (scale) {
    scale.forEach(note => {
      pianoKeys.release(note)
    })
  }
  // highlight the current scale
  scale = [
    ...nn.createScale(keyList.value + 3, modeList.value),
    ...nn.createScale(keyList.value + 4, modeList.value)
  ]
  scale.forEach(note => {
    pianoKeys.attack(note, 'pink')
  })
}

function chordOn () {
  // create a scale array two octaves long
  scale = [
    ...nn.createScale(keyList.value + 3, modeList.value),
    ...nn.createScale(keyList.value + 4, modeList.value)
  ]
  chord = nn.createChord(scale, chordShapeList.value)
  // start playing chord
  synth.triggerAttack(chord)
  // highlight each note of the chord on the piano
  chord.forEach(note => {
    pianoKeys.attack(note)
  })
  // update label
  const degs = nn.chords[chordShapeList.value]
  degress.content(`degrees: ${degs}`)
}

function chordOff () {
  // stop playing chord
  synth.triggerRelease(chord)
  // remove highlights from piano
  highlightScale()
}

// UI
nn.create('label')
  .content('scale: ')
  .addTo('body')

const keyList = nn.create('select')
  .set('options', nn.notes)
  .addTo('body')
  .on('change', highlightScale)

const modeList = nn.create('select')
  .set('options', Object.keys(nn.modes))
  .addTo('body')
  .on('change', highlightScale)

nn.create('button')
  .content('play')
  .css('margin-left', 20)
  .addTo('body')
  .on('mousedown', chordOn)
  .on('mouseup', chordOff)

const chordShapeList = nn.create('select')
  .set('options', Object.keys(nn.chords))
  .addTo('body')

const degress = nn.create('label')
  .content('degrees:')
  .addTo('body')


nn.create('br').addTo('body')
nn.create('br').addTo('body')

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [3, 6]
})
