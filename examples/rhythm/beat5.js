const wave = viz.createWaveform()

const folder = 'https://tonejs.github.io/audio/drum-samples/CR78/'
const drumset = new Tone.Players({
  kick: folder + 'kick.mp3',
  snare: folder + 'snare.mp3',
  hihat: folder + 'hihat.mp3'
}).toDestination()
drumset.connect(wave)

let pattern = {
  kick: [[1, 0.2, 0.7, 0.2]],
  snare: [[0.5, 0.8, 0.5, 0.8]],
  hihat: [[0.8, 0.8, 0.8, 0.8]]
}

Tone.Transport.bpm.value = nn.randomInt(90, 300)
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
  }
}

function randomizePattern () {
  // stop and reset
  Tone.Transport.stop()
  toggleBtn.content('start')
  // choose a random bpm between 90 and 300
  Tone.Transport.bpm.value = nn.randomInt(90, 300)
  // create 16 step random pattern
  pattern.kick[0] = nn.times(4, () => nn.random())
  pattern.snare[0] = nn.times(4, () => nn.random())
  pattern.hihat[0] = nn.times(4, () => nn.random())
  // update UI
  bpmInput.value = Tone.Transport.bpm.value
  seq.remove() // remove old sequencer
  seq = viz.createStepSequencer({ // create new one
    sequence: pattern,
    transport: Tone.Transport
  })
}

function updateBPM () {
  Tone.Transport.bpm.value = this.value
}

function play (time) {
  const pos = Tone.Transport.position.split(':').map(Number)
  const bar = pos[0]
  const beat = pos[1]

  for (const drum in pattern) {
    const val = pattern[drum][bar][beat]
    // taking a "chance" (based on probability value)
    const chance = nn.random() < val
    if (chance) drumset.player(drum).start(time)
  }

  seq.update()
}

new Tone.Loop(play).start()

// UI
nn.create('button')
  .content('randomize')
  .addTo('body')
  .on('click', randomizePattern)

const toggleBtn = nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', toggle)

const bpmInput = nn.create('input')
  .set('type', 'number')
  .set('value', Tone.Transport.bpm.value)
  .addTo('body')
  .on('change', updateBPM)

let seq = viz.createStepSequencer({
  sequence: pattern,
  transport: Tone.Transport
})
