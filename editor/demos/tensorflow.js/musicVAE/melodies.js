// load the MusicVAE model
const mvae = new music_vae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small')

// create a Tone.js Synth
const synth = new Tone.PolySynth().toDestination()

// helper function to convert musicVAE sample objects
// into Tone.js friendly duration + start-time values
function mvaeToTime (n) {
  const now = Tone.now()
  const sec = 0.125 // 60s / 120bpm / 4beats
  const start = now + (n.quantizedStartStep * sec)
  const dur = (n.quantizedEndStep - n.quantizedStartStep) * sec
  return { dur, start }
}


async function playMusicVAE () {
  // initialize the model (only once)
  if (!mvae.initialized) await mvae.initialize()

  // create a new series of AI generated notes
  const temp = 1.0 // default
  const samples = await mvae.sample(1, temp)
  // convert to Tone.js friendly values
  const notes = samples[0].notes.map(n => nn.midiToNote(n.pitch))
  const times = samples[0].notes.map(n => mvaeToTime(n))

  // display notes in <p> tag
  info.content(notes.join(' - '))

  // play the notes using the synth
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    const time = times[i]
    synth.triggerAttackRelease(note, time.dur, time.start)
  }
}

// UI (a <button> for run it, and a <p> to display info)
nn.create('button')
  .content('play MusicVAE')
  .addTo('body')
  .on('click', playMusicVAE)

const info = nn.create('p')
  .content('waiting for data...')
  .addTo('body')
