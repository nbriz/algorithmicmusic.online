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

// function to update the wave type
function changeType (e) {
  const v = e.target.value
  osc.type = v
}

nn.create('button')
  .content('play tone')
  .addTo('body')
  .on('click', play)

// input field so user can update wave type
nn.create('input')
  .addTo('body')
  .set({
    type: 'text',
    value: 'sine'
  })
  .on('change', changeType)
