/*

  In order to create a square wave, we could modify our prior sine wave function this way:

  const scalar = (freq * 2 * Math.PI) / ctx.sampleRate
  const sine = Math.sin(s * scalar)
  if (sine > 0) samples[s] = 1
  else samples[s] = -1

  we've set a threshold which rounds any values greater than 0 up to 1 and any less than 0 down to -1, however the values closest to 0 might not be perfectly aligned with the intended frequency due to the Math.sin approximation and the scalar conversion. Below i've approached the creation of a square wave buffer differentially which not only avoids these rounding errors, it also requires less calculations (which means it will run more efficiently). Essentially this:

  const period = Math.floor(ctx.sampleRate / freq)
  samples[s] = (s % period) < (period / 2) ? 1 : -1
*/
const ctx = new window.AudioContext()

function squareWave (freq, seconds, loop) {
  const ch = 2
  const len = seconds * ctx.sampleRate
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  // instead of calculating the "scalar" value, we identify the period of the wave, essentially it's length, how much time (or samples) it takes for one complete cycle of the wave to occur (before it repeats itself).
  const period = Math.floor(ctx.sampleRate / freq)

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < buffer.length; s++) {
      // here we use [modulus](https://en.wikipedia.org/wiki/Modular_arithmetic) (%) to convert our ever increasing "s" value into a series of repeating values from 0 to the length of our period. Then we check to see if that current value is less than period/2 if so we make our sample 1 otherwise we make it -1.
      samples[s] = (s % period) < (period / 2) ? 1 : -1
    }
  }
  const node = ctx.createBufferSource()
  node.buffer = buffer
  node.loop = loop
  node.connect(ctx.destination)
  return node
}

// for visuals
const wave = createWaveform({ audioCtx: ctx })
const freq = createSpectrum({ audioCtx: ctx })

const noise = squareWave(440, 1, false)

noise.connect(wave)
noise.connect(freq)
noise.start()

// ...all that said, while this is the most "efficient" way to create decent square wave, one could argue that a more accurate/traditional square wave should be created by calculating it's harmonic series (similar to how the next Custom Wave example works), here's how we might [create a square wave by calculating it's harmonic overtones](https://netnet.studio/?c=3e&layout=dock-left).
