const synth = new Tone.PolySynth().toDestination()

// we'll create a "loop" for our Transport to control.
// we specify what function our Loop should call (ex: play)
// and how often it should call it (ex: every second)
new Tone.Loop(play, 1).start() // must call start to run
// ...but we won't hear it looping until we start the Transport (below)

function play () {
  // trigger a C4 tone, release it half a second (0.5) later
  synth.triggerAttackRelease('C4', 0.5)
}

function toggleTransport () {
  if (Tone.Transport.state === 'stopped') {
    Tone.getTransport().start()
  } else {
    Tone.getTransport().stop()
  }
}

nn.create('button')
  .content('start / stop')
  .addTo('body')
  .on('click', toggleTransport)
