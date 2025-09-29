/*
  some AudioNodes are like the [GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode) are "audio-processing" nodes rather than a "source-node", which means it goes inbetween a source-node and a destination. Other processing-nodes include the [DelayNode](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode), the [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode) (ie. reverb), [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode), [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode) and [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode) (ie. distortion)
*/
const ctx = new window.AudioContext()

const osc = ctx.createOscillator()
osc.frequency.value = 440
osc.type = 'square'

const gain = ctx.createGain()
gain.gain.value = 0.5 // scale volume down by half

// we'll connect the OscillatorNode to the GainNode...
osc.connect(gain)
// ...and then the GainNode to our speakers
gain.connect(ctx.destination)

// start the oscillator immediately and stop it half a second later
osc.start(ctx.currentTime)
osc.stop(ctx.currentTime + 0.5)
