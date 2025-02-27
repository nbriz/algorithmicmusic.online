// FUNCTIONS ...........................................................

function toggle () {
  if (Tone.Transport.state === 'started') {
    Tone.Transport.stop()
    toggleButton.content('cold-play')
  } else {
    Tone.Transport.start()
    toggleButton.content('cold-stop')
  }
}

// UI ELEMENTS .....................................................

const toggleButton = nn.create('button') // assign this to variable
  .content('cold-play')
  .addTo(container)
  .css(buttonCSS)
  .on('mouseover', buttonHover)
  .on('mouseout', buttonHover)
  .on('click', toggle) // call "toggle" function on click
