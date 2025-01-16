const synth = new Tone.Synth()
const reverb = new Tone.Reverb()
const phaser = new Tone.Phaser()

/*
                          _____________
  [synth]--->[reverb]----> |            |
        \                | Destination |
        `--->[phaser]---> |______________|
*/
// Send the synth's output to both reverb and phaser
synth.fan(reverb, phaser)
// Connect reverb and phaser to the output
reverb.toDestination()
phaser.toDestination()

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
