const wave = createWaveform()
wave.animate()

const spec = createSpectrum({
  range: [20, 7050]
})
spec.animate()

const osc = new Tone.Oscillator()
osc.frequency.value = 440
osc.type = 'sine'
osc.toDestination()
osc.connect(wave.node)
osc.connect(spec.node)

// new functions
function start () {
  osc.start()
}

function stop () {
  osc.stop()
}

function updateFrequency (e) {
  const freq = e.target.value
  osc.frequency.value = freq
}

nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', start)

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', stop)

// new input range to control frequency
nn.create('input')
  .set({
    type: 'range',
    value: 440,
    min: 440,
    max: 1760
  })
  .addTo('body')
  .on('input', updateFrequency)
