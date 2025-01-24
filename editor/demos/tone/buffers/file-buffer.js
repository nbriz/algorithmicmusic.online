const wave = createWaveform()

const player = new Tone.Player()
player.toDestination()
player.connect(wave)

function loadFileToBuffer (file) {
  // we'll use the FileReader API...
  const reader = new window.FileReader()

  // we'll setup the "onload" event listener,
  // to decode the audio data from the file's data
  // and apply it to the player's buffer
  reader.onload = async (e) => {
    const fileData = e.target.result
    const buffer = await Tone.context.decodeAudioData(fileData)
    player.buffer = buffer
  }

  // we'll read the file and trigger the "onload" listener above
  reader.readAsArrayBuffer(file)
}

// we'll create a "file" input type to load audio files from our computer
nn.create('input')
  .set({ type: 'file', accept: 'audio/*' })
  .addTo('body')
  .on('change', () => {
    const file = event.target.files[0]
    if (file) loadFileToBuffer(file)
  })

nn.create('button')
  .content('play')
  .addTo('body')
  .on('click', () => player.start())
