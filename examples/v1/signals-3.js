const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'custom',
  partials: [1, 0, 0.25, 0, 0.125, 0, 0.25, 0, 1]
})

osc.toDestination()

// function to randomize some of the settings/properties
function play () {
  // here we use the .set() method to adjust parameters
  // we randomize the frequency value (between 220 - 440)
  // we randomize each of the partials (from 0 - 1)
  osc.set({
    frequency: nn.random(220, 440),
    partials: osc.partials.map(v => nn.random())
  })
  osc.start()
  osc.stop('+0.5')
}

// UI
nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)

// visualizations
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
osc.connect(wave)
osc.connect(spec)
