const ctx = new window.AudioContext()

function pinkNoise (seconds, loop) {
  const ch = 2
  const len = seconds * ctx.sampleRate
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    // the formula for "Pink Noise"
    const samples = buffer.getChannelData(ch)
    let b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0
    for (let s = 0; s < samples.length; s++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      samples[s] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      samples[s] *= 0.11 // (roughly) compensate for gain
      b6 = white * 0.115926
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

const noise = pinkNoise(1, false)

noise.connect(wave)
noise.connect(freq)
noise.start()
