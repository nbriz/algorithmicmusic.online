/*
  in order to hear stuff we need some kind of source [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) these can be live [WebRTC streams](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode) (mic/webcam), HTML [<audio> or <video>](https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode) elements, raw audio data with [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode) (either generated or loaded from a file) or an [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode), which is probably the simplest node.
*/
const ctx = new (window.AudioContext || window.webkitAudioContext)()

const osc = ctx.createOscillator()
osc.type = 'sawtooth' // default is "sine"
osc.frequency.value = 261.63 // default is 440

// then connect it to the the AudioContext destination (the output selected in your computer's audio settings)
osc.connect(ctx.destination)

// then start playing it, passing an optional param for when to start. ctx.currentTime is how many seconds have passed in seconds since the start. It's based on the WebAudio API clock which runs on separate thread and is more precise then the the JS clock (Date object, setTimeout, etc.) so here we are essentially staying "start playing right now"
osc.start(ctx.currentTime)

// the sound will play forever unless u schedule a stop time in this case we'll stop it a half second from now
osc.stop(ctx.currentTime + 0.5)
