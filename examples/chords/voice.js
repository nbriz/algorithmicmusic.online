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
    ...nn.createScale(keyList.value + 4, modeList.value),
    ...nn.createScale(keyList.value + 5, modeList.value)
  ]
  scale.forEach(note => {
    pianoKeys.attack(note, 'pink')
  })
}

function chordOn () {
  // create a scale without octave numbers
  scale = nn.createScale(keyList.value, modeList.value)
  // then we'll create a seventh chord
  chord = nn.createChord(scale, 'seventh')

  // experiment with the chord voicing
  if (remixVoicing.checked) {
    // shuffle the order of the notes
    chord = nn.shuffle(chord)
    // duplicate the first note, add it to the end
    chord.push(chord[0])
    // now voice it (ie. addd octave numbers)
    chord = nn.voiceChord(chord, 3)
  } else { // normal voicing (starting from 3rd octave)
    chord = nn.voiceChord(chord, 3)
  }

  // start playing chord
  synth.triggerAttack(chord)
  // highlight each note of the chord on the piano
  chord.forEach(note => pianoKeys.attack(note))
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
  .content('play seventh chord')
  .css('margin-left', 20)
  .addTo('body')
  .on('mousedown', chordOn)
  .on('mouseup', chordOff)

const remixVoicing = nn.create('input')
  .set('type', 'checkbox')
  .addTo('body')

nn.create('label')
  .content('remix voicing')
  .addTo('body')

nn.create('br').addTo('body')
nn.create('br').addTo('body')

const pianoKeys = viz.createPianoUI({
  labels: true,
  octaves: [3, 6]
})
