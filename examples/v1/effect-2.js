const synth = new Tone.Synth()
const effect = new Tone.Reverb()

synth.connect(effect)
effect.toDestination()

// adjusting the "wet" mix so that we hear the original signal as well as the reverb. Adjusting it to 0 means we'll only here the original signal, 1 would be only reverb.
effect.set({ wet: 0.5 })

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
