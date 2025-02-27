const reverb = new Tone.Reverb({
  wet: 0.75,
  decay: 5
}).toDestination()

// disconnect the piano from the destination and connect it to reverb instead
piano.connect(reverb)
