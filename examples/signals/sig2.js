const wave = viz.createWaveform()
const osc = new Tone.Oscillator(440).toDestination()
osc.connect(wave)

function play () {
  // choose a random number from 220-880
  const f = nn.random(220, 880)
  // update the osc's frequency value
  osc.set({ frequency: f })
  // play and stop 5 seconds later
  osc.start()
  osc.stop('+0.5')
}

// UI (to trigger play function)
nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)
