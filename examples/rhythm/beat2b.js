const wave = viz.createWaveform()

const file = 'https://tonejs.github.io/audio/drum-samples/Kit8/hihat.mp3'
const clap = new Tone.Player(file).toDestination()
clap.connect(wave)

// here we'll define a sequencer pattern
// each sub-array is a measure/bar
let pattern = [
  // 1st bar, 2nd bar
  [1, 0, 0], [1, 1, 1]
]

Tone.Transport.bpm.value = 120
Tone.Transport.loop = true
// match bar's length
Tone.Transport.timeSignature = pattern[0].length
// match pattern length
Tone.Transport.loopEnd = pattern.length + 'm'


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

function play (time) {
  // extract the current "bar" and "beat" from Tone's "position"
  const pos = Tone.Transport.position.split(':').map(Number)
  const bar = pos[0]
  const beat = pos[1]
  beatLabel.content(`measure: ${bar}, beat: ${beat}`)
  // get current beat value
  const val = pattern[bar][beat]
  // only play the clap if current beat has a "1"
  if (val === 1) clap.start(time)
  // update the visual sequencer
  seq.update()
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
// create sequencer visual controls
const seq = viz.createStepSequencer({
  sequence: pattern,
  transport: Tone.Transport
})
