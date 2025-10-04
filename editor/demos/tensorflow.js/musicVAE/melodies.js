/*
  This demo uses the [MusicVAE](https://magenta.withgoogle.com/music-vae) AI model by Google's Magenta team to create AI generated melodies. The note data is then played through a Tone.js PolySynth with default settings
*/


// load the MusicVAE model
const mvae = new music_vae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small')

// create a Tone.js Synth
const synth = new Tone.PolySynth().toDestination()

// a couple of helper functions to convert musicVAE sample objects
// first to ensure they all start at the time the button is pressed...
function normalizeToFirstStart (notes) {
  const offset = notes[0].quantizedStartStep
  return notes.map(n => ({
    quantizedStartStep: Math.max(0, n.quantizedStartStep - offset),
    quantizedEndStep: Math.max(0, n.quantizedEndStep - offset)
  }))
}
// ..then into Tone.js friendly objects with duration + start-time values
function mvaeToTime (n) {
  const now = Tone.now()
  const sec = 0.125 // 60s / 120bpm / 4beats
  const start = now + (n.quantizedStartStep * sec)
  const dur = (n.quantizedEndStep - n.quantizedStartStep) * sec
  return { dur, start }
}

// for visual reference
async function updatePiano (n, dur, wait) {
  const now = Tone.now()
  await nn.sleep((wait - now) * 1000)
  pianoUI.attack(n)
  await nn.sleep(dur * 1000)
  pianoUI.release(n)
}

// create an AI generated melody
async function playMusicVAE () {
  // initialize the model (only once)
  if (!mvae.initialized) await mvae.initialize()

  // create a new series of AI generated notes
  const temp = 1.0 // default
  const samples = await mvae.sample(1, temp)
  // convert to Tone.js friendly values
  const notes = samples[0].notes.map(n => nn.midiToNote(n.pitch))
  const normalizedTimes = normalizeToFirstStart(samples[0].notes)
  const times = normalizedTimes.map(mvaeToTime)

  // display notes in <p> tag
  info.content(notes.join(' - '))

  // play the notes using the synth
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    const time = times[i]
    synth.triggerAttackRelease(note, time.dur, time.start)
    updatePiano(note, time.dur, time.start)
  }
}

// UI
const pianoUI = viz.createPianoUI({
  octaves: [0,8],
  height: 50,
  accentColor: '#0576e8'
})

nn.create('button')
  .content('play MusicVAE')
  .addTo('body')
  .on('click', playMusicVAE)

const info = nn.create('span')
  .content('waiting for data...')
  .addTo('body')
