const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })

const lfo = new Tone.LFO({
  frequency: 2, // modulation rate in Hz
  min: 390, // 440hz - 50
  max: 490  // 440hz + 50
})
const osc = new Tone.Oscillator(440)
const gain = new Tone.Gain(0.75)
// our graph
lfo.connect(osc.frequency)
osc.connect(gain)
gain.toDestination()
gain.connect(wave)
gain.connect(spec)
/*
  lfo (modulating osc freq)
   |
  osc --> gain --> 🔈 (destination)
             `---> 🖥️ (wave/spec)
*/

function toggle () {
  // "this" is the checkbox
  if (this.checked) {
    osc.start()
    lfo.start() // also start LFO
  } else {
    osc.stop()
    lfo.stop() // also stop LFO
  }
}

function adjustLevel () {
  // "this" is the range-slider
  gain.set({ gain: this.value })
}

// when another range slider
// to adjust the LFO's frequency
function adjustRate (e) {
  const rate = Number(this.value)
  lfo.set({ frequency: rate })
  rateLabel.content(`rate: ${rate.toFixed(2)}`)
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
    value: 0.75, // match initial gain value
    min: 0,
    max: 1,
    step: 0.01
  })
  .addTo('body')
  .on('input', adjustLevel)

nn.create('label')
  .content('volume')
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
  .content('rate')
  .addTo('body')
