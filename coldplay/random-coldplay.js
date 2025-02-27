function randomColdplay () {
  // choose new key/scale && tempo
  Tone.Transport.bpm.value = nn.randomInt(90, 140)
  const minor = [2, 1, 2, 2, 1, 2, 2] // aka "aeolian" mode
  const keys = [ 'F', 'D', 'G', 'C', 'D#', 'A#']
  const key = nn.random(keys)
  rightHandScale = createScale(`${key}4`, minor)
  leftHandScale = createScale(`${key}3`, minor)
  // create new arpeggio && chord patterns
  rightHandArp = []
  leftHandChrd = []
  for (let i = 0; i < 4; i++) {
    let a = nn.randomInt(0, 7)
    let b = nn.random() > 0.5 ? a + 2 : a + 3
    let c = nn.random() > 0.5 ? b + 2 : b + 3
    if (b > 7) b = b % 8
    if (c > 7) c = c % 8
    leftHandChrd.push([a, b, c])
    rightHandArp.push([c, b, a, c, b, a, c, b])
  }
}

// don't forget to add this to the end of ur randomize UI button
.on('click', randomColdplay)

// as well as this, so we randomize once soon as the page loads
nn.on('load', randomColdplay)
