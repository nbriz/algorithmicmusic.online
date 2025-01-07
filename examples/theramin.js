const wave = createWaveform()
wave.animate()

const osc = new Tone.Oscillator()
osc.frequency.value = 440
osc.type = 'sine'
osc.toDestination()
osc.connect(wave.node)

function start () {
  osc.start()
}

function stop () {
  osc.stop()
}

function update (e) {
  const freq = nn.map(e.x, 0, nn.width, 220, 7050)
  const vol = nn.map(e.y, 0, nn.height, 0, -80)
  osc.frequency.value = freq
  osc.volume.value = vol
}

nn.on('mousedown', start)
nn.on('mouseup', stop)
nn.on('mousemove', update)
