/* global Netitor, Tone, ABCJS, nn */
window.utils = {}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// page initialization function
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.utils.init = function () {
  if (document.querySelector('.loader')) window.utils.loader()

  // update any <span class="hotkey" data-key="C"></span> with platform hotkey
  nn.getAll('.hotkey').forEach(hk => {
    const key = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
    hk.textContent = `${key} + ${hk.dataset.key}`
  })

  // setup light/dark mode
  const colorMode = document.querySelector('.color-mode-switch')
  const currentTheme = window.localStorage.getItem('theme') || 'light'

  const updateAllCustomElements = (theme) => {
    const amElements = document.querySelectorAll('am-button, am-switch, am-range, adsr-ui')
    amElements.forEach(ele => {
      if (ele && ele.updateTheme) ele.updateTheme(theme)
      else if (ele.setAttribute) ele.setAttribute('theme', theme)
    })
  }

  const updateAllEditors = (theme) => {
    if (window.editors instanceof Array) {
      window.editors.forEach(e => window.utils.updateEditorTheme(e, theme))
    }
  }

  const goDark = () => {
    document.body.classList.add('dark-mode')
    nn.get('main-menu').updateTheme('dark')
    updateAllEditors('dark')
    updateAllCustomElements('dark')
  }

  const goLight = () => {
    document.body.classList.remove('dark-mode')
    nn.get('main-menu').updateTheme('light')
    updateAllEditors('light')
    updateAllCustomElements('light')
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

  // if (!window.localStorage.getItem('theme')) {
  //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  //   if (prefersDark) {
  //     window.localStorage.setItem('theme', 'dark')
  //     colorMode.querySelector('input').checked = true
  //     goDark()
  //   } else goLight()
  // } else {
  //   if (currentTheme === 'dark') {
  //     colorMode.querySelector('input').checked = true
  //     goDark()
  //   } else goLight()
  // }

  if (currentTheme === 'dark') {
    colorMode.querySelector('input').checked = true
    goDark()
  } else goLight()
}

window.utils.loader = function () {
  const svgWidth = 100 // SVG width in viewBox units
  const svgHeight = 100 // SVG height in viewBox units
  const amplitude = 20 // Wave amplitude
  const frequency = 2 // Number of waves within the SVG width
  const speed = 0.1 // Animation speed

  const ele = document.querySelector('.loader')
  const path = document.getElementById('loader-wave-path')
  let offset = 0 // Offset for animation

  function updateWave () {
    let d = ''
    for (let x = 0; x <= svgWidth; x++) {
      const y = svgHeight / 2 + amplitude * Math.sin((x / svgWidth) * frequency * 2 * Math.PI + offset)
      d += x === 0 ? `M ${x},${y}` : ` L ${x},${y}`
    }
    path.setAttribute('d', d) // Update the path
    offset += speed // Increment the offset
  }

  const interval = setInterval(updateWave, 1000 / 60)

  window.addEventListener('load', () => {
    setTimeout(() => {
      clearInterval(interval)
      // scroll to correct spot based on URL
      if (window.location.hash) window.location = window.location.hash
      else window.scrollTo(0, 0)
      // update editors with theme after they've loaded
      const theme = window.localStorage.getItem('theme') || 'light'
      if (window.editors instanceof Array) {
        window.editors.forEach(e => window.utils.updateEditorTheme(e, theme))
      }
      // fade loader out
      ele.style.opacity = 0
      setTimeout(() => { ele.style.display = 'none' }, 1000)
    }, 1000)
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
// 0
  '',
// 1: vanilla
`<script>
{{code}}
</script>`,
// 2: tone + nn
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>
<script>
/* global Tone, nn */
{{code}}
</script>`,
// 3: tone + nn + d3 + visual functions
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js?v=1"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js"></script>
<script>
/* global Tone, nn, d3, createWaveform, createSpectrum */
{{code}}
</script>`,
// 4: tone
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script>
/* global Tone */
{{code}}
</script>`,
// 5: d3
`<body></body>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script>
/* global d3 */
{{code}}
</script>`,
// 6: d3 + visual functions
`<body></body>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js?updated=3"></script>
<script>
/* global d3, createWaveform, createSpectrum */
{{code}}
</script>`,
// 7: nn + d3 + visual functions
`<body></body>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js?v=1"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js?updated=3"></script>
<script>
/* global nn, d3, createWaveform, createSpectrum */
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

window.utils.updateEditorTheme = function (e, theme) {
  const src = {
    'run code': '/images/run',
    'copy code': '/images/copy',
    'open code in netnet': '/images/open-out',
    'download code': '/images/download'
  }
  e.ne.theme = theme === 'light' ? 'moz-light' : 'moz-dark'
  e.ne.background = false
  e.ele.querySelectorAll('.code-controls img').forEach(icon => {
    let path = src[icon.getAttribute('alt')]
    if (theme === 'dark') path += '-white'
    icon.src = `${path}.svg`
  })
}

window.utils.createCodeEditor = function (opts) {
  const ele = document.querySelector(opts.ele)
  const total = opts.total || 1
  const fileprefix = opts.fileprefix

  let index = opts.index
  if (total > 1) {
    index = index || 1
  } else {
    index = ''
  }

  // let template = opts.template
  let template
  if (typeof opts.template === 'number') {
    template = opts.template
  } else if (opts.template instanceof Array) {
    if (typeof index === 'number') {
      template = opts.template[index - 1]
    } else if (!index || index === '') {
      template = opts.template[0]
    }
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
      <span class="code-title">${opts.title} ${index} / ${total}</span> |
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
    autoUpdate: false,
    renderWithErrors: true,
    background: false,
    theme: 'moz-light',
    language: 'html',
    wrap: true
  })

  const title = ele.querySelector('.code-title')
  const nextBtn = ele.querySelector('.code-info .next')
  const prevBtn = ele.querySelector('.code-info .prev')

  function update (val, nojump) {
    window.utils.loadExample({
      example: fileprefix + val,
      editor: ne,
      template: template,
      info: ele.querySelector('.content > p')
    })
    title.innerHTML = `${opts.title} ${index} / ${total}`
    if (!nojump) window.location.hash = opts.ele
    setTimeout(() => ne.update(), 200)
  }

  function next () {
    index++; if (index > total) index = 1
    if (opts.template) template = opts.template[index - 1]
    update(index)
  }

  function prev () {
    index--; if (index < 1) index = total
    if (opts.template) template = opts.template[index - 1]
    update(index)
  }

  update(index, true)

  const ctrl = ele.querySelector('.code-controls')
  window.utils.setupCodeControls(ctrl, ne)

  if (total === 1) {
    ele.querySelector('.code-info nav').style.display = 'none'
    ele.querySelector('.code-info .small-note').style.display = 'none'
  } else {
    nextBtn.addEventListener('click', next)
    prevBtn.addEventListener('click', prev)
  }

  const obj = { ne, ele, update, next, prev }
  if (!window.editors) window.editors = []
  window.editors.push(obj)

  return obj
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
// ~~~~ ADSR WIDGET + CODE EDITOR ~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

window.utils.creaeteADSRWidget = function (parent) {
  const ele = nn.create('div')
    .css({ display: 'flex' })
    .set('class', 'adsr-widget-row')
    .content(`<adsr-ui style="padding: 0"></adsr-ui>
    <div class="editor" style="margin-top: 159px;"></div>`)
    .addTo(parent)

  function generateCode (a, d, s, r) {
    return `const synth = new Tone.Synth({
  oscillator: {
    type: 'triangle'
  },
  envelope: {
    attack: ${a},
    decay: ${d},
    sustain: ${s},
    release: ${r}
  }
})`
  }

  const ne = new Netitor({
    ele: ele.querySelector('.editor'),
    autoUpdate: false,
    background: false,
    theme: 'moz-light',
    language: 'javascript',
    readOnly: true,
    wrap: true,
    code: generateCode(0.005, 0.1, 0.3, 1)
  })

  const obj = { ne, ele }
  if (!window.editors) window.editors = []
  window.editors.push(obj)

  const adsr = ele.querySelector('adsr-ui')
  adsr.onChange(v => {
    const rnd = (n) => Math.round(n * 100) / 100
    const a = rnd(v.attack)
    const d = rnd(v.decay)
    const s = rnd(v.sustain)
    const r = rnd(v.release)
    ne.code = generateCode(a, d, s, r)
  })
  return { ele, ne }
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
