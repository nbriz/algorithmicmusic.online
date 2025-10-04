/*

  We can also create a custom tone by calculating our own set of harmonic overtones

*/
const ctx = new window.AudioContext()

function customWave (freq, harm, seconds, loop) {
  const ch = 2
  const len = seconds * ctx.sampleRate
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  const scalar = (freq * 2 * Math.PI) / rate
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < buffer.length; s++) {
      // create variable for the sample value
      let value = 0
      // loop through the array of harmonics
      for (let n = 0; n < harm.length; n++) {
        const vol = harm[n] // volume of harmonic
        const har = n + 1 // which harmonic
        // add the next scaled harmonic to the value
        value += Math.sin(har * s * scalar) * vol
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
const wave = viz.createWaveform({ audioCtx: ctx })
const freq = viz.createSpectrum({ audioCtx: ctx })

const harmonics = [1, 0.2, 0.01, 0.2, 1]
const noise = customWave(440, harmonics, 1, false)

noise.connect(wave)
noise.connect(freq)
noise.start()
