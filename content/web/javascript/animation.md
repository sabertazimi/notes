---
sidebar_position: 53
tags: [Web, JavaScript, ECMAScript, Animation]
---

# Animations

## Keyframe

`KeyframeEffect`:

```ts
const rabbitDownKeyframes = new KeyframeEffect(
  whiteRabbit, // element to animate
  [
    { transform: 'translateY(0%)' }, // keyframe
    { transform: 'translateY(100%)' }, // keyframe
  ],
  { duration: 3000, fill: 'forwards' } // keyframe options
)

const rabbitDownAnimation = new Animation(
  rabbitDownKeyFrames,
  document.timeline
)

whiteRabbit.addEventListener('click', downHandler)

function downHandler() {
  rabbitDownAnimation.play()
  whiteRabbit.removeEventListener('click', downHandler)
}
```

## Animation

- `animation.currentTime`.
- `animation.playState`.
- `animation.effect`.
- `animation.pause()/play()/reverse()/finish()/cancel()`.

```ts
animation.currentTime = animation.effect.getComputedTiming().duration / 2

function currentTime(time = 0) {
  animations.forEach((animation) => {
    if (typeof animation.currentTime === 'function')
      animation.currentTime(time)
    else
      animation.currentTime = time
  })
}

function createPlayer(animations) {
  return Object.freeze({
    play() {
      animations.forEach(animation => animation.play())
    },
    pause() {
      animations.forEach(animation => animation.pause())
    },
    currentTime(time = 0) {
      animations.forEach(animation => (animation.currentTime = time))
    },
  })
}
```

## Animate

`element.animate`:

```ts
const animationKeyframes = [
  {
    transform: 'rotate(0)',
    color: '#000',
  },
  {
    color: '#431236',
    offset: 0.3,
  },
  {
    transform: 'rotate(360deg)',
    color: '#000',
  },
]

const animationTiming = {
  duration: 3000,
  iterations: Number.POSITIVE_INFINITY,
}

const animation = document
  .querySelector('alice')
  .animate(animationKeyframes, animationTiming)
```

## References

- Using Web Animations [API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API).
