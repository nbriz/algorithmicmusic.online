const synth = new Tone.Synth().toDestination()
const freq = 440

function play () {
  synth.triggerAttackRelease(freq, '8n')
}

nn.create('button')
  .content('play note')
  .addTo('body')
  .on('click', play)
