function play () {
  piano.triggerAttackRelease(['C4', 'E4', 'G4'], '8n')
}

// NOTE: this part won't work on it's own.
.on('click', play)
// you have to add this line to the UI element you want triggering the function
