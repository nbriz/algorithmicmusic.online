/*
  An [AMOscillator](https://tonejs.github.io/docs/15.0.4/classes/AMOscillator.html) applies "[amplitude modulation](https://en.wikipedia.org/wiki/Amplitude_modulation)" to a basic oscillator (the carrier) by combining it with another oscillator (the modulator) used to modulate the amplitude. This modulation creates rhythmic changes in the amplitude, resulting in richer and more complex textures.

  The "harmonicity" is the frequency ratio between the carrier and the modulator oscillators. A harmonicity of 1 gives both oscillators the same frequency. Harmonicity = 2 means a change of an octave.
*/
const amOsc = new Tone.AMOscillator({
  frequency: 440,
  type: 'sine',
  modulationType: 'square',
  harmonicity: 1
}).toDestination()

function updateHarmonicity (e) {
  const val = e.target.value
  label.content(val)
  amOsc.harmonicity.value = Number(val)
}

nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', () => amOsc.start())

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', () => amOsc.stop())

nn.create('input')
  .set({
    type: 'range',
    value: 1,
    min: 0,
    max: 10,
    step: 0.1
  })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateHarmonicity)

const label = nn.create('label')
  .content('1')
  .addTo('body')

const waveAM = viz.createWaveform()
const specAM = viz.createSpectrum({ range: [20, 7040] })
amOsc.connect(waveAM)
amOsc.connect(specAM)
