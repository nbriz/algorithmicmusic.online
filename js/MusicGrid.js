class MusicGrid {
  constructor (opts) {
    opts = opts || {}
    this.size = opts.size || 10
    this.interval = opts.interval || '4n'
    this.measure = opts.measure || [4, 4]
    this.sequence = opts.sequence || []
    this.rows = opts.rows || 15
    this.centerNote = opts.center || 'C4'
    this.columnsPerMeasure = this.calculateColumnsPerMeasure()
    this.columns = Math.max(this.columnsPerMeasure * this.measure[0], this.sequence.length)
    this.width = (this.columns + 1) * this.size + 1 // Add extra column for note names
    this.height = this.rows * this.size + 1
    this.ele = document.querySelector(opts.ele || 'body')
    this.colors = {}
    opts.colors = opts.colors || {}
    this.colors.main = opts.colors.main || '#000'
    this.colors.selected = opts.colors.selected || '#f00'

    // Create a canvas element
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    // Append canvas to the body or a container
    this.ele.appendChild(this.canvas)

    this.drawGrid()
    this.drawNoteLabels()
    this.drawSequence()
  }

  calculateColumnsPerMeasure () {
    const beatUnit = this.measure[1] // The note value that represents one beat (e.g., 4 for a quarter note)
    const intervalParts = parseInt(this.interval.replace('n', '')) // Get the note subdivision
    const subdivisionsPerBeat = intervalParts / beatUnit
    return subdivisionsPerBeat * this.measure[0]
  }

  drawGrid () {
    const { ctx, columns, rows, size, width, height, columnsPerMeasure } = this

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Set grid line color
    ctx.strokeStyle = this.colors.main

    // Draw vertical grid lines
    for (let x = 1; x <= columns + 1; x++) { // Skip the first column
      ctx.beginPath()
      ctx.lineWidth = ((x - 1 > 0) && ((x - 1) % columnsPerMeasure === 0)) ? 2 : 1 // Thicker lines at measure boundaries
      ctx.moveTo(x * size + 0.5, 0) // Offset by 0.5 pixels
      ctx.lineTo(x * size + 0.5, height)
      ctx.stroke()
    }

    // Draw horizontal grid lines
    ctx.lineWidth = 1
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * size + 0.5) // Offset by 0.5 pixels
      ctx.lineTo(width, y * size + 0.5)
      ctx.stroke()
    }
  }

  drawNoteLabels () {
    const { ctx, rows, size, centerNote } = this
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const centerOctave = parseInt(centerNote.match(/\d+/)[0])
    const centerNoteIndex = noteNames.indexOf(centerNote.replace(/\d+/g, ''))
    const middleRow = Math.floor(rows / 2)
    const fontSize = size * 0.4

    ctx.font = `${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = this.colors.main

    for (let i = 0; i < rows; i++) {
      const offset = middleRow - i
      const noteIndex = (noteNames.length + centerNoteIndex - offset) % noteNames.length
      const octave = centerOctave - Math.floor((centerNoteIndex - offset) / noteNames.length)
      const noteLabel = `${noteNames[noteIndex]}${octave}`

      const x = size / 2
      const y = i * size + size / 2

      ctx.fillText(noteLabel, x, y)
    }
  }

  drawSequence () {
    const { ctx, sequence, size, interval, colors } = this
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const centerNote = this.centerNote
    const centerOctave = parseInt(centerNote.match(/\d+/)[0])
    const centerNoteIndex = noteNames.indexOf(centerNote.replace(/\d+/g, ''))
    const middleRow = Math.floor(this.rows / 2)
    const intervalParts = parseInt(interval.replace('n', ''))

    sequence.forEach((noteObj, index) => {
      if (noteObj.note === null) return

      const { note, len } = noteObj
      const noteParts = parseInt(len.replace('n', ''))
      const noteIndex = noteNames.indexOf(note.replace(/\d+/g, ''))
      const noteOctave = parseInt(note.match(/\d+/)[0])
      const rowIndex = middleRow - (centerNoteIndex - noteIndex) - 12 * (noteOctave - centerOctave)
      const colIndex = index
      const fillRatio = intervalParts / noteParts

      // Draw the note in the grid
      ctx.fillStyle = colors.main
      for (let i = 0; i < Math.ceil(fillRatio); i++) {
        const width = (i === Math.floor(fillRatio)) ? (fillRatio % 1) * size : size
        ctx.fillRect((colIndex + 1 + i) * size, rowIndex * size, width, size)
      }
    })
  }

  highlightStep (step, line = false) {
    const { ctx, sequence, size, interval, colors, rows } = this
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const centerNote = this.centerNote
    const centerOctave = parseInt(centerNote.match(/\d+/)[0])
    const centerNoteIndex = noteNames.indexOf(centerNote.replace(/\d+/g, ''))
    const middleRow = Math.floor(this.rows / 2)
    const intervalParts = parseInt(interval.replace('n', ''))

    // Redraw all notes in main color
    this.drawGrid()
    this.drawNoteLabels()
    this.drawSequence()

    // Highlight the vertical line if requested
    if (line) {
      ctx.strokeStyle = colors.selected
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo((step + 1) * size + 0.5, 0)
      ctx.lineTo((step + 1) * size + 0.5, rows * size)
      ctx.stroke()
    }

    // Scan the sequence to find notes that should be highlighted
    sequence.forEach((noteObj, index) => {
      if (noteObj && noteObj.note) {
        const { note, len } = noteObj
        const noteParts = parseInt(len.replace('n', ''))
        const noteIndex = noteNames.indexOf(note.replace(/\d+/g, ''))
        const noteOctave = parseInt(note.match(/\d+/)[0])
        const rowIndex = middleRow - (centerNoteIndex - noteIndex) - 12 * (noteOctave - centerOctave)
        const startStep = index
        const fillSteps = Math.ceil(intervalParts / noteParts)

        // Check if the current step is within the range of this note
        if (step >= startStep && step < startStep + fillSteps) {
          ctx.fillStyle = colors.selected

          for (let i = 0; i < fillSteps; i++) {
            const currentStep = startStep + i
            const isPartial = currentStep === startStep + fillSteps - 1 && intervalParts % noteParts !== 0
            const width = isPartial ? (intervalParts % noteParts) * size / noteParts : size

            ctx.fillRect((currentStep + 1) * size, rowIndex * size, width, size)
          }
        }
      }
    })
  }

  highlightNote (step, line = false) {
    const { ctx, sequence, size, interval, colors } = this
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const centerNote = this.centerNote
    const centerOctave = parseInt(centerNote.match(/\d+/)[0])
    const centerNoteIndex = noteNames.indexOf(centerNote.replace(/\d+/g, ''))
    const middleRow = Math.floor(this.rows / 2)
    const intervalParts = parseInt(interval.replace('n', ''))

    // Redraw all notes in main color
    this.drawGrid()
    this.drawNoteLabels()
    this.drawSequence()

    // Scan the sequence to find the note to highlight
    sequence.forEach((noteObj, index) => {
      if (noteObj && noteObj.note) {
        const { note, len } = noteObj
        const noteParts = parseInt(len.replace('n', ''))
        const noteIndex = noteNames.indexOf(note.replace(/\d+/g, ''))
        const noteOctave = parseInt(note.match(/\d+/)[0])
        const rowIndex = middleRow - (centerNoteIndex - noteIndex) - 12 * (noteOctave - centerOctave)
        const startStep = index
        const fillSteps = Math.ceil(intervalParts / noteParts)

        // Check if the current step is within the range of this note
        if (step >= startStep && step < startStep + fillSteps) {
          ctx.fillStyle = colors.selected
          ctx.fillRect(0, rowIndex * size, size, size)

          // Highlight the vertical line if requested
          if (line) {
            ctx.strokeStyle = colors.selected
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo((step + 1) * size + 0.5, 0)
            ctx.lineTo((step + 1) * size + 0.5, this.rows * size)
            ctx.stroke()
          }
        }
      }
    })
  }
}

window.MusicGrid = MusicGrid
