const birds = 'https://upload.wikimedia.org/wikipedia/commons/8/80/Birds_singing_in_garden.ogg'
const player = new Tone.Player(birds)
player.toDestination()

const timecodes = [2.473, 3.340, 4.947, 22.079]

function playTimeCode (i) {
  const now = Tone.now() // start playing immediately,
  const off = timecodes[i] // from this timecode,
  const dur = 0.25 // for this long
  player.start(now, off, dur)
}

// visualizations
const spec = createSpectrum({ range: [0, 8000] })
player.connect(spec)

// UI (to trigger play function)
for (let i = 0; i < timecodes.length; i++) {
  nn.create('button')
    .content('B' + i)
    .addTo('body')
    .on('click', () => playTimeCode(i))
}

nn.on('keydown', (e) => {
  if (e.key === 'q') playTimeCode(0)
  else if (e.key === 'w') playTimeCode(1)
  else if (e.key === 'e') playTimeCode(2)
  else if (e.key === 'r') playTimeCode(3)
})
