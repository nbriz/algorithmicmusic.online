let sound
const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [0, 10000] })

function createCustomBuffer (freq = 440, seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  const amp = 0.25
  // calculate the "period" instead of scalar
  const period = Math.floor(sr / freq)

  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < bufferSize; s++) {
      // check to see if that current value is less than period / 2
      if (s % period < period / 2) {
        samples[s] = 1 * amp
      } else {
        samples[s] = -1 * amp
      }
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
