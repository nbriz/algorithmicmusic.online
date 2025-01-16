/*
  The most fundamental tone generatring source in audio synthesis is the Oscillator, in Tone.js we cann access it via the [Tone.Oscillator()](https://tonejs.github.io/docs/15.0.4/classes/Oscillator.html) class.
*/
const osc = new Tone.Oscillator(440, 'sine')
osc.toDestination() // connect it to the destination

function play () {
  osc.start()
  osc.stop('+0.5')
}

// to create a button that runs the play function above when clicked
nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)

// for visualizations
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
osc.connect(wave)
osc.connect(spec)
