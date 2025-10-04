let sound
const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [0, 4000] })

function createCustomBuffer (freq = 440, seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  const amp = 0.25
  const scalar = (freq * 2 * Math.PI) / sr

  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < bufferSize; s++) {
      // first create the sine wave
      const sine = Math.sin(s * scalar) * amp
      // then round it up to 1 or down to -1 to make it square
      if (sine > 0) samples[s] = 1 * amp
      else samples[s] = -1 * amp
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
