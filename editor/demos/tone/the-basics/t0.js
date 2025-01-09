const osc = new Tone.Oscillator(440, 'sine').toDestination()

// start playing as soon as we run our code
osc.start()
// stop playing half a second later
osc.stop('+0.5')
