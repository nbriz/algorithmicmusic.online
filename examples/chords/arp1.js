const wave = viz.createWaveform()

const synth = new Tone.PolySynth()
synth.connect(wave)
synth.toDestination()

let note
let scale
let step = 0

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

function noteOn () {
  // create a scale array two octaves long
  scale = [
    ...nn.createScale(keyList.value + 3, modeList.value),
    ...nn.createScale(keyList.value + 4, modeList.value)
  ]
  chord = nn.createChord(scale, chordShapeList.value)
  // play next note in the chord
  note = chord[step % chord.length]
  synth.triggerAttack(note)
  pianoKeys.attack(note)
  // incremeatn step
  step++
}

function noteOff () {
  // stop playing chord
  synth.triggerRelease(note)
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
  .on('mousedown', noteOn)
  .on('mouseup', noteOff)

const chordShapeList = nn.create('select')
  .set('options', Object.keys(nn.chords))
  .addTo('body')


nn.create('br').addTo('body')
nn.create('br').addTo('body')

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [3, 6]
})
