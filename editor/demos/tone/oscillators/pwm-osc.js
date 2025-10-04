/*
  The [PWMOscillator](https://tonejs.github.io/docs/15.0.4/classes/PWMOscillator.html) generates a square wave with a variable pulse width, which can also be modulated over time. This [pulse-width modulation](https://en.wikipedia.org/wiki/Pulse-width_modulation) adds dynamic timbral variation, producing a more animated sound compared to the static tones of a basic oscillator.
*/
const pwmOsc = new Tone.PWMOscillator({
  frequency: 440,
  modulationFrequency: 0.4
}).toDestination();

function updateModulation (e) {
  const val = e.target.value
  label.content(val)
  pwmOsc.modulationFrequency.value = Number(val)
}

nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', () => pwmOsc.start())

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', () => pwmOsc.stop())

nn.create('input')
  .set({ type: 'range', value: 0.4, min: 0, max: 10, step: 0.1 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateModulation)

const label = nn.create('label')
  .content('0.4')
  .addTo('body')

const waveAM = viz.createWaveform()
const specAM = viz.createSpectrum({ range: [20, 7040] })
pwmOsc.connect(waveAM)
pwmOsc.connect(specAM)
