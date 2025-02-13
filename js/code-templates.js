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
<script src="http://localhost/js/create-piano.js"></script>
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
<script src="http://localhost/js/create-piano.js"></script>
<script>
/* global Tone, nn, d3, createWaveform, createSpectrum, createPianoUI */
{{code}}
</script>`
]
