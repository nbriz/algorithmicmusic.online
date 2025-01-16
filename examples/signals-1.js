const osc = new Tone.Oscillator(440, 'sine')
osc.toDestination() // connect it to the destination

// function to play Oscillator for 0.5 seconds
function play () {
  osc.start()
  osc.stop('+0.5')
}

// UI (to trigger play function)
nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)

// visualizations
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
osc.connect(wave)
osc.connect(spec)
