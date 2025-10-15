const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })

const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'custom',
  partials: [1, 0, 0.25, 0, 0.125, 0, 0.25, 0, 1]
})
osc.toDestination()
osc.connect(wave)
osc.connect(spec)

function play () {
  // set a different random set of partials each time
  let amp = []
  for (let i = 0; i < 9; i++) {
    const a = nn.random() // 0-1
    amp.push(a)
  }
  osc.set({ partials: amp })
  // play and stop 5 seconds later
  osc.start()
  osc.stop('+0.5')
}

// UI (to trigger play function)
nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)
