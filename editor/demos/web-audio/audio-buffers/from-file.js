/*

  We can also create an audio buffer by loading data from a file

*/
const ctx = new window.AudioContext()
let soundClip

// a function to load a new file
async function playClip (path) {
  soundClip = await bufferNodeFromFile(path)
  soundClip.connect(wave)
  soundClip.connect(freq)
  soundClip.start()
}

function stopClip () {
  if (soundClip) soundClip.stop()
}

// ------------------------------------------------------
// function to create a new buffer source node from a file
// -------------------------------------------------------
async function bufferNodeFromFile (filePath) {
  // we use the Web's native fetch() function to load the file
  const request = await window.fetch(filePath)
  const rawData = await request.arrayBuffer()

  // then we'll create a buffer source node (as we've done in prior examples)
  const node = ctx.createBufferSource()

  // we use the AudioContext's decodeAudioData method to decode the audio data contained in the buffer
  ctx.decodeAudioData(rawData, (buffer) => {
    // then we set the Buffer Source Node's buffer to the decoded buffer
    node.buffer = buffer
  })

  node.connect(ctx.destination)
  return node
}

// -------------------------------------
// a dictionary of files to choose from
// -------------------------------------
const files = [
  { name: '[--pick a file to load--]' },
  {
    name: 'Gamelan angka 1 Kraton Ngayogyakarta',
    info: 'A recording of Javanese Gamelan music performed by the court musicians of the Royal Palace of the Sultan of Yogyakarta, Excerpt 1. Kraton Ngayogyakarta Hadiningrat, Yogyakarta, Java Indonesia. Recorded using PCM-D50.',
    path: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Gamelan_angka_1_Kraton_Ngayogyakarta.ogg'
  },
  {
    name: 'Footprints In The Snow',
    info: 'A field recording of a musician, Aaron Morgan, playing a mazurka on harmonica, collected by Sidney Robertson Cowell as part of a WPA project to document the music of Northern California in the late 1930s.',
    path: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/FootprintsInTheSnow.ogg'
  },
  {
    name: 'La morena, Son Jarocho',
    info: 'Son de la morena por mayor, grabado en Santiago Tuxtla.',
    path: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/La_morena._Son_Jarocho.wav'
  }
]

// ----------------------------------
// UI + visuals
// ----------------------------------
const wave = createWaveform({ audioCtx: ctx })
const freq = createSpectrum({ audioCtx: ctx, range: [0, 7040] })

const para = nn.create('p').addTo('body')

const select = nn.create('select')
  .set({ options: files.map(f => f.name) })
  .addTo('body')
  .on('input', (e) => {
    stopClip()
    const file = files.find(f => f.name === e.target.value)
    if (file) para.content(file.info)
  })

nn.create('button')
  .content('play')
  .addTo('body')
  .on('click', () => {
    if (select.value !== '[--pick a file to load--]') {
      stopClip()
      const file = files.find(f => f.name === select.value)
      playClip(file.path)
    }
  })

nn.create('button')
  .content('stop')
  .addTo('body')
  .on('click', stopClip)
