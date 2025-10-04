const ctx = new window.AudioContext()

function brownNoise (seconds, loop) {
  const ch = 2
  const len = seconds * ctx.sampleRate
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    // the formula for "Brown Noise"
    const samples = buffer.getChannelData(ch)
    let lastOut = 0.0
    for (let s = 0; s < buffer.length; s++) {
      const ran = Math.random() * 2 - 1
      samples[s] = (lastOut + (0.02 * ran)) / 1.02
      lastOut = samples[s]
      samples[s] *= 3.5 // (roughly) compensate for gain
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

const noise = brownNoise(1, false)

noise.connect(wave)
noise.connect(freq)
noise.start()
