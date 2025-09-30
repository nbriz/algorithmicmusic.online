const drumset = new Tone.Players({
  kick: 'https://tonejs.github.io/audio/drum-samples/Kit8/kick.mp3',
  snare: 'https://tonejs.github.io/audio/drum-samples/Kit8/snare.mp3',
  hihat: 'https://tonejs.github.io/audio/drum-samples/Kit8/hihat.mp3',
  tom1: 'https://tonejs.github.io/audio/drum-samples/Kit8/tom1.mp3',
  tom2: 'https://tonejs.github.io/audio/drum-samples/Kit8/tom2.mp3',
  tom3: 'https://tonejs.github.io/audio/drum-samples/Kit8/tom3.mp3'
})

drumset.toDestination()

// visualizations
const wave = createWaveform()
const spec = createSpectrum({ range: [0, 8000] })
drumset.connect(wave)
drumset.connect(spec)

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
