// "Poly" means many
const synth = new Tone.PolySynth().toDestination()

function play () {
  const frequencies = [
    440.00, 493.88, 523.25, 587.33, 659.26, 698.46, 783.99, 880
  ]
  const freq = nn.random(frequencies)
  const dur = 2
  synth.triggerAttackRelease(freq, dur)
}

// UI
nn.create('button')
  .content('play note')
  .addTo('body')
  .on('click', play)

// visualizations
const wave = viz.createWaveform()
synth.connect(wave)
