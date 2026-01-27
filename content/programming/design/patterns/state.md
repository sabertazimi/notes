---
sidebar_position: 19
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# State

一个 State 对象封装一个与状态相关的行为,
运用有限状态机 (Finite State Machines)
根据 Object State 改变 Object Behavior,
`object` set `state` as its **member**,
`state` set `object` as its **method parameter**:

- 每一种状态和它对应的行为之间的关系局部化:
  - 状态具体行为封装在状态类中, 便于阅读和管理代码.
  - 状态切换规则分布在状态类中, 有效地消除了大量条件分支语句.
- 符合开放封闭原则.

:::tip[State Use Case]

- Networking protocol stack.
- Game player logic.
- Workflow management.
- Finite state machines.

:::

```ts
class Switch {
  constructor() {
    this.state = new OffState()
  }

  on() {
    this.state.on(this)
  }

  off() {
    this.state.off(this)
  }
}

class State {
  constructor() {
    if (this.constructor === State)
      throw new Error('abstract!')
  }

  on(sw) {
    console.log('Light is already on.')
  }

  off(sw) {
    console.log('Light is already off.')
  }
}

class OnState extends State {
  constructor() {
    super()
    console.log('Light turned on.')
  }

  off(sw) {
    console.log('Turning light off...')
    sw.state = new OffState()
  }
}

class OffState extends State {
  constructor() {
    super()
    console.log('Light turned off.')
  }

  on(sw) {
    console.log('Turning light on...')
    sw.state = new OnState()
  }
}

const button = new Switch()
button.on()
button.off()
```
