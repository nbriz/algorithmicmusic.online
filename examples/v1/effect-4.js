const synth = new Tone.Synth()
const reverb = new Tone.Reverb()
const phaser = new Tone.Phaser()

// [synth]-->[reverb]-->[phaser]-->[Destination]
synth.chain(reverb, phaser, Tone.Destination)

nn.create('button')
  .content('hold')
  .addTo('body')
  .on('mousedown', () => synth.triggerAttack(440))
  .on('mouseup', () => synth.triggerRelease())

// Visualization
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
phaser.connect(wave)
phaser.connect(spec)
