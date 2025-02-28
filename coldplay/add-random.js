nn.create('button')
  .content('randomize')
  .addTo(container)
  .css(buttonCSS)
  .on('mouseover', buttonHover)
  .on('mouseout', buttonHover)
  .on('click', randomColdplay) // add this

nn.on('load', randomColdplay) // and this
