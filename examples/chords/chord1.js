const wave = viz.createWaveform()

const synth = new Tone.PolySynth()
synth.connect(wave)
synth.toDestination()

let scale
let chord

function highlightScale () {
  // if ther was a previously highlightd scale, remove it
  if (scale) {
    scale.forEach(note => {
      pianoKeys.release(note)
    })
  }
  // highlight the current scale
  const root = keyList.value + 4
  scale = nn.createScale(root, 'major')
  scale.forEach(note => {
    pianoKeys.attack(note, 'pink')
  })
}

function chordOn () {
  // selected key (ex: C) + octave (ex: 4) = 'C4'
  const root = keyList.value + 4
  const major = [2, 2, 1, 2, 2, 2, 1]
  const scale = nn.createScale(root, major)
  // degrees to choose from the scale
  const triad = [1, 3, 5]
  // use triad shape to select notes from scale
  chord = nn.createChord(scale, triad)
  // start playing chord
  synth.triggerAttack(chord)
  // highlight each note of the chord on the piano
  chord.forEach(note => {
    pianoKeys.attack(note)
  })
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

nn.create('label')
  .content(' major ')
  .addTo('body')

nn.create('button')
  .content('play major triad')
  .css('margin-left', 20)
  .addTo('body')
  .on('mousedown', chordOn)
  .on('mouseup', chordOff)

nn.create('br').addTo('body')
nn.create('br').addTo('body')

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [4, 6]
})
