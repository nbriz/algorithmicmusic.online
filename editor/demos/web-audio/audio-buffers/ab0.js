/*

  Digital sound, like all digital files, is data--ultimately a series of numbers. In audio these number values represent the position of our speakers at any given time, a negative-1 pulls the speaker as far back as it goes while a positive 1 pushes it as far front as it can go. We can create any sound from raw data by creating audio buffers (containers for these numbers) from scratch.

  the AudioContext's createBuffer() method creates an [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) instance. It takes 3 arguments: number of audio channels, the length, and the sample rate. the sample rate is the number of samples (floats from -1 to 1) the buffer will have per second, and so the length of the buffer array would be the number of seconds * the sample rate.

*/
const ctx = new window.AudioContext()

function silence (seconds) {
  // decide how many channels you want (1 = mono, 2 = stereo, etc.)
  const ch = 2
  // length of the buffer needs to be the amount of seconds you want times the sample rate
  const len = seconds * ctx.sampleRate
  // then create the audio buffer with the parameters defined above
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(ch, len, rate)

  // loop through each of the channels
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    // samples is the list of values in each channel
    const samples = buffer.getChannelData(ch)
    // loop through the length of the buffer...
    for (let s = 0; s < buffer.length; s++) {
      // for each sample we'll give it a value of "0", silence
      samples[s] = 0
    }
  }
  const node = ctx.createBufferSource()
  node.buffer = buffer
  node.connect(ctx.destination)
  return node
}

// for visuals
const wave = createWaveform({ audioCtx: ctx })
const freq = createSpectrum({ audioCtx: ctx })

// create a silent buffer (1 second long)
const noise = silence(1)

noise.connect(wave)
noise.connect(freq)
noise.start()
