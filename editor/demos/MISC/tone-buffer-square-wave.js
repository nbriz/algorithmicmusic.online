function createSquareWaveBuffer(freq, duration, sampleRate = Tone.context.sampleRate) {
  const channels = 2; // Stereo output
  const length = duration * sampleRate; // Total samples
  const buffer = Tone.context.createBuffer(channels, length, sampleRate);

  const numHarmonics = Math.floor(sampleRate / (2 * freq)); // Limit to Nyquist frequency
  const scalar = (freq * 2 * Math.PI) / sampleRate; // Angular velocity for the fundamental frequency

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const samples = buffer.getChannelData(ch);
    for (let s = 0; s < samples.length; s++) {
      let value = 0;
      for (let n = 1; n <= numHarmonics; n += 2) { // Only odd harmonics
        value += (1 / n) * Math.sin(n * s * scalar); // Add scaled sine for each harmonic
      }
      samples[s] = value; // Write value to the sample
    }
  }

  return buffer; // Return the populated buffer
}

function playSquareWave(freq, duration) {
  // Create a buffer with the manually generated square wave
  const buffer = createSquareWaveBuffer(freq, duration);

  // Wrap the buffer in a Tone.js player
  const player = new Tone.Player(buffer).toDestination();

  player.start(); // Play the square wave
}

// Example: Play a 440 Hz square wave for 2 seconds
playSquareWave(440, 2);
