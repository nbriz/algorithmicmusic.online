const synth = new Tone.Synth().toDestination()

function start () {
  const frequencies = [
    440.00, 493.88, 523.25, 587.33, 659.26, 698.46, 783.99, 880
  ]
  const freq = nn.random(frequencies)
  // triggerAttack takes a frequency or pitch value as it's argument
  synth.triggerAttack(freq)
}

function stop () {
  // triggerRelease does not require any arguments
  synth.triggerRelease()
}

// UI
nn.create('button')
  .content('press && hold')
  .addTo('body')
  .on('mousedown', start)
  .on('mouseup', stop)

// visualizations
const wave = viz.createWaveform()
synth.connect(wave)
