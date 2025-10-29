const wave = viz.createWaveform()

const folder = 'https://tonejs.github.io/audio/drum-samples/CR78/'
const drumset = new Tone.Players({
  kick: folder + 'kick.mp3',
  snare: folder + 'snare.mp3',
  hihat: folder + 'hihat.mp3'
}).toDestination()
drumset.connect(wave)

const filePath = 'https://algorithmicmusic.online/audios/more-spell-on-you.wav'
const player = new Tone.Player(filePath).toDestination()
player.connect(wave)

// we'll create our pattern and cuts (as well as our visuals)
// after we click "randomize" for the first time
let seq
let pattern = []
let cuts = []

Tone.Transport.bpm.value = nn.randomInt(90, 300)
Tone.Transport.loop = true
Tone.Transport.timeSignature = 4
Tone.Transport.loopEnd = '2m'

function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start')
    player.stop()
  }
}

function updateBPM () {
  Tone.Transport.bpm.value = this.value
}

function updatePatternAndCuts (bar, beat) {
  // play beat (0 or 1)
  pattern[bar][beat] = nn.randomInt(1)
  // random cut selection
  cuts[bar][beat] = {
    offset: nn.random(0, player.buffer.duration),
    // set duraton to length of a beat
    duration: 60 / Tone.Transport.bpm.value
  }
}

function randomizePattern () {
  // stop and reset
  Tone.Transport.stop()
  toggleBtn.content('start')
  player.stop()
  // loop twice (once for each bar/measure)
  nn.times(2, m => {
    pattern[m] = []
    cuts[m] = []
    // for each measure, loop 4 times to create beats
    nn.times(4, b => updatePatternAndCuts(m, b))
  })
  // choose a random bpm between 90 and 300
  Tone.Transport.bpm.value = nn.randomInt(90, 300)
  // choose a random playback rate between 0.5 and 1.5
  player.playbackRate = nn.random(0.5, 1.5)
  // update UI
  bpmInput.value = Tone.Transport.bpm.value
  if (seq) seq.remove() // remove old sequencer
  seq = viz.createStepSequencer({ // create new one
    sequence: pattern,
    transport: Tone.Transport
  })
}

function play (time) {
  const pos = Tone.Transport.position.split(':').map(Number)
  const bar = pos[0]
  const beat = pos[1]

  const val = pattern[bar][beat]
  const cut = cuts[bar][beat]
  if (val) { // if sequence is checked
    // play back the current "cut"
    player.start(time, cut.offset, cut.duration)
  }

  // backing drum beat; play kick start of every first beat+bar
  if (bar === 0 && beat === 0) drumset.player('kick').start(time)
  // and play hihat on every beat
  drumset.player('hihat').start(time)

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
  .set('value', 0)
  .addTo('body')
  .on('change', updateBPM)
