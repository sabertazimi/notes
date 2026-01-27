---
sidebar_position: 3
tags: [Programming, Design, Design Pattern, Creation Pattern]
---

# Builder

Flexible object creation with chain style calls.

```ts
class Person {
  constructor() {
    this.streetAddress = ''
    this.postcode = ''
    this.city = ''
    this.companyName = ''
    this.position = ''
    this.annualIncome = 0
  }

  toString() {
    return (
      `Person lives at ${this.streetAddress}, ${this.city}, ${this.postcode}\n`
      + `and works at ${this.companyName} as a ${this.position} earning ${this.annualIncome}`
    )
  }
}

class PersonBuilder {
  constructor(person = new Person()) {
    this.person = person
  }

  get lives() {
    return new PersonAddressBuilder(this.person)
  }

  get works() {
    return new PersonJobBuilder(this.person)
  }

  build() {
    return this.person
  }
}

class PersonJobBuilder extends PersonBuilder {
  constructor(person) {
    super(person)
    console.log('New')
  }

  at(companyName) {
    this.person.companyName = companyName
    return this
  }

  asA(position) {
    this.person.position = position
    return this
  }

  earning(annualIncome) {
    this.person.annualIncome = annualIncome
    return this
  }
}

class PersonAddressBuilder extends PersonBuilder {
  constructor(person) {
    super(person)
    console.log('New')
  }

  at(streetAddress) {
    this.person.streetAddress = streetAddress
    return this
  }

  withPostcode(postcode) {
    this.person.postcode = postcode
    return this
  }

  in(city) {
    this.person.city = city
    return this
  }
}

const personBuilder = new PersonBuilder()
const person = personBuilder.lives
  .at('ABC Road')
  .in('Multan')
  .withPostcode('66000')
  .works
  .at('Beijing')
  .asA('Engineer')
  .earning(10000)
  .build()
```
