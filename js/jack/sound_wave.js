var PHYSICAL_WAVE = (function() {

  var canvasWidth = 600;
  var canvasHeight = 75;
  var MARGINS =
    {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

  var plotWidth = canvasWidth - MARGINS.left - MARGINS.right;
  var plotHeight = canvasHeight - MARGINS.top - MARGINS.bottom;

  var xRangePhys = d3.scaleLinear().range([-1, 1]);

  xRangePhys.domain([-1.0, 1.0]);

  var vis = d3.select('#physicalWave');

  var rect = vis.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", plotHeight)
    .attr("fill", 'var(--text-color)')
    .attr("opacity", 0.75)
    ;

  var molecules = [];
  var orig_x = [];

  var pressureX = [];
  var pressureY = [];

  sinePressure = d3.line()
    .x(function (d, i) { return pressureX[d]; })
    .y(function (d, i) { return pressureY[d]; });

  var pressurePath = vis.append('svg:path')
    .attr("stroke-width", 2.0)
    .attr("stroke", "var(--accent-color2)")
    .attr("fill", "none")
    .style("opacity", 1.0);

  vis.append("line")
    .attr("x1", 30)
    .attr("y1", 150)
    .attr("x2", plotWidth)
    .attr("y2", 150)
    .attr("stroke-width", 1)
    .attr("stroke", "var(--text-color)")
    .style("opacity", 0.40);

  vis.append("line")
    .attr("x1", 30)
    .attr("y1", 100)
    .attr("x2", 30)
    .attr("y2", 200)
    .attr("stroke-width", 1)
    .attr("stroke", "var(--text-color)")
    .style("opacity", 0.40);

  vis.append("text")
    .attr("text-anchor", "middle")
    .attr("x", plotWidth / 2 + 25)
    .attr("y", 100)
    .style('opacity', 1.0)
    .style("font-size", 11)
    .attr("fill", "var(--text-color)")
    .text("Plot of Air Pressure");

    vis.append("text")
    .attr("text-anchor", "end")
    .attr("x", 25)
    .attr("y", 105)
    .style('opacity', 0.8)
    .attr("fill", "var(--text-color)")
    .text("High");

    vis.append("text")
    .attr("text-anchor", "end")
    .attr("x", 25)
    .attr("y", 155)
    .style('opacity', 0.8)
    .attr("fill", "var(--text-color)")
    .text("0");

    vis.append("text")
    .attr("text-anchor", "end")
    .attr("x", 25)
    .attr("y", 200)
    .style('opacity', 0.8)
    .attr("fill", "var(--text-color)")
    .text("Low");

  var moleculeCount = 400;

  for (i = 0; i < moleculeCount; i++)
  {
    var moleculeX = (i / moleculeCount) * plotWidth + 30;
    var moleculeY = Math.random() * (plotHeight - 10) + 5;

    molecules.push(
      vis.append('svg:circle')
      .attr('cx', moleculeX)
      .attr('cy', moleculeY)
      .attr('r', 1.5)
      .attr('stroke', 'var(--accent-color2)')
      .attr('fill', 'var(--accent-color2)'));

    orig_x.push(moleculeX);
    pressureX.push(moleculeX);
    pressureY.push(0);
  }

  var moleculeTime = 0;

  function updateMolecules() {
    var phaseShift = 0;
    var amp = GET_WAVE_AMPLITUDE() * 14;
    var freq = GET_WAVE_FREQUENCY() * 100;
    var phaseShiftInc = freq / 200;

    for (i = 0; i < molecules.length; i++)
    {
      var angle = freq + moleculeTime + phaseShift;
      var sinAngle = Math.sin(angle);
      var sinAngleDelayed = Math.sin(angle-1.5);

      molecules[i].style('transform', `translateX(${xRangePhys(sinAngle * amp)}px)`)
      // molecules[i].style('opacity', Math.max(1.0 - (sinAngleDelayed * GET_WAVE_AMPLITUDE()), 0.6));
      pressureY[i] = sinAngleDelayed * 3 * amp + 150;
      phaseShift -= phaseShiftInc;
    }

    pressurePath.attr('d', sinePressure(d3.range(0, 385, 2)));
    rect.style('transform', `translateX(${xRangePhys(Math.sin(freq + moleculeTime)) * amp - 20}px)`);
    WAVE_INTERPOLATION += 0.1;
    WAVE_AMP_INTERPOLATION += 0.1;

    moleculeTime += GET_WAVE_FREQUENCY() / 2.0;
  }

  d3.timer(updateMolecules, 100);
}) ();
