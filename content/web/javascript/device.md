---
sidebar_position: 58
tags: [Web, JavaScript, ECMAScript, Device]
---

# Device

## Gamepad

[Gamepad API](https://web.dev/gamepad):

```ts
const gamepads = {}

function gamepadHandler(event, connecting) {
  // gamepad === navigator.getGamepads()[gamepad.index]
  const { gamepad } = event

  if (connecting)
    gamepads[gamepad.index] = gamepad
  else
    delete gamepads[gamepad.index]
}

window.addEventListener('gamepadconnected', (e) => {
  gamepadHandler(e, true)
})

window.addEventListener('gamepaddisconnected', (e) => {
  gamepadHandler(e, false)
})
```

## Bluetooth

[Bluetooth API](https://web.dev/bluetooth):

```ts
navigator.bluetooth
  .requestDevice({ filters: [{ services: ['health_thermometer'] }] })
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService('health_thermometer'))
  .then(service => service.getCharacteristic('measurement_interval'))
  .then(characteristic =>
    characteristic.getDescriptor('gatt.characteristic_user_description')
  )
  .then((descriptor) => {
    const encoder = new TextEncoder('utf-8')
    const userDescription = encoder.encode(
      'Defines the time between measurements.'
    )
    return descriptor.writeValue(userDescription)
  })
  .catch((error) => {
    console.error(error)
  })
```

## USB

[USB API](https://web.dev/usb):

```ts
let device

navigator.usb
  .requestDevice({ filters: [{ vendorId: 0x2341 }] })
  .then((selectedDevice) => {
    device = selectedDevice
    return device.open() // Begin a session.
  })
  .then(() => device.selectConfiguration(1)) // Select configuration for the device.
  .then(() => device.claimInterface(2)) // Request exclusive control over interface.
  .then(() =>
    device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: 0x02,
    })
  ) // Ready to receive data
  .then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint.
  .then((result) => {
    const decoder = new TextDecoder()
    console.log(`Received: ${decoder.decode(result.data)}`)
  })
  .catch((error) => {
    console.error(error)
  })
```

## NFC

[NFC API](https://web.dev/nfc):

```ts
const encoder = new TextEncoder()
const data = {
  firstName: 'First',
  lastName: 'Last',
}
const jsonRecord = {
  recordType: 'mime',
  mediaType: 'application/json',
  data: encoder.encode(JSON.stringify(data)),
}

const imageRecord = {
  recordType: 'mime',
  mediaType: 'image/png',
  data: await (await fetch('icon1.png')).arrayBuffer(),
}

const ndef = new NDEFReader()
await ndef.write({ records: [jsonRecord, imageRecord] })
```

## Serial

[Serial API](https://web.dev/serial):

```ts
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort()

// Wait for the serial port to open.
await port.open({ baudRate: 9600 })

// Close a serial port.
await port.close()
```

```ts
const textDecoder = new TextDecoderStream()
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable)
const reader = textDecoder.readable.getReader()

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read()
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock()
    break
  }
  // value is a string.
  console.log(value)
}
```

```ts
const textEncoder = new TextEncoderStream()
const writableStreamClosed = textEncoder.readable.pipeTo(port.writable)
const writer = textEncoder.writable.getWriter()
await writer.write('hello')
```

## HID

[Human interface devices API](https://web.dev/hid):

```ts
function waitFor(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

// Prompt user to select an Apple Keyboard Backlight device.
const [device] = await navigator.hid.requestDevice({
  filters: [{ vendorId: 0x05AC, usage: 0x0F, usagePage: 0xFF00 }],
})

// Wait for the HID connection to open.
await device.open()

// Blink!
const reportId = 1

for (let i = 0; i < 10; i++) {
  // Turn off
  await device.sendFeatureReport(reportId, Uint32Array.from([0, 0]))
  await waitFor(100)

  // Turn on
  await device.sendFeatureReport(reportId, Uint32Array.from([512, 0]))
  await waitFor(100)
}
```
