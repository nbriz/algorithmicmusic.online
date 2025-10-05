const wave = viz.createWaveform()

const filePath = 'https://algorithmicmusic.online/audios/more-spell-on-you.wav'
const player = new Tone.Player(filePath).toDestination()
player.connect(wave)
player.playbackRate = 0.9 // slow down play back

const cuts = [
  { offset: 1.59, duration: 1.15 },
  { offset: 1.83, duration: 0.89 },
  { offset: 3.63, duration: 1.34 },
  { offset: 5.44, duration: 0.89 }
]

Tone.getContext().lookAhead = 0.01 // adjust latency

function playSample (i) {
  // play sample
  const now = Tone.now()
  const off = cuts[i].offset
  const dur = cuts[i].duration / player.playbackRate
  player.start(now, off, dur)
  // change background
  const clr = nn.randomColor()
  nn.get('body').css('background', clr)
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
