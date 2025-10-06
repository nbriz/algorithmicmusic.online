// custom function to create Tone.js buffers from scratch "algorithmically"
function createCustomBuffer (seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  // variable to scale our buffer values by (to adjust the volume)
  const amp = 0.25 // value from 0 -> 1
  // formula to calculate how to scale "s" (the index of the sample)
  // so that it matches a specific frequency
  const freq = 440 // our frequency or "pitch", 440 Hz
  const scalar = (freq * 2 * Math.PI) / sr
  // frequency * 2π (the circumference of a circle) / sample rate

  // loop through each channel
  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    // formula for a Square Wave ---------------- (version 1)
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
const spec = viz.createSpectrum({
  range: [0, 3520],
  harmonics: true
})
