/*

  In the last example we filled our buffers with 0s, which means our speakers would stay still, the sound of silence. In this example we've written a simple algorithm that generates random values between -1 and 1, also known as "white noise"

*/
const ctx = new window.AudioContext()

function whiteNoise (seconds, loop) {
  const ch = 2
  const len = seconds * ctx.sampleRate
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < buffer.length; s++) {
      // Math.random() generates a random number between 0 and 1
      // by multiplying it by 2, we now values between 0 and 2
      // by subtracting 1, we now get values between -1 and 1
      samples[s] = Math.random() * 2 - 1
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

// create white noise buffer (1 second long)
// we can loop the buffer if we pass "true" as a second argument
const noise = whiteNoise(1, false)

noise.connect(wave)
noise.connect(freq)
noise.start()
