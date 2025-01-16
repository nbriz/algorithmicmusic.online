/*
  instead of passing the frequency and type as two separate arguments into the Oscillator's constructor, we could also pass an object with properties and values set, this [parameters object](https://tonejs.github.io/docs/15.0.4/interfaces/ToneOscillatorOptions.html) allows us to edit many of the Oscillator's properties.

  below we're creating a "custom" wave type (as opposed to the built-in types like "sine", "square", "triangle" and "sawtooth") by specifying the amplitude (0-1) of the harmonic/overtones of our fundamental (which is 440 Hz)
*/
const osc = new Tone.Oscillator({
  frequency: 440,
  type: 'custom',
  partials: [1, 0, 0.25, 0, 0.125, 0, 0.25, 0, 1]
}).toDestination()

function play () {
  osc.start()
  osc.stop('+0.5')
}

nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)

const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
osc.connect(wave)
osc.connect(spec)
