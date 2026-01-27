---
sidebar_position: 55
tags: [Web, JavaScript, ECMAScript, Media]
---

# Media

## Oscillator

```bash
                         -3  -1   1       4   6       9   11
                       -4  -2   0   2   3   5   7   8   10  12
  .___________________________________________________________________________.
  :  | |  |  | | | |  |  | | | | | |  |  | | | |  |  | | | | | |  |  | | | |  :
  :  | |  |  | | | |  |  | | | | | |  |  | | | |  |  | | | | | |  |  | | | |  :
  :  | |  |  | | | |  |  | | | | | |  |  | | | |  |  | | | | | |  |  | | | |  :
<-:  |_|  |  |_| |_|  |  |_| |_| |_|  |  |_| |_|  |  |_| |_| |_|  |  |_| |_|  :->
  :   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   :
  : A | B | C | D | E | F | G | A | B | C | D | E | F | G | A | B | C | D | E :
  :___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___|___:
    ^                           ^           ^               ^           ^
  220 Hz                      440 Hz      523.25 Hz       880 Hz     1174.65 Hz
(-1 Octave)                 (middle A)                 (+1 Octave)
```

```ts
const audioContext = new AudioContext()

const baseFrequency = 440
const getNoteFreq = (base, pitch) => base * 2 ** (pitch / 12)
// oscillator.frequency.value = getNoteFreq(440, 7);

const getNoteDetune = pitch => pitch * 100
// oscillator.detune.value = getNoteDetune(7);

function play(type, delay, pitch, duration) {
  const oscillator = audioContext.createOscillator()
  oscillator.connect(audioContext.destination)

  oscillator.type = type
  oscillator.detune.value = getNoteDetune(pitch)

  const startTime = audioContext.currentTime + delay
  const stopTime = startTime + duration
  oscillator.start(startTime)
  oscillator.stop(stopTime)
}
```

## Music

```ts
const sampleSize = 1024 // number of samples to collect before analyzing data
const audioUrl = 'viper.mp3'

let audioData = null
let audioPlaying = false

const audioContext = new AudioContext()
const sourceNode = audioContext.createBufferSource()
const analyserNode = audioContext.createAnalyser()
const javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1)

// Create the array for the data values
const amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount)

// Now connect the nodes together
sourceNode.connect(audioContext.destination)
sourceNode.connect(analyserNode)
analyserNode.connect(javascriptNode)
javascriptNode.connect(audioContext.destination)

// setup the event handler that is triggered
// every time enough samples have been collected
// trigger the audio analysis and draw the results
javascriptNode.onaudioprocess = function () {
  // get the Time Domain data for this sample
  analyserNode.getByteTimeDomainData(amplitudeArray)

  // draw the display if the audio is playing
  // if (audioPlaying === true) {
  // requestAnimFrame(drawTimeDomain);
  // }
}

// Load the audio from the URL via AJAX and store it in global variable audioData
// Note that the audio load is asynchronous
function loadSound(url) {
  fetch(url)
    .then((response) => {
      audioContext.decodeAudioData(response, (buffer) => {
        audioData = buffer
        playSound(audioData)
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

// Play the audio and loop until stopped
function playSound(buffer) {
  sourceNode.buffer = buffer
  sourceNode.start(0) // Play the sound now
  sourceNode.loop = true
  audioPlaying = true
}

function stopSound() {
  sourceNode.stop(0)
  audioPlaying = false
}
```

## Audio

- [AnalyserNode.getByteFrequencyData API](https://developer.mozilla.org/docs/Web/API/AnalyserNode/getByteFrequencyData)
- [Github Demo](https://github.com/bogdan-cornianu/swave/blob/master/src/visualizer.ts)

```ts
const WIDTH = this.canvas.clientWidth
const HEIGHT = this.canvas.clientHeight
this.analyserNode.fftSize = 256
const bufferLengthAlt = this.analyserNode.frequencyBinCount
const dataArrayAlt = new Uint8Array(bufferLengthAlt)

this.ctx.clearRect(0, 0, WIDTH, HEIGHT)

function draw() {
  const drawVisual = requestAnimationFrame(draw)
  this.analyserNode.getByteFrequencyData(dataArrayAlt)

  this.ctx.fillStyle = 'rgb(255, 255, 255)'
  this.ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const barWidth = (WIDTH / bufferLengthAlt) * 2.5
  let barHeight
  let x = 0

  for (let i = 0; i < bufferLengthAlt; i++) {
    barHeight = dataArrayAlt[i]

    this.ctx.fillStyle = `rgb(${barHeight + 100},15,156)`
    this.ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

    x += barWidth + 1
  }
}

draw()
```

## References

- W3C media session [specification](https://w3c.github.io/mediasession)
- MDN media session [documentation](https://developer.mozilla.org/docs/Web/API/MediaSession)
- Google media session [blog](https://web.dev/media-session)
