---
sidebar_position: 16
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Mediator

一个 Mediator 对象封装对象间的协议 (中央集权的控制中心):

- Defines an object that encapsulates how a set of objects interact.
- 所有观察者共享一个共有的被观察者 (所有订阅者订阅同一个节点).
- 解除对象间的强耦合关系 (最少知识原则), 独立地改变对象间的交互方式.
- 网状的多对多关系 => 相对简单的一对多关系.
- 存在单点故障 (`Single Point of Failure`) 可能, 需要容灾备份.

:::tip[Mediator Use Case]

- 聊天室.
- 交通系统.
- 指挥中心.
- 游戏服务器.
- DOM event bubbling and delegation: `document` serves as a `Mediator`.
- Global state store: A action => store => B change.

:::

```ts
class Person {
  constructor(name) {
    this.name = name
    this.chatLog = []
  }

  receive(sender, message) {
    const s = `${sender}: '${message}'`
    console.log(`[${this.name}'s chat session] ${s}`)
    this.chatLog.push(s)
  }

  say(message) {
    this.room.broadcast(this.name, message)
  }

  pm(who, message) {
    this.room.message(this.name, who, message)
  }
}

class ChatRoom {
  constructor() {
    this.people = []
  }

  broadcast(source, message) {
    for (const p of this.people) {
      if (p.name !== source)
        p.receive(source, message)
    }
  }

  join(p) {
    const joinMsg = `${p.name} joins the chat`
    this.broadcast('room', joinMsg)
    p.room = this
    this.people.push(p)
  }

  message(source, destination, message) {
    for (const p of this.people) {
      if (p.name === destination)
        p.receive(source, message)
    }
  }
}

const room = new ChatRoom()
const zee = new Person('Zee')
const shan = new Person('Shan')

room.join(zee)
room.join(shan)
zee.say('Hello!!')

const doe = new Person('Doe')
room.join(doe)
doe.say('Hello everyone!')
```
