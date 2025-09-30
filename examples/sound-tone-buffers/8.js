let sound
const wave = createWaveform()
const spec = createSpectrum({ range: [0, 10000] })

function createCustomBuffer (freq = 440, seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  const amp = 0.25
  const numHarmonics = Math.floor(sr / (2 * freq))
  const scalar = (freq * 2 * Math.PI) / sr

  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < bufferSize; s++) {
      samples[s] = 0
      // square wave uses only odd harmonics
      for (let n = 1; n <= numHarmonics; n += 2) {
        // Add scaled sine wave for each harmonic
        samples[s] += (1 / n) * Math.sin(n * s * scalar)
      }
      samples[s] = samples[s] * amp // scale for volumne
    }
  }
  return buffer
}

function toggle () {
  if (!sound || sound.state === 'stopped') {
    // Create a new BufferSource each time
    const pitch = nn.random(220, 880)
    const buffer = createCustomBuffer(pitch, 1, 2)
    sound = new Tone.BufferSource(buffer).toDestination()
    sound.loop = true
    sound.connect(wave)
    sound.connect(spec)
    sound.start()
  } else {
    sound.stop()
  }
}

// UI
nn.create('input')
  .set('type', 'checkbox')
  .addTo('body')
  .on('change', toggle)

nn.create('label')
  .content('toggle sound')
  .addTo('body')
