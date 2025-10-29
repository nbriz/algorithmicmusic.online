const wave = viz.createWaveform()

const folder = 'https://tonejs.github.io/audio/drum-samples/CR78/'
const drumset = new Tone.Players({
  kick: folder + 'kick.mp3',
  snare: folder + 'snare.mp3',
  hihat: folder + 'hihat.mp3'
}).toDestination()
drumset.connect(wave)

// object with a pattern array for each sequence
let pattern = {
  kick: [[1, 0, 1, 0], [1, 0, 1, 0]],
  snare: [[0, 1, 0, 1], [0, 1, 0, 1]],
  hihat: [[1, 1, 1, 1], [1, 1, 1, 1]]
}

Tone.Transport.bpm.value = 120
Tone.Transport.timeSignature = pattern.kick[0].length
Tone.Transport.loop = true
Tone.Transport.loopEnd = pattern.kick.length + 'm'

function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start')
    beat = 0
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
  // loop through each sequance array in the pattern object
  for (const drum in pattern) {
    // get current beat value
    const val = pattern[drum][bar][beat]
    // play specific part of kit, if val is 1
    if (val) drumset.player(drum).start(time)
  }
  // update sequencer visuals
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

const seq = viz.createStepSequencer({
  sequence: pattern,
  transport: Tone.Transport
})
