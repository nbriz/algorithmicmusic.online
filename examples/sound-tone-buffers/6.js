const wave = createWaveform()
const spec = createSpectrum({ range: [0, 4000] })

function createCustomBuffer (freq = 440, seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)
  // create variables for generating a sine wave
  const amp = 0.25
  const scalar = (freq * 2 * Math.PI) / sr
  // loop through each channel and fill it with a sine wave
  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < bufferSize; s++) {
      samples[s] = Math.sin(s * scalar) * amp
    }
  }
  return buffer
}

function playRandomTone () {
  const pitch = nn.random(220, 880)
  const buffer = createCustomBuffer(pitch, 1, 2)
  const sound = new Tone.BufferSource(buffer).toDestination()
  sound.connect(wave)
  sound.connect(spec)
  sound.start()
}

// create UI
nn.create('button')
  .content('play noise')
  .addTo('body')
  .on('click', playRandomTone)
