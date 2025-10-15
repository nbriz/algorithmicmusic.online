// visualizations
const wave = viz.createWaveform()
// this osc generates a sine wave at 440 Hz
const osc = new Tone.Oscillator(440)
// our graph
osc.toDestination()
osc.connect(wave)
/*
  osc --> 🔈
    `---> 🖥️
*/

// function to play Oscillator for 0.5 seconds
function play () {
  osc.start()
  osc.stop('+0.5')
}

// UI (to trigger play function)
nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)
