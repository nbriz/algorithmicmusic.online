/*

  Calculating a square wave via harmonics

*/
const ctx = new window.AudioContext()

function squareWave(freq, seconds, loop) {
  const ch = 2
  const len = seconds * ctx.sampleRate
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  const numHarmonics = Math.floor(rate / (2 * freq)) // Number of harmonics to avoid aliasing
  const scalar = (freq * 2 * Math.PI) / rate // Frequency-to-angular velocity conversion

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < buffer.length; s++) {
      let value = 0
      for (let n = 1; n <= numHarmonics; n += 2) { // Only odd harmonics
        value += (1 / n) * Math.sin(n * s * scalar) // Add scaled sine wave for each harmonic
      }
      samples[s] = value // Write the sample value to the buffer
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
