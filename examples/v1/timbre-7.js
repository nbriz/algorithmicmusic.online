const wave = createWaveform()

const spec = createSpectrum({
  range: [20, 7050]
})

const osc = new Tone.Oscillator()
osc.frequency.value = 440
osc.type = 'custom' // custom wave shape
osc.partials = [1, 0.2, 0.01, 0.2, 1] // level for each harmonic
osc.toDestination()
osc.connect(wave)
osc.connect(spec)

// we've sapped the "play" function for a "toggle" function
function toggle (e) {
  const play = e.target.checked
  if (play) osc.start()
  else osc.stop()
}

// we've also swapped the button for a checkbox
nn.create('input')
  .addTo('body')
  .set({ type: 'checkbox' })
  .on('change', toggle)

// and added a label for clarity
nn.create('label')
  .content(' toggle on/off')
  .addTo('body')
