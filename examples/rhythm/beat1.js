const wave = viz.createWaveform()

const file = 'https://tonejs.github.io/audio/drum-samples/Kit8/hihat.mp3'
const clap = new Tone.Player(file).toDestination()
clap.connect(wave)

// the default tempo (in "beats per minute")
Tone.Transport.bpm.value = 120

// function to start/stop the Transport
function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
  } else {
    Tone.Transport.stop()
  }
}

// function to update the Transport's tempo
function updateBPM () {
  Tone.Transport.bpm.value = this.value
}

// function to play the clap "on time"
function play (time) {
  clap.start(time)
}

// we run "play" on a loop, every beat
new Tone.Loop(play).start()

// UI to toggle playback and change BPM
nn.create('input')
  .set('type', 'checkbox')
  .addTo('body')
  .on('change', toggle)

nn.create('input')
  .set('type', 'number')
  .set('value', Tone.Transport.bpm.value)
  .addTo('body')
  .on('change', updateBPM)
