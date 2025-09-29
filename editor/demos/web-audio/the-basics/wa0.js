/*

  The [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) provides a powerful and versatile system for controlling audio on the Web, while we'll mostly be using the Tone.js library to create our work, it's important to remember that Tone.js is built on top of the Web Audio API which is built into all of our web browsers. We may have ideas that require "lower level" access to audio (for example if we're creating sound buffers from scratch mathematically), for that reason I've put some native Web Audio examples together.

  To start, everything happens inside an [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) so you need that first and foremost
*/
const ctx = new window.AudioContext()
