const aaah = 'https://upload.wikimedia.org/wikipedia/commons/6/65/Open_front_unrounded_vowel.ogg'
const sampler = new Tone.Sampler({
  urls: { 'C4': aaah }
})

sampler.toDestination()

// UI
nn.create('label')
  .content('press the "q" key to play the sample')
  .addTo('body')

nn.on('keydown', (e) => {
  if (e.key === 'q') sampler.triggerAttack('C4')
})

nn.on('keyup', (e) => {
  if (e.key === 'q') sampler.triggerRelease('C4')
})


// visualizations
const wave = createWaveform()
const spec = createSpectrum({ range: [0, 8000] })
sampler.connect(wave)
sampler.connect(spec)
