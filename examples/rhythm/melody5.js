const synth = new Tone.PolySynth().toDestination()

let roll // will contain our piano roll

let key, oct, mode // will generate these later
const melody = [] // we'll generate these later

const measures = 4 // aka bar
const beats = 4 // beats per bar

// set Transport details to match above
Tone.Transport.bpm.value = nn.randomInt(90, 240)
Tone.Transport.timeSignature = beats
Tone.Transport.loop = true
Tone.Transport.loopEnd = measures + 'm'

function toggle () {
  if (Tone.Transport.state === 'stopped') {
    Tone.Transport.start()
    this.content('stop')
  } else {
    Tone.Transport.stop()
    this.content('start')
  }
}

function createMelody () {
  // list of possible notes to play
  key = nn.random(nn.notes)
  oct = nn.randomInt(3, 5)
  const root = key + oct
  const modes = Object.keys(nn.modes)
  mode = nn.random(modes)
  const scale = nn.createScale(root, nn.modes[mode])
  // update info label
  label.content(` in the key of ${key} ${mode}`)
  // list of possible note durations
  const durations = ['2n', '4n', '8n', '16n']

  // create piano roll
  roll = viz.createPianoRoll({
    transport: Tone.Transport,
    notes: [key + oct, key + (oct + 1)],
    measures: measures,
    beats: beats
  })

  // loop over every measure/bar
  nn.times(measures, m => {
    melody[m] = [] // create new array for this bar
    // loop over every beat
    nn.times(beats, b => {
      // random probability decies if this beat
      // has a note or has a "rest" (no note)
      const chance = nn.random()
      if (chance < 0.75) {
        // create a random note && its duration
        const pitch = nn.random(scale)
        const dur = nn.random(durations)
        melody[m][b] = { pitch, dur }
        // derive current step && add note to piano roll
        const step = (m * beats) + b
        roll.add(pitch, step, dur)
      } else {
        melody[m][b] = 'rest'
      }
    })
  })
  // log for reference
  console.log(melody)
}

function play (time) {
  const pos = Tone.Transport.position.split(':').map(Number)
  const bar = pos[0]
  const beat = pos[1]
  // choose next note in the melody
  const note = melody[bar][beat]
  // play the lead note (unless it's a rest)
  if (note !== 'rest') {
    synth.triggerAttackRelease(note.pitch, note.dur, time)
  }
  // update piano roll playhead
  roll.update()
}

new Tone.Loop(play).start()

// UI
const toggleBtn = nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', toggle)

const label = nn.create('label')
  .content('notes:')
  .addTo('body')

nn.on('load', createMelody)
