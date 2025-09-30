const synth = new Tone.Synth()
const effect = new Tone.Reverb()

// connecting the synth to the effect
synth.connect(effect)
// and then the effect to the destination
effect.toDestination()

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
