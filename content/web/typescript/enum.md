---
sidebar_position: 4
tags: [Web, TypeScript, Enum]
---

# Enum

## Number

```ts
enum CardSuit {
  Clubs = 1,
  Diamonds, // 2
  Hearts, // 3
  Spades, // 4
}

// 简单的使用枚举类型
let Card = CardSuit.Clubs

// 类型安全
Card = 'not a member of card suit' // Error: string 不能赋值给 `CardSuit` 类型
```

## String

```ts
enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA = 'passport_visa',
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id',
  SIGHTED_KEYPASS_CARD = 'sighted_keypass_card',
  SIGHTED_PROOF_OF_AGE_CARD = 'sighted_proof_of_age_card',
}
```

## Parameters

```ts
enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

namespace Weekday {
  export function isBusinessDay(day: Weekday) {
    switch (day) {
      case Weekday.Saturday:
      case Weekday.Sunday:
        return false
      default:
        return true
    }
  }
}

const mon = Weekday.Monday
const sun = Weekday.Sunday

console.log(Weekday.isBusinessDay(mon)) // true
console.log(Weekday.isBusinessDay(sun))
```

## Flags

```ts
enum AnimalFlags {
  None = 0,
  HasClaws = 1 << 0,
  CanFly = 1 << 1,
  EatsFish = 1 << 2,
  Endangered = 1 << 3,

  EndangeredFlyingClawedFishEating = HasClaws | CanFly | EatsFish | Endangered,
}

interface Animal {
  flags: AnimalFlags
  [key: string]: any
}

function printAnimalAbilities(animal: Animal) {
  const animalFlags = animal.flags
  if (animalFlags & AnimalFlags.HasClaws)
    console.log('animal has claws')

  if (animalFlags & AnimalFlags.CanFly)
    console.log('animal can fly')

  if (animalFlags === AnimalFlags.None)
    console.log('nothing')
}

const animal = { flags: AnimalFlags.None }
printAnimalAbilities(animal) // nothing
animal.flags |= AnimalFlags.HasClaws
printAnimalAbilities(animal) // animal has claws
animal.flags &= ~AnimalFlags.HasClaws
printAnimalAbilities(animal) // nothing
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly
printAnimalAbilities(animal) // animal has claws, animal can fly
```

## Index Signature

`keyof typeof EnumType`:

```ts
enum ColorPalette {
  red = '#f03e3e',
  pink = '#d7336c',
  grape = '#ae3ec9',
  violet = '#7048e8',
  indigo = '#4263eb',
  blue = '#1890ff',
  cyan = '#1098ad',
  teal = '#0ca678',
  green = '#37b24d',
  lime = '#74b816',
  yellow = '#f59f00',
  orange = '#f76707',
}

function hashString(name = '') {
  return name.length
}

function getColorByName(name = ''): string {
  const palette = Object.keys(ColorPalette)
  const colorIdx = hashString(name) % palette.length
  const paletteIdx = palette[colorIdx] as keyof typeof ColorPalette
  return ColorPalette[paletteIdx]
}
```

## Internals

`const` enums don’t have representation at runtime,
its member values are used directly.

```ts
// Source code:
const enum NoYes {
  No,
  Yes,
}

function toGerman(value: NoYes) {
  switch (value) {
    case NoYes.No:
      return 'Neither'
    case NoYes.Yes:
      return 'Ja'
  }
}

// Compiles to:
function toGerman(value) {
  switch (value) {
    case 'No' /* No */:
      return 'Neither'
    case 'Yes' /* Yes */:
      return 'Ja'
  }
}
```

Non-const enums are objects:

```ts
// Source code:
enum Tristate {
  False,
  True,
  Unknown,
}

// Compiles to:
let Tristate
;(function (Tristate) {
  Tristate[(Tristate.False = 0)] = 'False'
  Tristate[(Tristate.True = 1)] = 'True'
  Tristate[(Tristate.Unknown = 2)] = 'Unknown'
})(Tristate || (Tristate = {}))

console.log(Tristate[0]) // 'False'
console.log(Tristate.False) // 0
console.log(Tristate[Tristate.False]) // 'False' because `Tristate.False == 0`
```

```ts
enum NoYes {
  No = 'NO!',
  Yes = 'YES!',
}

let NoYes
;(function (NoYes) {
  NoYes.No = 'NO!'
  NoYes.Yes = 'YES!'
})(NoYes || (NoYes = {}))
```
