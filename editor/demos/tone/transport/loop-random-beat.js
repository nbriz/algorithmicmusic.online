const drumset = new Tone.Players({
  kick: 'https://tonejs.github.io/audio/drum-samples/Kit8/kick.mp3',
  snare: 'https://tonejs.github.io/audio/drum-samples/Kit8/snare.mp3',
  hihat: 'https://tonejs.github.io/audio/drum-samples/Kit8/hihat.mp3'
}).toDestination()

let step = 0

// now the values represent "probabilities"
let pattern = {
  kick: [1, 0.25, 0.5, 0.25],
  snare: [0, 1, 0.5, 0.75]
}

Tone.Transport.bpm.value = 90
new Tone.Loop(play, '8n').start()

function play () {
  for (const drum in pattern) {
    const i = step % pattern[drum].length
    const v = pattern[drum][i]
    // now we're using random probability
    if (Math.random() < v) drumset.player(drum).start()
  }
  step++
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
