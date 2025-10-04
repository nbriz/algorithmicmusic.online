/*
  A [FatOscillator](https://tonejs.github.io/docs/15.0.4/classes/FatOscillator.html) layers multiple detuned oscillators to produce a thick, lush, and chorused sound. Unlike a basic oscillator, which generates a single waveform, this oscillator excels at creating wide stereo effects and powerful synth tones commonly used in electronic music.

  If "count" is set to 3 oscillators and the "spread" (the detune spread between the oscillators) is set to 40, the three oscillators would be detuned like this: [-20, 0, 20] for a total detune spread of 40 cents.
*/
const fatOsc = new Tone.FatOscillator({
  frequency: 440,
  type: 'sawtooth',
  count: 3,
  spread: 20
}).toDestination()

function updateCount (e) {
  const val = e.target.value
  countLabel.content(val)
  fatOsc.count = Number(val)
}

function updateSpread (e) {
  const val = e.target.value
  spreadLabel.content(val)
  fatOsc.spread = Number(val)
}

nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', () => fatOsc.start())

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', () => fatOsc.stop())

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', value: 3, min: 1, max: 10 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateCount)

const countLabel = nn.create('label')
  .content('3')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', value: 20, min: 0, max: 100, step: 0.1 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateSpread)

const spreadLabel = nn.create('label')
  .content('20')
  .addTo('body')

const waveAM = viz.createWaveform()
const specAM = viz.createSpectrum({ range: [20, 7040] })
fatOsc.connect(waveAM)
fatOsc.connect(specAM)
