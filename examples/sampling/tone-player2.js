const wave = viz.createWaveform()

const filePath = 'https://algorithmicmusic.online/audios/funky-drummer.mp3'
const player = new Tone.Player(filePath).toDestination()
player.connect(wave)
player.loop = true

function changeSpeed () {
  // map the mouse's X (0 -> screen width) to new range (0 -> 2)
  const speed = nn.map(nn.mouseX, 0, nn.width, 0, 2)
  player.playbackRate = speed
}

nn.create('button')
  .content('play the funky drummer')
  .addTo('body')
  .on('click', () => player.start())

nn.on('mousemove', changeSpeed)
