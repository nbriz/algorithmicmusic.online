/*
    AudioNode's, be they source-nodes or processing-nodes, have parameters (ex: an OscillatorNode's frequency or a gain's GainNode's gain), these are all instances of [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam), you can schedule a change to these values using the .setValueAtTime() method. These changes can also happen over time using the .linearRampToValueAtTime() and.exponentialRampToValueAtTime()
*/
const ctx = new window.AudioContext()

const osc = ctx.createOscillator()
const lvl = ctx.createGain()

// Build the audio graph
osc.connect(lvl)
lvl.connect(ctx.destination)

// the [SVG wave](https://algorithmicmusic.online/editor/#Web Audio API/the basics/visualization: svg with d3) visualization [packaged](https://algorithmicmusic.online/js/create-waveform.js) into a function
const wave = viz.createWaveform({ audioCtx: ctx })
lvl.connect(wave)

// Fade up the gain linearly from 0.1 to 1.0 over the next 5 seconds
lvl.gain.setValueAtTime(0.1, ctx.currentTime)
lvl.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 5)

// Schedule specific changes to the frequency at specific times
osc.frequency.setValueAtTime(523.25, ctx.currentTime + 1) // C
osc.frequency.setValueAtTime(659.26, ctx.currentTime + 2) // E
osc.frequency.setValueAtTime(523.25, ctx.currentTime + 3) // C
osc.frequency.setValueAtTime(440.00, ctx.currentTime + 4) // A

osc.start(ctx.currentTime)
osc.stop(ctx.currentTime + 5)
