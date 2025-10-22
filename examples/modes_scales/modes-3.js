Tone.getContext().lookAhead = 0.01 // adjust latency

const wave = viz.createWaveform()
const synth = new Tone.PolySynth().toDestination()
synth.connect(wave)

// first we'll arbitrarily choose the "ionian" mode to create a "major" scale
const mode = nn.modes.ionian
// then we'll create a scale for our "bass" notes
// this time using the nn library's built in createScale method
const bassScale = nn.createScale('C2', mode)
// then we'll create a matching scale for our "lead" notes
const leadScale = nn.createScale('C4', mode)

// we'll use this to keep track of which notes we're playing
const keysPressed = {}
let noteIndex = 0

// lastly, we'll create a similar attack/release functions
// as we did in our other keyboard examples

function attack (e) {
  if (e.key === 'a' && !keysPressed.a) {
    // if we press 'a', play the bass note
    const note = bassScale[noteIndex % bassScale.length]
    noteIndex++
    synth.triggerAttack(note)
    keysPressed.a = note
  } else if (e.key === 's' && !keysPressed.s) {
    // if we press 's' play "improvised" lead note
    const note = nn.random(leadScale)
    synth.triggerAttack(note)
    keysPressed.s = note
  }
}

// here we do the inverse of the function above
function release (e) {
  if (e.key === 'a' && keysPressed.a) {
    synth.triggerRelease(keysPressed.a)
    delete keysPressed.a
  } else if (e.key === 's' && keysPressed.s) {
    synth.triggerRelease(keysPressed.s)
    delete keysPressed.s
  }
}

// UI
nn.create('label').content('press the "a" and "s" keys to play').addTo('body')

nn.on('keydown', attack)
nn.on('keyup', release)
