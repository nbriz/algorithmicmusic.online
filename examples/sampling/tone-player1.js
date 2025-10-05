const wave = viz.createWaveform()

const filePath = 'https://algorithmicmusic.online/audios/funky-drummer.mp3'
const player = new Tone.Player(filePath).toDestination()
player.connect(wave)
player.loop = true // will keep looping after we press start

nn.create('button')
  .content('play the funky drummer')
  .addTo('body')
  .on('click', () => player.start())
