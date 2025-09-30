// Create a GainNode to control the carrier's amplitude
const carrierGain = new Tone.Gain(0.5).toDestination()

// Create the carrier oscillator
const carrier = new Tone.Oscillator({
  frequency: 440,
  type: 'sine',
  phase: 0
})

// Connect carrier to the gain
carrier.connect(carrierGain)

// Create the modulator oscillator
const modulator = new Tone.Oscillator({
  frequency: 220,
  type: 'square',
  phase: 0
});

// Create a GainNode for the modulation depth
const modulationGain = new Tone.Gain(0) // Modulation depth starts at 0
modulator.connect(modulationGain)

// Connect modulation to carrier gain
modulationGain.connect(carrierGain.gain)

// Create the harmonicity multiplier
const harmonicity = new Tone.Multiply(2) // Default harmonicity ratio 2:1
harmonicity.connect(modulator.frequency) // Apply harmonicity to the modulator's frequency
carrier.frequency.connect(harmonicity) // Modulator frequency is based on carrier frequency

// Function to start the AM Oscillator
function startAMOscillator () {
  carrier.start()
  modulator.start()
}

// Function to stop the AM Oscillator
function stopAMOscillator( ) {
  carrier.stop()
  modulator.stop()
}

function updateHarmonicity (e) {
  const val = e.target.value
  harmonicity.value = Number(val)
  harmLabel.content(`Harmonicity (Ratio): ${val}`)
}

function updateModulationDepth (e) {
  const val = e.target.value
  modulationGain.gain.value = Number(val)
  modLabel.content(`Modulation Depth ${val}`)
}

// UI for control
nn.create('button')
  .content('Start')
  .addTo('body')
  .on('click', startAMOscillator)

nn.create('button')
  .content('Stop')
  .addTo('body')
  .on('click', stopAMOscillator)

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0.1, max: 10, step: 0.1, value: 2 })
  .addTo('body')
  .on('input', updateHarmonicity)

const harmLabel = nn.create('label')
  .content('Harmonicity (Ratio)')
  .addTo('body')

nn.create('br').addTo('body')

nn.create('input')
  .set({ type: 'range', min: 0, max: 1, step: 0.01, value: 0 })
  .addTo('body')
  .on('input', updateModulationDepth)

const modLabel = nn.create('label')
  .content('Modulation Depth')
  .addTo('body')

nn.create('br').addTo('body')

// Visualization
const waveAM = createWaveform()
const specAM = createSpectrum({ range: [20, 7040] })
carrierGain.connect(waveAM)
carrierGain.connect(specAM)
