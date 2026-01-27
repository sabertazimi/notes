---
sidebar_position: 1
tags: [Programming, Design, Design Pattern, Creation Pattern]
---

# Factory Method

Creating objects without specify exact object class:
not calling a constructor directly.

## Static

```ts
CoordinateSystem = {
  CARTESIAN: 0,
  POLAR: 1,
}

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static get factory() {
    return new PointFactory()
  }
}

class PointFactory {
  static newCartesianPoint(x, y) {
    return new Point(x, y)
  }

  static newPolarPoint(rho, theta) {
    return new Point(rho * Math.cos(theta), rho * Math.sin(theta))
  }
}

const point = PointFactory.newPolarPoint(5, Math.PI / 2)
const point2 = PointFactory.newCartesianPoint(5, 6)
```

## Dynamic

```ts
class Vehicle {
  constructor({
    type = 'vehicle',
    state = 'brand new',
    color = 'white',
    speed = 0,
  } = {}) {
    this.type = type
    this.state = state
    this.color = color
    this.speed = speed
  }

  run(...args) {
    if (args.length === 0)
      console.log(`${this.type} - run with: ${this.speed}km/s`)
    else if (toString.apply(args[0]) === '[object Number]')
      this.speed = args[0]
  }

  withColor(...args) {
    if (args.length === 0)
      console.log(`The color of this ${this.type} product is : ${this.color}`)
    else if (toString.apply(args[0]) === '[object String]')
      this.color = args[0]
  }

  reform(funcName, newFunc) {
    if (
      typeof this[funcName] === 'function'
      || typeof this.prototype[funcName] === 'function'
    ) {
      delete this[funcName]
      this.prototype[funcName] = newFunc
    }
  }

  addFeature(funcName, newFunc) {
    if (typeof this[funcName] === 'undefined') {
      this[funcName] = newFunc
      this.prototype[funcName] = newFunc
    }
  }
}

class Car extends Vehicle {
  constructor({
    type = 'car',
    state = 'brand new',
    color = 'silver',
    speed = 10,
    doors = 4,
  } = {}) {
    super({ type, state, color, speed })
    this.doors = doors
  }
}

class Truck extends Vehicle {
  constructor({
    type = 'truck',
    state = 'used',
    color = 'blue',
    speed = 8,
    wheelSize = 'large',
  } = {}) {
    super({ type, state, color, speed })
    this.wheelSize = 'large'
  }
}

class VehicleFactory {
  constructor() {
    this.VehicleClass = Car
  }

  createVehicle(options) {
    switch (options.vehicleType) {
      case 'car':
        this.VehicleClass = Car
        break
      case 'truck':
        this.VehicleClass = Truck
        break
      default:
        break
    }

    return new this.VehicleClass(options)
  }
}

class CarFactory extends VehicleFactory {
  constructor() {
    super()
    this.VehicleClass = Car
  }
}

class TruckFactory extends VehicleFactory {
  constructor() {
    super()
    this.VehicleClass = Truck
  }
}

const vehicleFactory = new VehicleFactory()
const car = vehicleFactory.createVehicle({
  vehicleType: 'car',
  color: 'yellow',
  doors: 6,
})
const movingTruck = vehicleFactory.createVehicle({
  vehicleType: 'truck',
  state: 'like new',
  color: 'red',
  wheelSize: 'small',
})

const truckFactory = new TruckFactory()
const bigTruck = truckFactory.createVehicle({
  state: 'bad.',
  color: 'pink',
  wheelSize: 'so big',
})
```

## Asynchronous

```ts
class DataContainer {
  #data
  #active = false

  #init(data) {
    this.#active = true
    this.#data = data
    return this
  }

  #check() {
    if (!this.#active)
      throw new TypeError('Not created by factory')
  }

  getData() {
    this.#check()
    return `DATA: ${this.#data}`
  }

  static async create() {
    const data = await Promise.resolve('downloaded')
    return new this().#init(data)
  }
}

DataContainer.create().then(dc =>
  assert.equal(dc.getData(), 'DATA: downloaded')
)
```
