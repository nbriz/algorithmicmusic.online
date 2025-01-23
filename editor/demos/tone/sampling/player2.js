const amen = 'https://algorithmicmusic.online/audios/amen-break.mp3'
const player = new Tone.Player(amen)
player.toDestination()

const timecodes = [
  { offset: 1.8017901897601145, duration: 0.21934837092731851 },
  { offset: 2.0159159804272586, duration: 0.2193483709273183 },
  { offset: 2.2404869316147513, duration: 0.2193483709273183 },
  { offset: 2.4598353025420696, duration: 0.10445160520348473 },
  { offset: 2.55906432748538, duration: 0.12011934598400797 },
  { offset: 2.679183673469388, duration: 0.09922902494331032 },
  { offset: 2.7784126984126982, duration: 0.10445160520348518 },
  { offset: 2.8880868838763574, duration: 0.13056450650435636 },
  { offset: 3.0186513903807137, duration: 0.08878386442296193 },
  { offset: 3.1022126745435017, duration: 0.21412579066714388 }
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

const wave = createWaveform()
player.connect(wave)

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
