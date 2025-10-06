// custom function to create Tone.js buffers from scratch "algorithmically"
function createCustomBuffer (seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  // variable to scale our buffer values by (to adjust the volume)
  const amp = 0.25 // value from 0 -> 1

  // loop through each channel
  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    // the formula for "Brown Noise"
    let lastOut = 0.0
    for (let s = 0; s < bufferSize; s++) {
      // start with white noise sample
      const white = nn.random(-1, 1) * amp
      // then modify...
      samples[s] = (lastOut + (0.02 * white)) / 1.02
      lastOut = samples[s]
      samples[s] *= 3.5 // (roughly) compensate for gain
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

// create buffer (1 second, 2 channels)
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
const wave = viz.createWaveform()
const spec = viz.createSpectrum()
