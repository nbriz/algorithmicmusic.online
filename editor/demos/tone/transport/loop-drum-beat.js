const drumset = new Tone.Players({
  kick: 'https://tonejs.github.io/audio/drum-samples/Kit8/kick.mp3',
  snare: 'https://tonejs.github.io/audio/drum-samples/Kit8/snare.mp3',
  hihat: 'https://tonejs.github.io/audio/drum-samples/Kit8/hihat.mp3'
}).toDestination()

let step = 0
let pattern = {
  kick: [1, 0, 1, 0],
  snare: [0, 1, 0, 1],
  hihat: [1, 1, 1, 1]
}

Tone.Transport.bpm.value = 90
new Tone.Loop(play, '4n').start()

function play () {
  for (const drum in pattern) {
    const i = step % pattern[drum].length
    const v = pattern[drum][i]
    if (v) drumset.player(drum).start()
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
