/*
  This demo uses the [GANSynth](https://magenta.withgoogle.com/gansynth) AI Model (by Google's Magenta team) to create AI generated audio buffers (new timbres), we could play any key/pitch using this timbre, in the example below we play an A4 (440 Hz). For more AI demos choose the "tensorflow.js (AI)" option in the first selection menu.
*/
const wave = viz.createWaveform()

// load Magenta's GANSynth model
const CHECKPOINT = 'https://storage.googleapis.com/magentadata/js/checkpoints/gansynth/acoustic_only'
const model = new gansynth.GANSynth(CHECKPOINT)

// GANSynth uses a 16 kHz sample rate
const OUT_SR = 16000

async function playGANSynth () {
  await Tone.start()
  if (!model.isInitialized()) await model.initialize()

  // create random AI generated sample
  const note = nn.frequencyToMidi(440)
  const spec = model.randomSample(note)

  // Convert spectrograms to audio buffer values
  const audio = await model.specgramsToAudio(spec)

  // then we'll create a Tone.js buffer same as the other examples
  const buffer = Tone.context.createBuffer(1, audio.length, OUT_SR)
  // except this time we'll use it's copyToChannel method to copy
  // the buffer stored in the "audio" variable into our Tone.js buffer
  buffer.copyToChannel(audio, 0)

  // then we'll create a buffer node as usual
  // connect it to our speakers and wave visualizer...
  const src = new Tone.BufferSource(buffer).toDestination()
  src.connect(wave)
  src.start() // ...and play it
}

nn.create('button')
  .content('random GANSynth A4')
  .addTo('body')
  .on('click', playGANSynth)
