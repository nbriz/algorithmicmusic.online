const birds = 'https://upload.wikimedia.org/wikipedia/commons/8/80/Birds_singing_in_garden.ogg'
const player = new Tone.Player(birds)
player.toDestination()

// UI (to trigger play function)
nn.create('button')
  .content('play bird sounds')
  .addTo('body')
  .on('click', () => player.start())

// visualizations
const spec = createSpectrum({ range: [0, 8000] })
player.connect(spec)
