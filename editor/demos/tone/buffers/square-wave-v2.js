// custom function to create Tone.js buffers from scratch "algorithmically"
function createCustomBuffer (seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  // variable to scale our buffer values by (to adjust the volume)
  const amp = 0.25 // value from 0 -> 1
  const freq = 440 // our frequency or "pitch", 440 Hz
  // formula to calculate the "period" of a wave (instead of scalar)
  const period = Math.floor(sr / freq)

  // loop through each channel
  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < bufferSize; s++) {
      // formula for a Square Wave ---------------- (version 2)
      // check to see if that current value is less than period / 2
      // ie. is this sample part of the top half of our wave's period
      // or the bottom half of our wave's period.
      if (s % period < period / 2) {
        samples[s] = 1 * amp
      } else {
        samples[s] = -1 * amp
      }
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
