// custom function to create Tone.js buffers from scratch "algorithmically"
function createCustomBuffer (seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  // variable to scale our buffer values by (to adjust the volume)
  const amp = 0.25 // value from 0 -> 1
  const freq = 440 // our frequency or "pitch", 440 Hz
  // here we take the "harmonics" approach, creating a new wave shape
  // by combining (adding togheter) different sine waves together.
  const numHarmonics = Math.floor(sr / (2 * freq))
  const scalar = (freq * 2 * Math.PI) / sr

  // loop through each channel
  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    for (let s = 0; s < bufferSize; s++) {
      // formula for a Square Wave ---------------- (version 3)
      // we can create all sorts of other wave shapes by combining
      // different sine waves, starting with a base frequency and then
      // including it's "harmonics", other frequencies each a multiple
      // of the first. Creating a square wave this way involves including
      // every *other* harmonic, each half as loud as the last.
      samples[s] = 0
      // square wave uses only odd harmonics
      for (let n = 1; n <= numHarmonics; n += 2) {
        // Add the sine wave for each harmonic
        samples[s] += (1 / n) * Math.sin(n * s * scalar)
      }
      samples[s] = samples[s] * amp // scale for volumne
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
