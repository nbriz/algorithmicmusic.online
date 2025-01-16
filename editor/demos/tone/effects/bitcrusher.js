/*
  More info can be found on the Tone.js docs for the [BitCrusher](https://tonejs.github.io/docs/15.0.4/classes/BitCrusher.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.BitCrusher()

osc.connect(effect)
effect.toDestination()

function updateBits (e) {
  const val = e.target.value
  blabel.content(`bits: ${val}`)
  effect.set({ bits: val })
}

nn.create('input')
  .set('type', 'checkbox')
  .addTo('body')
  .on('change', (e) => {
    if (e.target.checked) osc.start()
    else osc.stop()
  })

nn.create('label')
  .content('toggle (on/off)')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 1, max: 16, value: 4 })
  .addTo('body')
  .on('input', updateBits)

const blabel = nn.create('label')
  .content('bits: 4')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 1 })
  .addTo('body')
  .on('input', (e) => {
    mlabel.content(`mix: ${e.target.value}`)
    effect.set({ wet: e.target.value })
  })

const mlabel = nn.create('label')
  .content('mix: 1')
  .addTo('body')

// Visualization
const wave = createWaveform()
const spec = createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
