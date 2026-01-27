---
sidebar_position: 21
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Template Method

- Abstract superclass defines the skeleton of an operation
  in terms of a number of high-level steps.
- 通过封装变化提高系统扩展性.
- 符合开放封闭原则.
- 在 JS 中, 高阶函数可以隐式地实现模板方法模式.

:::tip[Template Method Use Case]

- APIs and SDKs.
- Plugins and Extensions: VSCode extension, Vue plugin.
- Hooks and Callbacks: React/Vue lifecycles, Webpack hooks.
- Software Architecture.

:::

```ts
class Game {
  constructor(numberOfPlayers) {
    this.numberOfPlayers = numberOfPlayers
    this.currentPlayer = 0
  }

  run() {
    this.start()
    while (!this.haveWinner) this.takeTurn()

    console.log(`Player ${this.winningPlayer} wins.`)
  }

  start() {
    throw new Error('Unimplemented `start` method!')
  }

  takeTurn() {
    throw new Error('Unimplemented `takeTurn` method!')
  }

  get haveWinner() {
    return this.haveWinner
  }

  get winningPlayer() {
    return this.winningPlayer
  }
}

class Chess extends Game {
  constructor() {
    super(2)
    this.maxTurns = 10
    this.turn = 1
  }

  start() {
    console.log(
      `Starting a game of chess with ${this.numberOfPlayers} players.`
    )
  }

  get haveWinner() {
    return this.turn === this.maxTurns
  }

  takeTurn() {
    console.log(`Turn ${this.turn++} taken by player ${this.currentPlayer}.`)
    this.currentPlayer = (this.currentPlayer + 1) % this.numberOfPlayers
  }

  get winningPlayer() {
    return this.currentPlayer
  }
}

const chess = new Chess()
chess.run()
```
