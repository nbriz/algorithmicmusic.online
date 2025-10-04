/*
  In this example we're using the [Tensorflow.js](https://www.tensorflow.org/js/) machine learning (AI) library to load the [HandPose](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection) AI model which can detect the position of various ["keypoints"](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection#mediapipe-hands-keypoints-used-in-mediapipe-hands) in a person's hands. While Tensorflow can be used to create or train your own AI neural networks, there are also [many pre-trained models](https://www.tensorflow.org/js/models) like HandPose to choose from.
*/

// global variables
let detector, video, osc, indexEle, thumbEle

// this function loads the AI model
async function setupModel () {
  // here we pick which pre-trained model we want to use
  const model = handPoseDetection.SupportedModels.MediaPipeHands
  // here we setup some "configuration" settings
  const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
    modelType: 'full', // 'lite'|'full' (full = a bit more accurate)
    maxHands: 1 // we only need to find 1 hand for this demo
  }
  // we combine the two to create the AI "detector" function
  const detector = await handPoseDetection.createDetector(model, detectorConfig)
  return detector
}

// update the volume and UI elements every frame
async function update () {
  requestAnimationFrame(update) // recursively call update loop

  // we first use the detector AI function to predict our "hands" based on the video frame
  const hands = await detector.estimateHands(video, { flipHorizontal: false })
  const hand = hands[0] // get the first hand

  // bring your finter tips closer together to raise volume
  if (hand) {
    const idx = hand.keypoints[8] // index tip data
    const thb = hand.keypoints[4] // thumb tip data
    indexEle.position(idx.x, idx.y) // update UI
    thumbEle.position(thb.x, thb.y) // update UI
    // calculate distance between points and set volume
    const dist = nn.dist(idx.x, idx.y, thb.x, thb.y)
    osc.volume.value = -dist // update volume
  }
}

async function setup () {
  await Tone.start()

  // we create (&& begin playing) the Tone.js Oscillator
  osc = new Tone.Oscillator().toDestination().start()
  osc.volume.value = -100 // set it's volume down by default

  const redCircCSS = {
    borderRadius: '50%',
    background: 'red',
    width: 25,
    height: 25
  }

  // here we create the visual elements
  indexEle = nn.create('div').css(redCircCSS).addTo('body')
  thumbEle = nn.create('div').css(redCircCSS).addTo('body')

  // create the video element with our camera feed
  video = nn.create('video')
    .addTo('body')
    .set({
      autoplay: true,
      muted: true,
      stream: await nn.askFor({ video: true })
    })

  // then we create our AI function
  detector = await setupModel()

  update() // begin update loop
  start.remove() // remove the start button
}

const start = nn.create('button')
  .content('start')
  .addTo('body')
  .on('click', setup)
