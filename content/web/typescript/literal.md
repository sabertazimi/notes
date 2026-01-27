---
sidebar_position: 9
tags: [Web, TypeScript, Literal, String, Template Literal]
---

# Literal

```ts
type CardinalDirection = 'North' | 'East' | 'South' | 'West'

function move(distance: number, direction: CardinalDirection) {
  // ...
}

move(1, 'North') // ok
move(1, 'Nurth') // Error

type OneToFive = 1 | 2 | 3 | 4 | 5
type Bools = true | false
```

```ts
interface Options {
  width: number
}

function configure(x: Options | 'auto') {
  // ...
}

configure({ width: 100 })
configure('auto')
configure('automatic')
// ERROR:
// Argument of type '"automatic"' is not assignable
// to parameter of type 'Options | "auto"'.
```

## Template Literal

### Basic

Based on literal types:

```ts
type Brightness = 'dark' | 'light'
type Color = 'blue' | 'red'
type BrightnessAndColor = `${Brightness}-${Color}`
// Equivalent to: "dark-red" | "light-red" | "dark-blue" | "light-blue"

const colorOk: BrightnessAndColor = 'dark-blue' // Ok
const colorWrongStart: BrightnessAndColor = 'medium-blue'
//  ~~~~~~~~~~~~~~~
// Error: Type '"medium-blue"' is not assignable to type
// '"dark-blue" | "dark-red" | "light-blue" | "light-red"'.
const colorWrongEnd: BrightnessAndColor = 'light-green'
//  ~~~~~~~~~~~~~
// Error: Type '"light-green"' is not assignable to type
// '"dark-blue" | "dark-red" | "light-blue" | "light-red"'.
```

### Intrinsic

4 intrinsic string manipulation types:

- `Uppercase<StringType>`.
- `Lowercase<StringType>`.
- `Capitalize<StringType>`.
- `Uncapitalize<StringType>`.

### Advanced

Combined with other types:

```ts
type Greeting = `Hello${string}`
const matches: Greeting = 'Hello, world!' // Ok
const outOfOrder: Greeting = 'World! Hello!'
//  ~~~~~~~~~~
// Error: Type '"World! Hello!"' is not assignable to type '`Hello ${string}`'.
const missingAltogether: Greeting = 'hi'
//  ~~~~~~~~~~~~~~~~~
// Error: Type '"hi"' is not assignable to type '`Hello ${string}`'.

type ExtolNumber = `much ${number} wow`
function extol(extolArg: ExtolNumber) {
  /* ... */
}
extol('much 0 wow') // Ok
extol('much -7 wow') // Ok
extol('much 9.001 wow') // Ok
extol('much false wow')
//    ~~~~~~~~~~~~~~~~
// Error: Argument of type '"much false wow"' is not
// assignable to parameter of type '`much ${number} wow`'.
```

```ts
interface PropEventSource<Type> {
  on: <Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ) => void
}

// Create a "watched object" with an 'on' method
// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>

const person = makeWatchedObject({
  firstName: 'Yi',
  lastName: 'Long',
  age: 26,
})

person.on('firstNameChanged', (newName) => {
  // (parameter) newName: string
  console.log(`new name is ${newName.toUpperCase()}`)
})

person.on('ageChanged', (newAge) => {
  // (parameter) newAge: number
  if (newAge < 0)
    console.warn('warning! negative age')
})

// It's typo-resistant
person.on('firstName', () => {})
// Argument of type '"firstName"' is not assignable to
// parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.

person.on('fstNameChanged', () => {})
// Argument of type '"fstNameChanged"' is not assignable to
// parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
```

## Mapped Template Literal

### Keys

```ts
type DataKey = 'location' | 'name' | 'year'

type ExistenceChecks = {
  [K in `check${Capitalize<DataKey>}`]: () => boolean
}
// Equivalent to:
// {
//   checkLocation: () => boolean;
//   checkName: () => boolean;
//   checkYear: () => boolean;
// }

function checkExistence(checks: ExistenceChecks) {
  checks.checkLocation() // Type: boolean
  checks.checkName() // Type: boolean
  checks.checkWrong()
  //     ~~~~~~~~~~
  // Error: Property 'checkWrong' does not exist on type 'ExistenceChecks'.
}
```

### Remapping Mapped Keys

```ts
const config = {
  location: 'unknown',
  name: 'anonymous',
  year: 0,
}

type LazyValues = {
  [K in keyof typeof config as `${string & K}Lazy`]: () => Promise<
    (typeof config)[K]
  >
}
// Equivalent to:
// {
//   locationLazy: Promise<string>;
//   nameLazy: Promise<string>;
//   yearLazy: Promise<number>;
// }

async function withLazyValues(configGetter: LazyValues) {
  await configGetter.locationLazy // Resultant type: string
  await configGetter.missingLazy()
  //                 ~~~~~~~~~~~
  // Error: Property 'missingLazy' does not exist on type 'LazyValues'.
}
```
