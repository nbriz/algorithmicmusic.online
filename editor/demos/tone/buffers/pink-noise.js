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
    // the formula for "Pink Noise"
    let b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0
    for (let s = 0; s < bufferSize; s++) {
      // start with white noise sample
      const white = nn.random(-1, 1) * amp
      // then modify...
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
