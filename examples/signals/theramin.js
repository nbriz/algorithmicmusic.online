// a trackpad theramin
const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })

const osc = new Tone.Oscillator(440)
const gain = new Tone.Gain(0.75)
// our graph
osc.connect(gain)
gain.toDestination()
gain.connect(wave)
gain.connect(spec)
/*
  osc --> gain --> 🔈 (destination)
             `---> 🖥️ (wave/spec)
*/

function update () {
  const freq = nn.map(nn.mouseX, 0, nn.width, 220, 7040)
  const vol = nn.map(nn.mouseY, 0, nn.height, 0.001, 1)
  osc.set({ frequency: freq })
  gain.set({ gain: vol })
}

nn.on('mousedown', () => osc.start())
nn.on('mouseup', () => osc.stop())
nn.on('mousemove', update)
