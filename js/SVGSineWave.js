/* global d3 */
class SVGSineWave {
  constructor ({
    svg,
    circle = true,
    colors = ['black', 'green'],
    width = 600,
    height = 150,
    frequency = 2,
    amplitude = 1,
    callback = null
  }) {
    this.svgEle = document.querySelector(svg)
    this.svg = d3.select(svg)
    if (this.svg.empty()) {
      throw new Error(`SVG element not found for selector: ${svg}`)
    }

    this.circle = circle
    this.colors = colors
    this.width = width
    this.height = width / 4
    this.frequency = frequency
    this.amplitude = amplitude

    this.svgEle.setAttribute('width', this.width)
    this.svgEle.setAttribute('height', this.height)

    this.updateScales()
    this.callback = callback

    this.time = 0

    this.initAxes()
    this.initShapes()
    this.initSineLine()

    this.draw = this.draw.bind(this)
    d3.timer(this.draw, 50)
  }

  updateScales () {
    const canvasWidth = this.circle ? Math.min(this.width, this.height) : this.width * 0.25
    const canvasHeight = this.circle ? Math.min(this.width, this.height) : this.height

    this.xRange = d3.scaleLinear().range([0, canvasWidth])
    this.yRange = d3.scaleLinear().range([canvasHeight, 0])

    this.xRange.domain([-1.25, 1.25])
    this.yRange.domain([-1.25, 1.25])

    this.radius = Math.min(this.xRange(1) - this.xRange(0), this.yRange(0) - this.yRange(1))
  }

  initAxes () {
    // const xAxis = d3.svg.axis().scale(this.xRange).tickSize(0).ticks(0).tickSubdivide(true)
    // const yAxis = d3.svg.axis().scale(this.yRange).tickSize(0).ticks(0).orient('left').tickSubdivide(true)
    const xAxis = d3.axisBottom(this.xRange).tickSize(0).ticks(0)
    const yAxis = d3.axisLeft(this.yRange).tickSize(0).ticks(0)

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${this.height / 2})`)
      .style('opacity', 0)
      .call(xAxis)

    this.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.width / 2},0)`)
      .style('opacity', 0)
      .call(yAxis)
  }

  initShapes () {
    // horizontal axis
    this.axisExtension = this.svg.append('line')
      .attr('stroke-width', 1)
      .attr('stroke', this.colors[0])
      .style('opacity', 1)

    if (this.circle) {
      // spinning clock-hand
      this.vector = this.svg.append('line')
        .attr('stroke-width', 3.0)
        .attr('stroke', this.colors[0])
        .style('stroke-linecap', 'round')

      // vertical line under clock-hand
      this.sineComponent = this.svg.append('line')
        .attr('stroke-width', 2.0)
        .attr('stroke', this.colors[1])
        .style('stroke-linecap', 'round')

      // dashed line (connecting clock-hand to sine wave)
      this.sineProjection = this.svg.append('line')
        .attr('stroke-width', 2.0)
        .attr('stroke', this.colors[1])
        .style('stroke-linecap', 'round')
        .style('stroke-dasharray', '3, 3')
        .style('opacity', 0.5)
      // clock circle
      this.circleShape = this.svg.append('circle')
        .attr('stroke-width', 1)
        .attr('stroke', this.colors[0])
        .attr('fill', 'none')
        .attr('opacity', 1)
    }
  }

  initSineLine () {
    this.sineOffset = this.circle ? this.radius * 1.5 : -this.width / 8

    this.path = this.svg.append('path')
      .attr('stroke-width', 2.0)
      .attr('stroke', this.colors[1])
      .attr('fill', 'none')

    this.sine = d3.line()
      .x((d) => this.xRange(d) + this.sineOffset)
      .y((d) => this.yRange(-Math.sin(d * this.frequency + this.time) * this.amplitude))

    this.data = Array.from({ length: 500 }, (_, i) => i / 50)
  }

  draw () {
    const xComponent = this.xRange(Math.cos(this.time) * this.amplitude)
    const yComponent = this.yRange(-Math.sin(this.time) * this.amplitude)

    const cx = this.xRange(0) // Dynamic center for circle
    const cy = this.yRange(0)

    if (this.circle) {
      this.vector
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', xComponent)
        .attr('y2', yComponent)

      this.sineComponent
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', cx)
        .attr('y2', yComponent)

      const offset = this.radius + (this.radius / 2)
      this.sineProjection
        .attr('x1', cx + offset)
        .attr('y1', yComponent)
        .attr('x2', Math.min(xComponent, cx))
        .attr('y2', yComponent)

      this.circleShape
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', this.radius)
    }

    const offsetStart = this.circle ? cx + this.radius * 1.5 : 0
    this.axisExtension
      .attr('x1', offsetStart)
      .attr('y1', cy)
      .attr('x2', this.width)
      .attr('y2', cy)

    this.path
      .attr('d', this.sine(this.data))

    this.time -= 0.0125 * this.frequency

    if (this.callback) {
      this.callback(this.time)
    }
  }

  update ({ width, height, frequency, amplitude }) {
    if (width !== undefined) this.width = width
    if (width !== undefined) this.height = width / 4
    if (frequency !== undefined) this.frequency = frequency
    if (amplitude !== undefined) this.amplitude = amplitude

    this.sineOffset = this.circle ? this.radius * 1.5 : -this.width / 8

    this.svgEle.setAttribute('width', this.width)
    this.svgEle.setAttribute('height', this.height)

    this.updateScales()
  }
}

window.SVGSineWave = SVGSineWave
