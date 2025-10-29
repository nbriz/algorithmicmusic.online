const wave = viz.createWaveform()

const file = 'https://tonejs.github.io/audio/drum-samples/Kit8/hihat.mp3'
const clap = new Tone.Player(file).toDestination()
clap.connect(wave)

Tone.Transport.bpm.value = 120 // we can set our tempo
Tone.Transport.timeSignature = 3 // and change the beat division
Tone.Transport.loop = true // loop the transport
Tone.Transport.loopEnd = '2m' // loop repeats at 2 measures/bars


function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start') // change button's text
  }
}

function updateBPM () {
  Tone.Transport.bpm.value = this.value
}

function play (time) {
  // we can check the current beat with: Tone.Transport.position
  // and we can convert position to an array of numbers like this
  const pos = Tone.Transport.position.split(':').map(Number)
  const bar = pos[0]
  const beat = pos[1]
  // update the label
  beatLabel.content(`measure: ${bar}, beat: ${beat}`)
  // play the clap
  clap.start(time)
}

new Tone.Loop(play).start()

// UI
nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', toggle)

nn.create('input')
  .set('type', 'number')
  .set('value', Tone.Transport.bpm.value)
  .addTo('body')
  .on('change', updateBPM)

nn.create('br').addTo('body')

const beatLabel = nn.create('label')
  .content('measure, beat')
  .addTo('body')
