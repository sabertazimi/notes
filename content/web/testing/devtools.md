---
sidebar_position: 11
tags: [Web, Testing, Debugging, DevTools]
---

# DevTools

## Detection

- DevTools disable [library](https://github.com/theajack/disable-devtool).
- DevTools disable detection [guide](https://github.com/546669204/fuck-debugger-extensions).

### Object Getter

```ts
const x = document.createElement('div')

Object.defineProperty(x, 'id', {
  get() {
    // devtool opened.
    return 'id'
  },
})

console.log(x)
```

### Type Conversion

```ts
// eslint-disable-next-line prefer-regex-literals -- use RegExp to detect devtools opened
const c = new RegExp('1')

c.toString = function () {
  // devtool opened
}

console.log(c)
```

> Anti method: hook `console` object, disable all outputs.

### Debugger

```ts
;(function () {}).constructor('debugger')()
```

```ts
;(() => {
  function block() {
    if (
      window.outerHeight - window.innerHeight > 200
      || window.outerWidth - window.innerWidth > 200
    ) {
      document.body.innerHTML = 'Debug detected, please reload page!'
    }

    setInterval(() => {
      ;(function () {
        return false
      })
        .constructor('debugger')
        .call()
    }, 50)
  }

  try {
    block()
  } catch (err) {}
})()
```

```ts
const startTime = new Date()
// debugger;
const endTime = new Date()
const isDev = endTime - startTime > 100

while (true) {
  // debugger;
}
```

> Anti method: use chrome protocol to block all `debugger` request.
> Anti method: hook `Function.prototype.constructor` and replace `debugger` string.

## Shortcuts

- c-d: go to next word
- c-f in `Elements` panel: search DOM node
- c-m: go to next bracket
- c-p: go to files
- cs-p: go to anywhere
- cs-o: go to functions

long click reload: multiple reload options e.g. clean cache

## Elements

- Break on elements.
- Inspect elements a11y.
- Capture node screenshot.

### Style

- Color picker
- Filter: class filter, pseudo filter, css style filter
- `:hov`: element state (active, focus, hover, target, etc)

:::tip[Emulate a Focused Page]

Enable `Emulate a focused page` in
`:hov` element state panel or `Rendering` panel,
to prevent dropdowns from disappearing.
`visibilityChange` event will not be triggered.

:::

## Console

### Logging

- `console.XXX`.
- `copy`: copy complex object to clipboard.
- `monitor`: monitor object.

```ts
const devtools = /./
devtools.toString = function () {
  this.opened = true
}

console.log('%c', devtools)
// devtools.opened will become true if/when the console is opened
```

```ts
// Basic console functions
console.assert()
console.clear()
console.log()
console.debug()
console.info()
console.warn()
console.error()

// Different output styles
console.dir()
console.dirxml()
console.table()
console.group()
console.groupCollapsed()
console.groupEnd()

// Trace console functions
console.trace()
console.count()
console.countReset()
console.time()
console.timeEnd()
console.timeLog()

// Non-standard console functions
console.profile()
console.profileEnd()
console.timeStamp()
```

`console.log`:

```ts
// `sprinf` style log
console.log('%d %o %s', integer, object, string)
console.log('%c ...', 'css style')
```

`console.table`:

```ts
// display array of object (tabular data)
const transactions = [
  {
    id: '7cb1-e041b126-f3b8',
    seller: 'WAL0412',
    buyer: 'WAL3023',
    price: 203450,
    time: 1539688433,
  },
  {
    id: '1d4c-31f8f14b-1571',
    seller: 'WAL0452',
    buyer: 'WAL3023',
    price: 348299,
    time: 1539688433,
  },
  {
    id: 'b12c-b3adf58f-809f',
    seller: 'WAL0012',
    buyer: 'WAL2025',
    price: 59240,
    time: 1539688433,
  },
]

console.table(data, ['id', 'price'])
```

### Utilities

Console [utilities API](https://developer.chrome.com/docs/devtools/console/utilities):

- `$_`.
- `$0` - `$4`.
- `$()`: `document.querySelector()`.
- `$$()`: `document.querySelectorAll()`.
- `getEventListeners(dom)`.
- `monitorEvents(dom, events)`.
- `unmonitorEvents(dom)`.
- `monitor(fn)`.
- `unmonitor(fn)`.
- `debug(fn)`.
- `undebug(fn)`.
- `keys(object)`.
- `values(object)`.
- `queryObjects(Constructor)`.

### Settings

- Preserve log
- Show timestamps
- Verbose: additional performance log
- Click filename, filter error messages
- Add folder to workspace

### Capture Default Event Listener

`$0`: the reference to the currently selected element in the Elements panel.

```ts
const listener = getEventListeners($0).click[0].listener
$0.removeEventListener('click', listener)
$0.addEventListener('click', (e) => {
  // do something
  // ...

  // then
  listener(e)
})
```

## Source

- Add log points.
- Multiple breakpoints: source, XHR/fetch, DOM, global/event listeners.
- Open a source file, right click code, `Blackbox script` item.
- [Local Overrides](https://developers.google.com/web/updates/2018/01/devtools#overrides)
  for persistent changes to css styles.

Same thing in `VSCode` debug panel (log points, break points etc).

## Network

- Network throttling: simulate different network environment.
- Initiator: go to files.

## Performance

- `C+S+P`: performance monitor.
- `C+S+P`: FPS.
- Performance tips.
- Memory panel.
- Timeline events: `script -> style -> layout -> paint -> composite`.
- Timeline events [reference](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/performance-reference).
- Performance analysis [reference](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference).
- Performance tools [guide](https://zhuanlan.zhihu.com/p/41017888).

## Simulation

- cs-p: type `3G` (slow network)
- cs-p: type `sensor` (geolocation)

## Audit

- cs-p: type `audit`

## Coverage

- cs-p: type `coverage`
- Use to eliminate **unused** CSS/JS code.

## Memory

- Heap snapshot

## JS Profiler

## Layer

Tool for composite stage analysis:

- Compositor layers.

## Rendering

- Emulate a focused page.
- FPS monitor.
- Scrolling performance.
- Scroll event.
- Paint flashing area: re-paint area.
- Layout shift region.
- Compositor layer borders.
- CSS media query emulation:
  - `prefers-color-scheme`.
  - `prefers-reduced-motion`.
  - `prefers-contrast`.
  - A11y emulation.

## Animations

Overview for animations: learn animations tricks.

## CSS Overview

CSS overview:

- Colors.
- Fonts.
- Unused declarations.
- Media queries.

## Search Engine

Set search omnibox:

```bash
# Bing
https://www.bing.com/copilotsearch?q=%s

# Google
https://www.google.com/search?q=%s&udm=50

# Perplexity
https://www.perplexity.ai/?q=%s
```
