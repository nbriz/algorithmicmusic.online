/*
  This demo uses the [GANSynth](https://magenta.withgoogle.com/gansynth) AI Model (by Google's Magenta team) to create AI generated audio buffers (new timbres) based on a specific "seed" value, essentially choosing a specific timbre from the model's latent space. Every time we press the button it uses that timbre to play the next note of a C Major scale
*/
const wave = viz.createWaveform()

// load Magenta's GANSynth model
const CHECKPOINT = 'https://storage.googleapis.com/magentadata/js/checkpoints/gansynth/acoustic_only'
const model = new gansynth.GANSynth(CHECKPOINT)

// Single button: hold z constant (timbre), change pitch each click
let timbre = null
let seed = 1168 // to choose a deterministicly random timbre
let note = 0 // index for current note in C-Major array (midi notes)
const cMajor = nn.createScale('C4', nn.modes.major).map(n => nn.noteToMidi(n))

// Make a deterministic latent vector (for a consistant timbre)
function timbreVector (seed) {
  const shape = [1, 1, 1, model.nLatents]
  return tf.randomNormal(shape, 0, 1, 'float32', seed)
}

// create model input (concat z with one-hot pitch along the last axis)
function inputVector (z, midi) {
  const min = model.minMidiPitch // midi value for C1
  const max = model.maxMidiPitch // midi value for C6
  const idx = nn.clamp(midi, min, max) - min // index of pitch
  // pitch vector, "one-hot" encoded
  const pitchVector = tf.oneHot(idx, model.nPitches)
    .reshape([1, 1, 1, model.nPitches]) // reshape to match timbreVector
  return tf.concat([z, pitchVector], 3)
}

async function playGANSynth () {
  await Tone.start()
  if (!model.isInitialized()) await model.initialize()

  // repeatable timbre (from the same "seed")
  if (!timbre) timbre = timbreVector(seed)

  // make specgram from timbre vector + pitch vector
  const nextNote = cMajor[note % cMajor.length]
  const input = inputVector(timbre, nextNote)
  const spec = model.predict(input, 1)
  input.dispose() // clear memory

  // turn specgrams into audio buffer values
  const audio = await model.specgramsToAudio(spec)
  spec.dispose() // clear memory

  const ganSR = 16000// GANSynth sample rate
  const buffer = Tone.context.createBuffer(1, audio.length, ganSR)
  buffer.copyToChannel(audio, 0)

  const src = new Tone.BufferSource(buffer).toDestination()
  src.connect(wave)
  src.start()

  note++
}

function updateSeed (e) {
  timbre = null // clear old timbre vector
  seed = Number(e.target.value)
}

nn.create('button')
  .content('seeded GANSynth (C Major)')
  .addTo('body')
  .on('click', playGANSynth)

nn.create('input')
  .set('type', 'number')
  .set('value', seed)
  .addTo('body')
  .on('input', updateSeed)
