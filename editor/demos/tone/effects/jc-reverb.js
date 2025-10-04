/*
  More info can be found on the Tone.js docs for the [JCReverb](https://tonejs.github.io/docs/15.0.4/classes/JCReverb.html)
*/

const osc = new Tone.Oscillator(440, 'sine')
const effect = new Tone.JCReverb()

osc.connect(effect)
effect.toDestination()

function updateRoomSize (e) {
  const val = e.target.value
  slabel.content(`roomSize: ${val}`)
  effect.order = Number(val)
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
  .set({ type: 'range', min: 1, max: 10, step: 0.01, value: 0.5 })
  .addTo('body')
  .on('input', updateRoomSize)

const slabel = nn.create('label')
  .content('roomSize: 0.5')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 1 })
  .addTo('body')
  .on('input', (e) => {
    mlabel.content(`mix: ${e.target.value}`)
    effect.wet.value = Number(e.target.value)
  })

const mlabel = nn.create('label')
  .content('mix: 1')
  .addTo('body')

// Visualization
const wave = viz.createWaveform()
const spec = viz.createSpectrum({ range: [20, 7040] })
effect.connect(wave)
effect.connect(spec)
