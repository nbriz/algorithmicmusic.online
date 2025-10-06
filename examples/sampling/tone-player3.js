const wave = viz.createWaveform()

Tone.getContext().lookAhead = 0.01 // adjust latency

const path = 'https://tonejs.github.io/audio/drum-samples/Kit8/'
const drumset = new Tone.Players({
  kick: path + 'kick.mp3',
  snare: path + 'snare.mp3',
  hihat: path + 'hihat.mp3',
  tom1: path + 'tom1.mp3',
  tom2: path + 'tom2.mp3',
  tom3: path + 'tom3.mp3'
})

drumset.toDestination()
drumset.connect(wave)

// UI
nn.create('label')
  .content('use the "q" through "y" keys to play the drum samples')
  .addTo('body')

nn.on('keydown', (e) => {
  if (e.key === 'q') drumset.player('kick').start()
  else if (e.key === 'w') drumset.player('snare').start()
  else if (e.key === 'e') drumset.player('hihat').start()
  else if (e.key === 'r') drumset.player('tom1').start()
  else if (e.key === 't') drumset.player('tom2').start()
  else if (e.key === 'y') drumset.player('tom3').start()
})
