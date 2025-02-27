const synth = new Tone.PolySynth().toDestination()

// here we have three loops, instead of defining named function and passing that name in as the first argument to the Loop, we've passed an "anonymous function" (meaning we've defined the function inside the argument itself). each of these do the same thing, trigger a note (albeit a different note each). The second argument (the timeing interval for the loop) is slightly different from the next, which will cause the loops to go slowly out of Sync, ie "phase" like the Steve Reich example we discussed.

new Tone.Loop((time) => {
  // play C4 note, for half a second (0.5), soon as it's "time"
  synth.triggerAttackRelease('C4', 0.5, time)
}, 1.0).start()

new Tone.Loop((time) => {
  synth.triggerAttackRelease('E4', 0.5, time)
}, 1.01).start()

new Tone.Loop((time) => {
  synth.triggerAttackRelease('G4', 0.5, time)
}, 1.02).start()

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
