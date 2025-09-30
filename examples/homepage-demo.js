// variable
const synth = new Tone.Synth().toDestination()

// function
function play () {
  const freq = 440
  synth.triggerAttackRelease(freq, '8n')
}

// UI
nn.create('button')
  .content('play note')
  .addTo('body')
  .on('click', play)
