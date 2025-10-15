const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })

const lfo = new Tone.LFO({
  frequency: 2, // modulation rate in Hz
  min: 0, // min volume
  max: 1 // max volume
})
const osc = new Tone.Oscillator(440)
const gain = new Tone.Gain(0.75)
// our graph
lfo.connect(gain.gain)
osc.connect(gain)
gain.toDestination()
gain.connect(wave)
gain.connect(spec)
/*
          lfo (modulating gain's gain)
           |
  osc --> gain --> 🔈 (destination)
             `---> 🖥️ (wave/spec)
*/

function toggle () {
  if (this.checked) {
    osc.start()
    lfo.start()
  } else {
    osc.stop()
    lfo.stop()
  }
}

function adjustDepth () {
  lfo.set({ min: 1 - this.value, max: 1 })
  depthLabel.content(`rate: ${this.value}`)
}

function adjustRate (e) {
  lfo.set({ frequency: this.value })
  rateLabel.content(`rate: ${this.value}`)
}

// UI
nn.create('input')
  .addTo('body')
  .set({ type: 'checkbox' })
  .on('change', toggle)

nn.create('label')
  .content('toggle start/stop')
  .addTo('body')

nn.create('br').addTo('body') // line break

nn.create('input')
  .set({
    type: 'range',
    value: 2,
    min: 0.01,
    max: 10,
    step: 0.1
  })
  .addTo('body')
  .on('input', adjustRate)

const rateLabel = nn.create('label')
  .content('rate: 2')
  .addTo('body')

nn.create('br').addTo('body') // line break

nn.create('input')
  .set({
    type: 'range',
    value: 0.75,
    min: 0,
    max: 1,
    step: 0.01
  })
  .addTo('body')
  .on('input', adjustDepth)

const depthLabel = nn.create('label')
  .content('depth: 0.75')
  .addTo('body')
