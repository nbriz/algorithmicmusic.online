const ctx = new window.AudioContext()
const wave = viz.createWaveform({ audioCtx: ctx })

// function to load a new file and play it
async function playClip (path) {
  // load an mp3 file and extract it's raw data
  const filePath = 'https://algorithmicmusic.online/audios/funky-drummer.mp3'
  const request = await window.fetch(filePath)
  const rawData = await request.arrayBuffer()

  // then we'll create a buffer source node
  const node = ctx.createBufferSource()
  // we use the AudioContext's decodeAudioData method
  // to decode the audio data contained in the buffer
  ctx.decodeAudioData(rawData, (buffer) => {
    // then we set the node's buffer to the decoded buffer
    node.buffer = buffer
  })

  node.connect(ctx.destination)
  node.connect(wave)

  node.start()
}

// UI buttons
nn.create('button')
  .content('play')
  .addTo('body')
  .on('click', playClip)
