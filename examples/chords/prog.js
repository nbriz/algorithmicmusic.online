const synth = new Tone.PolySynth().toDestination()

let chord
let scale

Tone.Transport.bpm.value = 120
Tone.Transport.loop = true
Tone.Transport.timeSignature = 4
Tone.Transport.loopEnd = '4m'

// chord progression, 1 degree for each measure
// II -> V -> VI -> I
const progression = [2, 5, 6, 1]

function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start') // change button's text
  }
}

function highlightKeys () {
  pianoKeys.reset()
  scale.forEach(n => pianoKeys.attack(n, 'pink'))
  pianoKeys.attack(chord)
}

function play (time) {
  // get the current beat/bar
  const [bar, beat] = Tone.Transport.position.split(':').map(Number)

  // create a scale array three octaves long
  scale = [
    ...nn.createScale(keyList.value + 3, modeList.value),
    ...nn.createScale(keyList.value + 4, modeList.value),
    ...nn.createScale(keyList.value + 5, modeList.value)
  ]

  // only play chord on first beat
  if (beat === 0) {
    // get the degree for this measure
    const deg = progression[bar]
    // rotate scale to next degree (-1 to convert degree to index value)
    const rscale = nn.rotateScale(scale, deg - 1)
    // create chord shape
    chord = nn.createChord(rscale, chordShapeList.value)
    // play the chord
    synth.triggerAttackRelease(chord, '1n', time)
    // update piano UI
    highlightKeys()
  }
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

nn.create('br').addTo('body')
nn.create('br').addTo('body')

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [3, 6]
})
