/*

  The algorithmic version of one of the most influential compositions in experimental music history, [4:33](https://en.wikipedia.org/wiki/4%E2%80%B233%E2%80%B3) by John Cage, which is 4 minutes and 33 seconds of silence. Use this as a template for your own algorithmically crafted audio buffers (you might want to adjust the duration though)

*/

// custom function to create Tone.js buffers from scratch "algorithmically"
function createCustomBuffer (seconds, channels) {
  const sr = Tone.context.sampleRate
  const bufferSize = seconds * sr
  const buffer = Tone.context.createBuffer(channels, bufferSize, sr)

  // loop through each channel
  for (let ch = 0; ch < channels; ch++) {
    const samples = buffer.getChannelData(ch)
    // fill the buffer with white noise
    for (let s = 0; s < bufferSize; s++) {
      // THIS IS WHERE WE CREATE OUR BUFFER
      // we create and assign every value or "sample"
      // values closer to 1 and -1 our loudest, 0 is absolute silence
      samples[s] = 0
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
const dur = 4 * 60 + 33 // the duration,  4 mins and 33 seconds
const ch = 2 // the number of "channels" (think speakers)
const buffer = createCustomBuffer(dur, ch)
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
