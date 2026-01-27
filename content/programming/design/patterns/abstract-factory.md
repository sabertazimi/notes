---
sidebar_position: 2
tags: [Programming, Design, Design Pattern, Creation Pattern]
---

# Abstract Factory

Encapsulate **a group of individual factories**
that have a common theme without
specifying their concrete classes.

```ts
class Drink {
  consume() {}
}

class Tea extends Drink {
  consume() {
    console.log('This is Tea')
  }
}

class Coffee extends Drink {
  consume() {
    console.log(`This is Coffee`)
  }
}

class DrinkFactory {
  prepare(amount) {}
}

class TeaFactory extends DrinkFactory {
  makeTea() {
    console.log(`Tea Created`)
    return new Tea()
  }
}

class CoffeeFactory extends DrinkFactory {
  makeCoffee() {
    console.log(`Coffee Created`)
    return new Coffee()
  }
}

const teaDrinkFactory = new TeaFactory()
const tea = teaDrinkFactory.makeTea()
tea.consume()
```

```ts
class AbstractVehicleFactory {
  constructor() {
    // Vehicle types
    this.types = {}
  }

  getVehicle(type, customizations) {
    const Vehicle = this.types[type]

    return Vehicle ? new Vehicle(customizations) : null
  }

  registerVehicle(type, Vehicle) {
    const proto = Vehicle.prototype

    // Only register classes that fulfill the vehicle contract
    if (proto.drive && proto.breakDown)
      this.types[type] = Vehicle

    return this
  }
}

// Usage:
const abstractVehicleFactory = new AbstractVehicleFactory()
  .registerVehicle('car', Car)
  .registerVehicle('truck', Truck)

// Instantiate a new car based on the abstract vehicle type
const car = abstractVehicleFactory.getVehicle('car', {
  color: 'lime green',
  state: 'like new',
})

// Instantiate a new truck in a similar manner
const truck = abstractVehicleFactory.getVehicle('truck', {
  wheelSize: 'medium',
  color: 'neon yellow',
})
```
