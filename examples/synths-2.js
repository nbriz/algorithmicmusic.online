const synth = new Tone.Synth().toDestination()

function play () {
  const frequencies = [440.00, 493.88, 523.25, 587.33, 659.26, 698.46, 783.99, 880]
  const freq = nn.random(frequencies)// random frquency from list
  const dur = 2 // two seconds
  // triggerAttackRelease combines both triggerAttack and triggerRelease into a single method
  synth.triggerAttackRelease(freq, dur)
}

// UI
nn.create('button')
  .content('play note')
  .addTo('body')
  .on('click', play)

// visualizations
const wave = createWaveform()
synth.connect(wave)
