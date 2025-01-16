/*
  In music production effects are tools used to shape and transform the sound in creative ways, making it richer, more dynamic, or completely unique. They work by taking an audio signal, applying some kind of processing—like adding echoes, making the sound smoother, or distorting it—and then outputting the modified signal.

  In Tone.js, effects come as pre-built nodes, such as the [Tone.Reverb](https://tonejs.github.io/docs/15.0.4/classes/Reverb.html) in this exmaple.

  [Synth]--->[Reverb]--->[destination]

*/

const synth = new Tone.Synth()
const effect = new Tone.Reverb()

synth.connect(effect)
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
