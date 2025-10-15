window.codeTemplate = {}

window.codeTemplate.tags = {
  tone: '<script src="https://unpkg.com/tone"></script>',
  nn: '<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>',
  // d3: '<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>',
  // spec: '<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>',
  // wave: '<script src="https://algorithmicmusic.online/js/create-waveform.js"></script>',
  // piano: '<script src="https://algorithmicmusic.online/js/create-piano.js"></script>',
  viz: '<script src="https://algorithmicmusic.online/js/viz-helpers.js"></script>',
  // viz: '<script src="/js/viz-helpers.js"></script>',
  pose: `<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection"></script>`,
  hand: `<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"></script>`,
  vae: `<script src="https://cdnjs.cloudflare.com/ajax/libs/tensorflow/1.2.8/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.0.0/es6/music_vae.js"></script>`,
  gan: `<script src="https://cdnjs.cloudflare.com/ajax/libs/tensorflow/1.2.8/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.0.0/es6/core.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.0.0/es6/gansynth.js"></script>`
}

window.codeTemplate.globals = {
  tone: 'Tone',
  nn: 'nn',
  // d3: 'd3',
  // spec: 'createSpectrum',
  // wave: 'createWaveform',
  // piano: 'createPianoUI',
  viz: 'viz',
  pose: 'poseDetection',
  hand: 'handPoseDetection',
  vae: 'music_vae',
  gan: 'gansynth'
}

window.createCodeTemplate = (arr = []) => {
  const tag = window.codeTemplate.tags
  const global = window.codeTemplate.globals
  // check for "body"
  let str = arr.includes('body') ? '<body style="background: white"></body>\n' : ''
  arr = arr.filter(e => e !== 'body')
  // add any libs
  arr.forEach(key => { str += tag[key] + '\n' })
  // open script tag
  str += '<script>\n'
  // add globals for libs
  arr = arr.map(k => global[k])
  if (arr.length > 0) { str += `/* global ${arr.join(', ')} */\n` }
  // {{code}} && closing script tag
  str += '{{code}}\n</script>'
  return str
}

// ----------
// LEGACY
// ----------
window.codeTemplates = [
// 0
  '',
// 1: vanilla
`<script>
{{code}}
</script>`,
// 2: tone + nn
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>
<script>
/* global Tone, nn */
{{code}}
</script>`,
// 3: tone + nn + d3 + visual functions
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js?v=1"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js"></script>
<script>
/* global Tone, nn, d3, createWaveform, createSpectrum */
{{code}}
</script>`,
// 4: tone
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script>
/* global Tone */
{{code}}
</script>`,
// 5: d3
`<body></body>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script>
/* global d3 */
{{code}}
</script>`,
// 6: d3 + visual functions
`<body></body>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js?updated=3"></script>
<script>
/* global d3, createWaveform, createSpectrum */
{{code}}
</script>`,
// 7: nn + d3 + visual functions
`<body></body>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js?v=1"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js?updated=3"></script>
<script>
/* global nn, d3, createWaveform, createSpectrum */
{{code}}
</script>`,
// 8: tone + nn + d3 + visual functions + tensor flow
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js?v=1"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection"></script>
<script>
/* global poseDetection, Tone, nn, d3, createWaveform, createSpectrum */
{{code}}
</script>`,
// 9: tone + nn + d3 + pianoUI
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js?v=1"></script>

<script>
/* global Tone, nn, createPianoUI */
{{code}}
</script>`,
// 10: tone + nn + d3 + visual functions + pianoUI
`<body></body>
<script src="https://unpkg.com/tone"></script>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js?v=1"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://algorithmicmusic.online/js/create-spectrum.js"></script>
<script src="https://algorithmicmusic.online/js/create-waveform.js"></script>
<script src="https://algorithmicmusic.online/js/create-piano.js"></script>
<script>
/* global Tone, nn, d3, createWaveform, createSpectrum, createPianoUI */
{{code}}
</script>`
]
