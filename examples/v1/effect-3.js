const synth = new Tone.Synth()
const effect = new Tone.Reverb()

synth.connect(effect)
effect.toDestination()

// in addition the "wet" property, effects each have their own special properties
effect.set({
  wet: 1,
  decay: 100 // very long decay
})

nn.create('button')
  .content('hold')
  .addTo('body')
  .on('mousedown', () => synth.triggerAttack(440))
  .on('mouseup', () => synth.triggerRelease())

// Visualization
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
