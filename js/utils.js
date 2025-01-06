/* global Netitor, Tone, ABCJS, nn, ne */
window.utils = {}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// page initialization function
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.utils.init = function () {
  // update any <span class="hotkey" data-key="C"></span> with platform hotkey
  nn.getAll('.hotkey').forEach(hk => {
    const key = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
    hk.textContent = `${key} + ${hk.dataset.key}`
  })

  // setup light/dark mode
  const colorMode = document.querySelector('.color-mode-switch')
  const currentTheme = window.localStorage.getItem('theme')

  const updateAllCustomElements = (theme) => {
    const amElements = document.querySelectorAll('am-button, am-switch, am-range')
    amElements.forEach(ele => {
      if (ele && ele.updateTheme) ele.updateTheme(theme)
      else if (ele.setAttribute) ele.setAttribute('theme', theme)
    })
  }

  const goDark = () => {
    document.body.classList.add('dark-mode')
    if (typeof ne !== 'undefined') ne.theme = 'moz-dark'
    if (typeof ne !== 'undefined') ne.background = false
    nn.get('main-menu').updateTheme('dark')
    updateAllCustomElements('dark')
  }

  const goLight = () => {
    document.body.classList.remove('dark-mode')
    if (typeof ne !== 'undefined') ne.theme = 'moz-light'
    if (typeof ne !== 'undefined') ne.background = false
    nn.get('main-menu').updateTheme('light')
    updateAllCustomElements('light')
  }

  if (!window.localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      colorMode.querySelector('input').checked = true
      window.localStorage.setItem('theme', 'dark')
      goDark()
    }
  } else {
    if (currentTheme === 'dark') goDark()
    else goLight()
  }

  colorMode.querySelector('input').addEventListener('input', () => {
    if (document.body.classList.contains('dark-mode')) goLight()
    else goDark()
    // Save the user's preference in localStorage
    if (document.body.classList.contains('dark-mode')) {
      window.localStorage.setItem('theme', 'dark')
    } else {
      window.localStorage.setItem('theme', 'light')
    }
  })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// convert M && A's to symbols
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.utils.formatText = function (element) {
  if (typeof element === 'string') {
    element = document.querySelector(element)
  }

  if (!element || !(element instanceof window.HTMLElement)) {
    console.error('Invalid input: Please provide a valid HTML element.')
    return
  }

  function processText (text) {
    // Convert text to lowercase, then replace 'a' and 'm' with their uppercase versions
    return text.toLowerCase().replace(/a/g, 'A').replace(/m/g, 'M')
  }

  function recursiveTransform (node) {
    if (node.nodeType === window.Node.TEXT_NODE) {
      // Update the text content of text nodes
      node.textContent = processText(node.textContent)
    } else if (node.nodeType === window.Node.ELEMENT_NODE) {
      // Recursively process child nodes for element nodes
      Array.from(node.childNodes).forEach(recursiveTransform)
    }
  }

  recursiveTransform(element)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// code example / netitor utils
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let codeTemplate = 0
const codeTemplates = [
  '',
`<script>
{{code}}
</script>`,
`<body></body>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>
<script src="http://unpkg.com/tone"></script>
<script>
/* global Tone, nn */
{{code}}
</script>`
]

window.utils.loadExample = async function ({ example, editor, template, info }) {
  codeTemplate = template || 0
  const ext = template ? 'js' : 'html'
  const res = await window.fetch(`/examples/${example}.${ext}`)
  const code = await res.text()
  editor.code = code

  if (template) {
    editor.language = 'javascript'
    editor.update(codeTemplates[codeTemplate])
  } else {
    editor.langauge = 'html'
  }

  if (info) {
    try {
      const res = await window.fetch(`/examples/${example}.txt`)
      if (res.status >= 200 && res.status < 300) {
        const txt = await res.text()
        if (typeof info === 'string') nn.get(info).content(txt)
        else if (info instanceof window.HTMLElement) info.innerHTML = txt
      }
    } catch (err) {
      // ignore error
    }
  }
}

window.utils.setupCodeControls = function (c, ne) {
  // setup hover labels
  c.querySelectorAll('img').forEach(img => {
    const label = c.querySelector('label')
    img.addEventListener('mouseover', () => { label.textContent = img.alt })
    img.addEventListener('mouseout', () => { label.textContent = '' })
  })

  const getCode = () => {
    let code = ne.code
    if (codeTemplate > 0) {
      code = codeTemplates[codeTemplate]
      code = code.replace('{{code}}', ne.code)
    }
    return code
  }
  // setup click events
  c.querySelector('img[alt="run code"]').addEventListener('click', () => ne.update())
  c.querySelector('img[alt="copy code"]').addEventListener('click', () => {
    const textarea = document.createElement('textarea')
    textarea.value = getCode()
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    c.querySelector('label').textContent = 'code copied to your clipboard!'
  })
  c.querySelector('img[alt="open code in netnet"]').addEventListener('click', () => {
    const data = ne._encode(getCode())
    window.open('https://netnet.studio?layout=dock-left#code/' + data)
    c.querySelector('label').textContent = ''
  })
  c.querySelector('img[alt="download code"]').addEventListener('click', () => {
    const blob = new window.Blob([getCode()], { type: 'text/html' })
    const link = document.createElement('a')
    link.download = 'index.html'
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
    c.querySelector('label').textContent = 'code saved to your downloads folder!'
  })
}

window.utils.createCodeEditor = function (opts) {
  const ele = document.querySelector(opts.ele)
  const total = opts.total || 1
  const fileprefix = opts.fileprefix
  const template = opts.template

  let index = opts.index
  if (total > 1) {
    index = index || 1
  } else {
    index = ''
  }

  ele.innerHTML = `
  <div class="code-controls">
    <!-- SVG icons (slightly modified) by Meko https://thenounproject.com/creator/MekoDa/ -->
    <img src="/images/run.svg" alt="run code">
    <img src="/images/copy.svg" alt="copy code">
    <img src="/images/open-out.svg" alt="open code in netnet">
    <img src="/images/download.svg" alt="download code">
    <label></label>
  </div>

  <section class="code-example">
    <div class="editor"></div>
    <div class="render"></div>
  </section>

  <section class="code-info">
    <nav>
      <span class="link prev">◀◀ prev</span> |
      <span class="formatted-text">${opts.title}</span> |
      <span class="link next">next ▶▶</span>
    </nav>
    <p class="small-note">(click the "prev" and "next" links to cycle through code examples and their explinations below)</p>
    <div class="content">
      <p></p>
    </div>
  </section>
  `

  const ne = new Netitor({
    ele: ele.querySelector('.editor'),
    render: ele.querySelector('.render'),
    autoUpdate: true,
    renderWithErrors: true,
    background: false,
    theme: 'moz-light',
    language: 'html',
    wrap: true
  })

  function update (val, nojump) {
    window.utils.loadExample({
      example: fileprefix + val,
      editor: ne,
      template: template,
      info: ele.querySelector('.content > p')
    })
    if (!nojump) window.location.hash = opts.ele
  }

  function next () {
    index++; if (index > total) index = 1
    update(index)
  }

  function prev () {
    index--; if (index < 1) index = total
    update(index)
  }

  update(index, true)

  const ctrl = ele.querySelector('.code-controls')
  window.utils.setupCodeControls(ctrl, ne)

  if (total === 1) {
    ele.querySelector('.code-info nav').style.display = 'none'
    ele.querySelector('.code-info .small-note').style.display = 'none'
  } else {
    ele.querySelector('.code-info .next').addEventListener('click', next)
    ele.querySelector('.code-info .prev').addEventListener('click', prev)
  }

  return { ne, update, next, prev }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// convert a sequence of {note, len, play} objects to an ABC.js string
// assumes 4/4 measure, 4n interval && key of C
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.utils.generateAbcFromSequence = function (sequence) {
  const meter = '4/4' // Time signature
  const defaultNoteLength = '1/4' // Quarter note as the default
  const key = 'C' // Key signature

  // Helper to convert `len` values into explicit ABC durations
  function convertLenToAbcDuration (len) {
    const match = len.match(/^(\d+)([ntr])$/)
    if (!match) {
      throw new Error(`Invalid duration format: ${len}`)
    }
    const [_, number, type] = match

    // Convert note length into fractions of a whole note
    switch (type) {
      case 'n': // Standard note
        return `/${number}` // Always append the duration explicitly
      case 't': // Triplets
        return `/${Math.floor((4 / number) * 3 / 2)}`
      case 'r': // Dotted notes
        return `/${(4 / number) * 1.5}`
      default:
        throw new Error(`Unknown duration type: ${type}`)
    }
  }

  // Map sequence to ABC notes
  const notes = sequence.map(item => {
    if (item.note === null) return 'z' // Rest
    const duration = convertLenToAbcDuration(item.len)
    return `${item.note}${duration}`
  })

  // Split notes into measures of 4 beats each
  const measures = []
  let currentMeasure = []
  let currentBeatCount = 0

  for (const note of notes) {
    currentMeasure.push(note)
    currentBeatCount += 1 // Each note hits on the beat

    if (currentBeatCount >= 4) {
      measures.push(currentMeasure.join(' '))
      currentMeasure = []
      currentBeatCount = 0
    }
  }
  if (currentMeasure.length > 0) {
    measures.push(currentMeasure.join(' '))
  }

  // Construct the final ABC string
  return `
X:1
M:${meter}
L:${defaultNoteLength}
K:${key}
${measures.join(' | ')} |
  `
}

window.utils.highlightABCNote = function (sequence, step, colors) {
  colors = colors || { main: 'black', selected: 'red' }
  const interval = '4n'
  const intervalParts = parseInt(interval.replace('n', ''))

  // Reset previously highlighted elements
  document.querySelectorAll('g[data-index]').forEach(g => {
    if (g.getAttribute('fill') === colors.selected) {
      g.setAttribute('fill', colors.main)
    }
  })

  // Scan the sequence to find notes that bleed into the current step
  sequence.forEach((noteObj, index) => {
    if (noteObj && noteObj.note) {
      const { len } = noteObj
      const noteParts = parseInt(len.replace('n', ''))
      const startStep = index
      const fillSteps = Math.ceil(intervalParts / noteParts)

      // Check if the note spans into the current step
      if (step >= startStep && step < startStep + fillSteps) {
        // Highlight the element corresponding to the current step
        const element = document.querySelector(`g[data-index="${startStep}"]`)
        if (element) {
          element.setAttribute('fill', colors.selected)
        }
      }
    }
  })
}

window.utils.resizeABC = function (svg, newWidth) {
  const svgElement = document.querySelector(svg)
  if (!svgElement) {
    console.error('SVG element not found!')
    return
  }

  // Add the viewBox attribute if it's missing
  if (!svgElement.hasAttribute('viewBox')) {
    const width = svgElement.getAttribute('width').replace('px', '')
    const height = svgElement.getAttribute('height').replace('px', '')
    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }

  // Get the original viewBox dimensions
  const viewBox = svgElement.getAttribute('viewBox')
  const [x, y, originalWidth, originalHeight] = viewBox.split(' ').map(Number)

  // Calculate the new height while maintaining aspect ratio
  const aspectRatio = originalHeight / originalWidth
  const newHeight = newWidth * aspectRatio

  // Update the viewBox to scale proportionally
  svgElement.setAttribute('viewBox', `${x} ${y} ${originalWidth} ${originalHeight}`)

  // Update the width and height of the SVG
  svgElement.setAttribute('width', `${newWidth}px`)
  svgElement.setAttribute('height', `${newHeight}px`)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// function for title screen music ~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.utils.ranTitleMoozak = function () {
  const synth = new Tone.PolySynth().toDestination()
  const state = {
    step: 0,
    bpm: 120,
    interval: '4n',
    measure: [4, 4],
    sequence: []
  }

  const clrs = { main: 'var(--text-color)', selected: 'var(--accent-color1)' }

  function toggle () {
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start()
    }
  }

  function createSequence () {
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', null]
    const lens = ['2n', '4n', '8n', '16n', ]
    for (let i = 0; i < 8; i++) {
      const obj = {}
      obj.note = nn.random(notes)
      if (obj.note !== null) obj.note += '4' // nn.randomInt(4, 5)
      obj.len = nn.random(lens)
      state.sequence.push(obj)
    }
    // console.log(state.sequence)
    const abcString = window.utils.generateAbcFromSequence(state.sequence)
    ABCJS.renderAbc('title-sheet-music', abcString)
    // console.log(abcString)
  }

  function randomize () {
    let momentPause = false
    state.sequence = [] // clear the last sequence
    if (Tone.Transport.state === 'started') {
      Tone.Transport.stop()
      momentPause = true
    }
    createSequence()
    if (momentPause) Tone.Transport.start()
    window.utils.resizeABC('#title-sheet-music > svg', nn.width * 0.75)
    Tone.Transport.bpm.value = nn.randomInt(120, 140)
  }

  function play (time) {
    const index = state.step % state.sequence.length
    const obj = state.sequence[index]
    if (obj.note !== null) {
      synth.triggerAttackRelease(obj.note, obj.len, time)
    }
    window.utils.highlightABCNote(state.sequence, index, clrs)
    state.step++
    if (state.step >= state.sequence.length) {
      state.step = 0
      // stop scheduler playback
      Tone.Transport.stop()
      // clear any highlighted notes
      setTimeout(() => {
        document.querySelectorAll('g[data-index]').forEach(g => {
          if (g.getAttribute('fill') === clrs.selected) {
            g.setAttribute('fill', clrs.main)
          }
        })
      }, 600)
    }
  }

  Tone.Transport.bpm.value = state.bpm
  Tone.Transport.timeSignature = state.measure
  Tone.Transport.scheduleRepeat(time => play(time), state.interval)

  createSequence()

  return { toggle, play, state, randomize }
}