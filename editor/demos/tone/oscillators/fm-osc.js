/*
  An [FMOscillator](https://tonejs.github.io/docs/15.0.4/classes/FMOscillator.html) uses [frequency modulation](https://en.wikipedia.org/wiki/Frequency_modulation), where the frequency of a basic oscillator is modulated by another oscillator (modulator). This technique generates a wide range of harmonic and inharmonic content, making it ideal for metallic or evolving sounds.

  Like the AMOscillator you can control it's harmonicity, but you can also control the modulationIndex, which is in essence the depth or amount of the modulation. In other terms it is the ratio of the frequency of the modulating signal (mf) to the amplitude of the modulating signal (ma) -- as in ma/mf.
*/
const fmOsc = new Tone.FMOscillator({
  frequency: 440,
  type: 'sine',
  modulationType: 'square',
  harmonicity: 1,
  modulationIndex: 10
}).toDestination()

function updateHarmonicity (e) {
  const val = e.target.value
  harmLabel.content(val)
  fmOsc.harmonicity.value = Number(val)
}

function updateModulationIndex (e) {
  const val = e.target.value
  modLabel.content(val)
  fmOsc.modulationIndex.value = Number(val)
}

nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', () => fmOsc.start())

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', () => fmOsc.stop())

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', value: 1, min: 0, max: 10, step: 0.1 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateHarmonicity)

const harmLabel = nn.create('label')
  .content('1')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', value: 10, min: 0, max: 100, step: 0.1 })
  .css({ width: '400px' })
  .addTo('body')
  .on('input', updateModulationIndex)

const modLabel = nn.create('label')
  .content('10')
  .addTo('body')

const waveAM = viz.createWaveform()
const specAM = viz.createSpectrum({ range: [20, 7040] })
fmOsc.connect(waveAM)
fmOsc.connect(specAM)
