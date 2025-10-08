const wave = viz.createWaveform()

Tone.getContext().lookAhead = 0.01 // adjust latency

const amen = 'https://algorithmicmusic.online/audios/amen-break.mp3'
const player = new Tone.Player(amen).toDestination()
player.connect(wave)

const timecodes = [
  { offset: 1.801, duration: 0.219 },
  { offset: 2.015, duration: 0.219 },
  { offset: 2.240, duration: 0.219 },
  { offset: 2.459, duration: 0.104 },
  { offset: 2.559, duration: 0.120 },
  { offset: 2.679, duration: 0.099 },
  { offset: 2.778, duration: 0.104 },
  { offset: 2.888, duration: 0.130 },
  { offset: 3.018, duration: 0.088 },
  { offset: 3.102, duration: 0.214 }
]

function playTimeCode (i) {
  const now = Tone.now()
  const tc = timecodes[i]
  player.start(now, tc.offset, tc.duration)
}

// UI / visualizations
nn.create('label')
  .addTo('body')
  .content('use keys "q" - "p" to trigger the samples')

nn.on('keydown', (e) => {
  if (e.key === 'q') playTimeCode(0)
  else if (e.key === 'w') playTimeCode(1)
  else if (e.key === 'e') playTimeCode(2)
  else if (e.key === 'r') playTimeCode(3)
  else if (e.key === 't') playTimeCode(4)
  else if (e.key === 'y') playTimeCode(5)
  else if (e.key === 'u') playTimeCode(6)
  else if (e.key === 'i') playTimeCode(7)
  else if (e.key === 'o') playTimeCode(8)
  else if (e.key === 'p') playTimeCode(9)
})
