const ctx = new window.AudioContext()

function sineWave (freq, seconds, loop) {
  const ch = 2
  const len = seconds * ctx.sampleRate
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  // this scalar formula will let us scale the incrementing value in our loop below by the amount needed to match the frequency value passed into our function
  const scalar = (freq * 2 * Math.PI) / ctx.sampleRate
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < buffer.length; s++) {
      // here we use a "sine" function passing in "s", a value that increments by 1 each iteration through the loop, multiplied by our scalar value
      samples[s] = Math.sin(s * scalar)
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

const noise = sineWave(440, 1, false)

noise.connect(wave)
noise.connect(freq)
noise.start()
