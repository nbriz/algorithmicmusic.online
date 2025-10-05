const wave = viz.createWaveform()

const filePath = 'https://algorithmicmusic.online/audios/amen-break.mp3'
const player = new Tone.Player(filePath).toDestination()
player.connect(wave)

const cuts = [
  // paste { offset, duration } objects here
]

Tone.getContext().lookAhead = 0.01 // adjust latency

function playSample (i) {
  const now = Tone.now()
  const off = cuts[i].offset
  const dur = cuts[i].duration
  player.start(now, off, dur)
}

// UI
nn.create('label')
  .content('use keyboard to play the samples')
  .addTo('body')

nn.on('keydown', (e) => {
  // this should match the number of cut objects above
  // assign specific keys to specific index values in cuts array
  if (e.key === 'q') playSample(0)
  else if (e.key === 'w') playSample(1)
  else if (e.key === 'e') playSample(2)
  else if (e.key === 'r') playSample(3)
  else if (e.key === 't') playSample(4)
  else if (e.key === 'y') playSample(5)
})
