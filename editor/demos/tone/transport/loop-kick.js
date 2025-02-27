const kick = 'https://tonejs.github.io/audio/drum-samples/Kit8/kick.mp3'
const player = new Tone.Player(kick).toDestination()

let step = 0
let pattern = [1, 0, 1, 0]

// default time signature if 4/4
Tone.Transport.timeSignature = [4, 4]
// default bpm (beats per minute)
Tone.Transport.bpm.value = 120

// in this example we'll use sub-divisions instead of seconds
// at 120 beats per minute, '4n' = 1 beat
new Tone.Loop(play, '4n').start()

// this play function triggers the player's sample only on the beats we've specified as "1" in our pattern, and doesn't play when we specified a "0" in our pattern
function play () {
  const i = step % pattern.length
  const v = pattern[i]
  if (v) player.start()
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
