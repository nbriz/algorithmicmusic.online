const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })

const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'square'
})
osc.toDestination()
osc.connect(wave)
osc.connect(spec)

function play () {
  // set a different random type each time
  const types = ['sine', 'square', 'triangle', 'sawtooth']
  const shape = nn.random(types)
  osc.set({ type: shape })
  // play and stop 5 seconds later
  osc.start()
  osc.stop('+0.5')
}

// UI (to trigger play function)
nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)
