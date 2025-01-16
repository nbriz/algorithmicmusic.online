// custom function to create Tone.js buffers from scratch
function createCustomBuffer (seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  // loop through each channel
  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    // fill the buffer with white noise
    for (let s = 0; s < bufferSize; s++) {

      // NOISE: random values between -0.25 and 0.25
      samples[s] = nn.random(-0.25, 0.25)

      // SINE WAVE: 440 hz at 0.25 volume
      // const freq = 440
      // const vol = 0.25
      // const scalar = (freq * 2 * Math.PI) / sr
      // samples[s] = Math.sin(s * scalar) * vol

      // for more examples see: Web Audio API > Audio Buffers
    }
  }
  return buffer
}

// function to create a BufferSource and start/stop it
function toggle () {
  if (!sound || sound.state === 'stopped') {
    // Create a new BufferSource each time
    sound = new Tone.BufferSource(buffer).toDestination()
    sound.loop = true
    sound.connect(wave)
    sound.connect(spec)
    sound.start()
  } else {
    sound.stop()
  }
}

// create buffer
const buffer = createCustomBuffer(1, 2)
let sound = null

// UI
nn.create('input')
  .set('type', 'checkbox')
  .addTo('body')
  .on('change', toggle)

nn.create('label')
  .content('toggle sound')
  .addTo('body')

// visuals
const wave = createWaveform()
const spec = createSpectrum()
