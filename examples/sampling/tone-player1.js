const wave = viz.createWaveform()

const filePath = 'https://algorithmicmusic.online/audios/amen-break.mp3'
const player = new Tone.Player(filePath).toDestination()
player.connect(wave)

nn.create('button')
  .content('play amen break')
  .addTo('body')
  .on('click', () => player.start())
