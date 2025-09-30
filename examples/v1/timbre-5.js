const wave = createWaveform()

const spec = createSpectrum({
  range: [20, 7050]
})

const osc = new Tone.Oscillator()
osc.frequency.value = 440
osc.type = 'sine'
osc.toDestination()
osc.connect(wave)
osc.connect(spec)

function play () {
  osc.start()
  osc.stop('+0.5')
}

nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)
