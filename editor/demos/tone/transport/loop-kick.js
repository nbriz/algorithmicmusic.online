const kick = 'https://tonejs.github.io/audio/drum-samples/Kit8/kick.mp3'
const player = new Tone.Player(kick).toDestination()

let pattern = [1, 0, 1, 0, 1]
// default time signature if 4/4
Tone.Transport.timeSignature = [7, 8]
// default bpm (beats per minute)
Tone.Transport.bpm.value = 120

// in this example we'll use sub-divisions instead of seconds
// at 120 beats per minute, '4n' = 1 beat
new Tone.Loop(play, '4n').start()

function indexFromPosition (len, position, beatsPerBar = 4) {
  if (!Number.isFinite(len) || len <= 0) return null
  if (typeof position !== 'string') return null

  const [barStr = '0', beatStr = '0'] = position.split(':')
  const bar = parseInt(barStr, 10) || 0
  const beat = parseInt(beatStr, 10) || 0

  const abs = (bar * beatsPerBar) + beat
  const wrapCols = Math.ceil(len / beatsPerBar) * beatsPerBar // full-bar wrap
  const idx = ((abs % wrapCols) + wrapCols) % wrapCols

  return idx < len ? idx : null
}


// this play function triggers the player's sample only on the beats we've specified as "1" in our pattern, and doesn't play when we specified a "0" in our pattern
function play () {
  const pos = Tone.Transport.position
  const len = pattern.length
  const i = indexFromPosition(len, pos)
  const v = pattern[i]
  console.log(pos)
if (v) player.start()
  seq.update()
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

const seq = viz.createStepSequencer({
  sequence: pattern,
  transport: Tone.Transport
})
