/*
  The [PulseOscillator](https://tonejs.github.io/docs/15.0.4/classes/PulseOscillator.html) is similar to a square wave generator but offers control over the pulse width (the ratio of high to low states in the waveform). This allows for distinct timbral shifts not possible with a basic oscillator’s fixed square wave.
*/
const pulseOsc = new Tone.PulseOscillator({
  frequency: 440,
  width: 0.5 // Pulse width (0 to 1)
}).toDestination();

function udpateWidth (e) {
  const val = e.target.value
  label.content(val)
  pulseOsc.width.value = Number(val)
}

nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', () => pulseOsc.start())

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', () => pulseOsc.stop())

nn.create('input')
  .set({ type: 'range', value: 0.50, min: 0, max: 1, step: 0.01 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', udpateWidth)

const label = nn.create('label')
  .content('0.5')
  .addTo('body')

const waveAM = createWaveform()
const specAM = createSpectrum({ range: [20, 7040] })
pulseOsc.connect(waveAM)
pulseOsc.connect(specAM)
