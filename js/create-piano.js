/*

// set it up like this
// --------------------

const spec = createPianoUI()

// or
const pianoGUI = createPianoUI({
  ele: '#piano-svg', // parent SVG element
  width: 700, // width of the piano
  height: 200, // height of the piano
  accentColor: 'red', // when key is pressed
  labels: true, // show key/note names
  octaves: 2, // number of octaves to render
  on: { // optional event listeners
    mouseover: (n) => console.log(n),
    mousedown: (n) => console.log(n),
    mouseup: (n) => console.log(n),
  }
})

// can also use it like this
// ------------------

piano.attack('C4') // will highlight 'C4' key in accent color
piano.release('C4') // will revert 'C4' key to normal white color

*/
function createPianoUI (options = {}) {
  const defaults = {
    ele: null,
    width: 700,
    height: 200,
    accentColor: 'red',
    labels: false,
    octaves: 4,
    on: {}
  }

  const settings = { ...defaults, ...options }

  // Ensure `ele` is an SVG element
  const ele = typeof settings.ele === 'string'
    ? document.querySelector(settings.ele)
    : document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  if (typeof settings.ele !== 'string') {
    document.body.appendChild(ele)
  } else if (!ele || ele.nodeName.toLowerCase() !== 'svg') {
    console.error('createPianoUI: "ele" expecting reference to <svg> element')
    return
  }

  // Clear any existing content in the SVG
  ele.innerHTML = ''

  // Determine octave range
  const octaveRange = Array.isArray(settings.octaves)
    ? settings.octaves
    : [settings.octaves, settings.octaves + 1]

  // Calculate correct total white keys
  const totalWhiteKeys = (octaveRange[1] - octaveRange[0]) * 7
  const whiteKeyWidth = settings.width / totalWhiteKeys
  // const totalWhiteKeys = settings.octaves * 7
  // const whiteKeyWidth = settings.width / totalWhiteKeys
  const blackKeyWidth = whiteKeyWidth * 0.6
  const blackKeyHeight = settings.height * 0.6

  const keyMap = [
    { note: 'C', isBlack: false }, { note: 'C#', isBlack: true },
    { note: 'D', isBlack: false }, { note: 'D#', isBlack: true },
    { note: 'E', isBlack: false }, { note: 'F', isBlack: false },
    { note: 'F#', isBlack: true }, { note: 'G', isBlack: false },
    { note: 'G#', isBlack: true }, { note: 'A', isBlack: false },
    { note: 'A#', isBlack: true }, { note: 'B', isBlack: false }
  ]

  this.notes = []
  // TODO: keep track of all the rendered notes

  ele.setAttribute('width', settings.width)
  ele.setAttribute('height', settings.height)
  ele.setAttribute('viewBox', `0 0 ${settings.width} ${settings.height}`)

  const keys = {}
  let x = 0 // Position for white keys
  const whiteKeyPositions = []
  const notes = [] // Track all rendered notes

  // **Generate white keys**
  for (let octave = octaveRange[0]; octave < octaveRange[1]; octave++) {
    keyMap.forEach(({ note, isBlack }) => {
      if (!isBlack) {
        createKey(note, octave, x, false)
        whiteKeyPositions.push({ note, octave, x })
        x += whiteKeyWidth
      }
    })
  }

  // **Generate black keys in correct positions**
  whiteKeyPositions.forEach(({ note, octave, x }) => {
    const blackKeyNote = keyMap.find(k => k.note === note + '#' && k.isBlack)
    if (blackKeyNote) {
      createKey(blackKeyNote.note, octave, x + (whiteKeyWidth * 0.7), true)
    }
  })

  function createKey (note, octave, x, isBlack) {
    const keyLabel = `${note}${octave}`
    notes.push({ note, octave, isBlack, x }) // Track keys
    const key = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    key.setAttribute('x', x)
    key.setAttribute('y', 0)
    key.setAttribute('width', isBlack ? blackKeyWidth : whiteKeyWidth)
    key.setAttribute('height', isBlack ? blackKeyHeight : settings.height)
    key.setAttribute('fill', isBlack ? 'black' : 'white')
    key.setAttribute('stroke', 'black')
    key.setAttribute('data-key', keyLabel)

    keys[keyLabel] = key
    ele.appendChild(key)

    // **Add labels**
    if (settings.labels) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', x + (isBlack ? blackKeyWidth / 2 : whiteKeyWidth / 2))
      text.setAttribute('y', isBlack ? blackKeyHeight - 15 : settings.height - 20)
      text.setAttribute('fill', isBlack ? 'white' : 'black')
      text.setAttribute('font-size', isBlack ? '12' : '16')
      text.setAttribute('font-family', 'Arial, sans-serif')
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      text.textContent = keyLabel
      ele.appendChild(text)
    }

    key.addEventListener('mouseover', (e) => settings.on.mouseover?.(keyLabel, e))
    key.addEventListener('mousedown', (e) => {
      settings.on.mousedown?.(keyLabel, e)
      highlightKey(keyLabel)
    })
    key.addEventListener('mouseup', (e) => {
      settings.on.mouseup?.(keyLabel, e)
      resetKey(keyLabel)
    })
  }

  function highlightKey (keyLabel) {
    if (keys[keyLabel]) {
      keys[keyLabel].setAttribute('fill', settings.accentColor)
    }
  }

  function resetKey (keyLabel) {
    if (keys[keyLabel]) {
      const isBlack = keys[keyLabel].getAttribute('height') === `${blackKeyHeight}`
      keys[keyLabel].setAttribute('fill', isBlack ? 'black' : 'white')
    }
  }

  function attackRelease (keyLabel, time) {
    highlightKey(keyLabel)
    setTimeout(() => resetKey(keyLabel), time * 1000)
  }

  function resetAll () {
    notes.forEach(n => resetKey(n.note + n.octave))
  }

  return {
    notes: notes,
    attack: highlightKey,
    release: resetKey,
    attackRelease: attackRelease,
    reset: resetAll
  }
}

window.createPianoUI = createPianoUI
