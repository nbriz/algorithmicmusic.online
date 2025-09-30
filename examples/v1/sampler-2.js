const aaah = 'https://upload.wikimedia.org/wikipedia/commons/6/65/Open_front_unrounded_vowel.ogg'
const sampler = new Tone.Sampler({
  urls: { 'C4': aaah }
})

sampler.toDestination()

nn.create('label')
  .content('use the "q" through "i" keys to play the  sampler')
  .addTo('body')

// here we've created a map or dictionary which assigns an object { freq, pressed } to a series of letters representing keys on our key board
const keyMap = {
  q: { note: 'C4', pressed: false },
  w: { note: 'D4', pressed: false },
  e: { note: 'E4', pressed: false },
  r: { note: 'F4', pressed: false },
  t: { note: 'G4', pressed: false },
  y: { note: 'A5', pressed: false },
  u: { note: 'B5', pressed: false },
  i: { note: 'C5', pressed: false }
}

function attack (e) {
  // select the object from the keyMap matching the key pressed
  const obj = keyMap[e.key]
  // if we found an object and it is "not" pressed...
  if (obj && !obj.pressed) {
    // ...then trigger the frequency
    sampler.triggerAttack(obj.note)
    obj.pressed = true
  }
}

// here we do the inverse of the function above
function release (e) {
  const obj = keyMap[e.key]
  if (obj && obj.pressed) {
    sampler.triggerRelease(obj.note)
    obj.pressed = false
  }
}

// events listeners
nn.on('keydown', attack)
nn.on('keyup', release)

// visualizations
const wave = createWaveform()
sampler.connect(wave)
