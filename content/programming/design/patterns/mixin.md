---
sidebar_position: 24
tags: [Programming, Design, Design Pattern, Dependency Pattern]
---

# Mixin

将多个对象的属性混入同一个对象, 达到继承/扩展/组合的效果.
React and Vue drop `Mixin`:

- Prototype pollution
- Dependency uncertainty.

## Prototype

```ts
// Extend an existing object with a method from another
function mixin(...args) {
  const receivingClass = args[0]
  const givingClass = args[1]

  // Mixin provide certain methods
  if (args[2]) {
    for (let i = 2, len = args.length; i < len; i++)
      receivingClass.prototype[args[i]] = givingClass.prototype[args[i]]
  } else {
    // Mixin provide obj
    for (const methodName in givingClass.prototype) {
      if (!receivingClass.prototype[methodName])
        receivingClass.prototype[methodName] = givingClass.prototype[methodName]
    }
  }
}
```

## Class

```ts
function MoveMixin(superclass) {
  return class extends superclass {
    moveUp() {
      console.log('move up')
    }

    moveDown() {
      console.log('move down')
    }

    stop() {
      console.log('stop! in the name of love!')
    }
  }
}

class CarAnimator {
  moveLeft() {
    console.log('move left')
  }
}

class PersonAnimator {
  moveRandomly() {
    console.log('move randomly')
  }
}

class Animator extends MoveMixin(CarAnimator) {}

const animator = new Animator()
animator.moveLeft()
animator.moveDown()
animator.stop()
// Outputs:
// move left
// move down
// stop! in the name of love!
```

```ts
// 所有 mixins 都需要:
type Constructor<T = NonNullable<unknown>> = new (...args: any[]) => T

/////////////
// mixins 例子
////////////

// 添加属性的混合例子
function TimesTamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now()
  }
}

// 添加属性和方法的混合例子
function ActiveTable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false

    activate() {
      this.isActivated = true
    }

    deactivate() {
      this.isActivated = false
    }
  }
}

///////////
// 组合类
///////////

// 简答的类
class User {
  name = ''
}

// 添加 TimesTamped 的 User
const TimestampedUser = TimesTamped(User)

// Tina TimesTamped 和 ActiveTable 的类
const TimestampedActiveTableUser = TimesTamped(ActiveTable(User))

//////////
// 使用组合类
//////////

const timestampedUserExample = new TimestampedUser()
console.log(timestampedUserExample.timestamp)

const timestampedActiveTableUserExample = new TimestampedActiveTableUser()
console.log(timestampedActiveTableUserExample.timestamp)
console.log(timestampedActiveTableUserExample.isActivated)
```
