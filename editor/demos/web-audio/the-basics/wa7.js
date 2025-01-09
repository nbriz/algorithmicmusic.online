/*
  now let's get a little craftier with our AudioParam scheduling to create a
  classic [ADSR](https://www.wikiaudio.org/adsr-envelope/) (Attack, Decay, Sustain, Release) envelope

  here's an ASCII rendering of an ADSR envelope
  |   /|\___|____|    |
  |  / |    |    |\   |
  | /  |    |    | \  |
  | a  |d   |s   |r \ |
*/
const ctx = new (window.AudioContext || window.webkitAudioContext)()

const osc = ctx.createOscillator()
const lvl = ctx.createGain()

osc.connect(lvl)
lvl.connect(ctx.destination)

// the [SVG wave](https://algorithmicmusic.online/editor/#Web Audio API/the basics/visualization: svg with d3) visualization [packaged](https://algorithmicmusic.online/js/create-waveform.js) into a function
const wave = createWaveform({ audioCtx: ctx })
lvl.connect(wave)

// tone will play for 2.1 seconds with the followin ADSR envelope
const t = ctx.currentTime // start time
const a = 0.5 // attack duration
const d = 0.1 // decay duration
const s = 1.0 // sustain duration
const r = 0.5 // release duration

// start silent
lvl.gain.setValueAtTime(0.001, t)
// attack (ramp up to peak volume)
lvl.gain.linearRampToValueAtTime(0.755, t + a)
// decay (fall down to sustained value)
lvl.gain.linearRampToValueAtTime(0.555, t + a + d)
// sustain (hold sound for a bit)
lvl.gain.linearRampToValueAtTime(0.555, t + a + d + s)
// release (fade out to silence)
lvl.gain.linearRampToValueAtTime(0.001, t + a + d + s + r)

osc.start(ctx.currentTime)
osc.stop(ctx.currentTime + 5)
