const wave = viz.createWaveform()

const filePath = '/audios/more-spell-on-you.wav'
const player = new Tone.Player(filePath).toDestination()
player.connect(wave)
player.playbackRate = 0.9 // slow down play back

const cuts = [
  { offset: 1.581750150400296, duration: 1.1510388418405915 },
  { offset: 1.82681003285668, duration: 0.8985529023400742 },
  { offset: 3.6313418945809612, duration: 1.344116324988045 },
  { offset: 5.435873756305242, duration: 0.8985529023400751 }
]

Tone.getContext().lookAhead = 0.01 // adjust latency

function playSample (i) {
  const now = Tone.now()
  const off = cuts[i].offset
  const dur = cuts[i].duration / player.playbackRate
  player.start(now, off, dur)
}

// UI
nn.create('label')
  .content('use keyboard to play the samples')
  .addTo('body')

nn.on('keydown', (e) => {
  if (e.key === 'q') playSample(0)
  else if (e.key === 'w') playSample(1)
  else if (e.key === 'e') playSample(2)
  else if (e.key === 'r') playSample(3)
  else if (e.key === 'Enter') player.start()
})
