/*
  In this example we're using the [Tensorflow.js](https://www.tensorflow.org/js/) machine learning (AI) library to load the [BlazePose](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection#blazepose) AI model which can detect the position of various ["keypoints"](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection#blazepose-keypoints-used-in-mediapipe-blazepose) in a person's pose. While Tensorflow can be used to create or train your own AI neural networks, there are also [many pre-trained models](https://www.tensorflow.org/js/models) like BlazePose to choose from.
*/

// global variables
let detector, video, osc, volEle, freqEle

// this function loads the AI model
async function setupModel () {
  // here we pick which pre-trained model we want to use
  const model = poseDetection.SupportedModels.BlazePose
  // here we setup some "configuration" settings
  const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
    numPoses: 1 // we only need 1 person
  }
  // we combine the two to create the AI "detector" function
  const detector = await poseDetection.createDetector(model, detectorConfig)
  return detector
}

// update the volume/frequency and UI elements every frame
async function update () {
  requestAnimationFrame(update) // recursively call update loop

  // we first use the detector AI function to predict our "pose" based on the video frame
  const poses = await detector.estimatePoses(video)
  const person = poses[0] // get the first person

  if (person) {
    // we grab the 19 (left_index) and 20 (right_index) keypoints, we can see which keypoint indexes refer to which part of the pose [using this BlazePose diagram](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection#blazepose-keypoints-used-in-mediapipe-blazepose)
    const left = person.keypoints[19]
    const right = person.keypoints[20]
    // Adjust volume (and UI) based on left hand position
    if (left.y >= 0 && left.y <= 480) {
      osc.volume.value = nn.map(left.y, 0, 480, 0, -50)
      volEle.position(left.x, left.y)
    }
    // Adjust frequency (and UI) based on right hand position
    osc.frequency.value = nn.map(right.y, 0, 480, 220, 880)
    freqEle.position(right.x, right.y)
  } else {
    osc.volume.value = -100 // Mute if no pose is detected
  }
}

async function setup () {
  // we create (&& begin playing) the Tone.js Oscillator
  osc = new Tone.Oscillator().toDestination().start()
  osc.volume.value = -100 // set it's volume down by default

  // here we create the visual elements
  volEle = nn.create('div')
    .css({ color: 'red', fontSize: '48px' })
    .content('VOL')
    .addTo('body')

  freqEle = nn.create('div')
    .css({ color: 'red', fontSize: '48px' })
    .content('FREQ')
    .addTo('body')

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
