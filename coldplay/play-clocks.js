function play (time) {
  // get current step && bar index
  const s = step % totalSteps
  const b = bar % totalBars

  // play left hand chord
  if (s === 0) {
    const chord = leftHandChrd[b]
    const notes = chord.map(i => leftHandScale[i])
    piano.triggerAttackRelease(notes, '1n', time)
  }

  // play right hand arpeggio
  const arp = rightHandArp[b]
  const notes = arp.map(i => rightHandScale[i])
  const note = notes[s]
  piano.triggerAttackRelease(note, '8n', time)

  // some visual feedbak
  const hue = nn.randomInt(190, 230) // shade of blue
  const saturation = nn.randomInt(25, 65)
  nn.get('body').css({
    backgroundColor: `hsl(${hue}deg, ${saturation}%, 50%)`
  })

  // update step/bar for next play call
  step++
  if (s === totalSteps - 1) bar++
}
