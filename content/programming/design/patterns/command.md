---
sidebar_position: 14
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Command

需要向某些对象发送请求:

- 解耦命令: 不清楚请求具体操作.
- 解耦接收者: 不清楚请求的接收者 (多个对象中的某个随机对象).

此时希望用一种松耦合的方式来设计程序, 使得请求发送者和请求接收者能够消除彼此的耦合关系:

- 将方法/动作封装成对象, 使得外部通过唯一方法 `execute()`/`run()` 调用内部方法/动作.
- 解耦三者: 客户创建命令, 调用者执行该命令, 接收者在命令执行时执行相应操作.
  - 客户通常被包装为一个命令对象.
  - 调用者接过命令并将其保存下来, 它会在某个时候调用该命令对象的 `Command.execute()` 方法.
  - 调用者调用 `Command.execute()` 后, 最终将调用接收者方法 `Receiver.action()`.

:::tip[Command Use Case]

- Decouple `Executor` and `Receiver`.
- GUI applications: bind `Command` to UI components.
- Command sequences (store commands + `Composite` pattern) for batch processing:
  `Macro`/`Batch`/`Undo`/`Redo` feature.
- Command queue (cache commands + `Observer` pattern) for transaction management:
  `Redis`/`RabbitMQ`/`Kafka`.

:::

在 JS 中, `Closure` + `Callback` (`Higher Order Function`) 可以实现隐式的命令模式:

- `Closure` 捕获 `Receiver` (面向对象语言中, `Command` 对象需要持有 `Receiver` 对象).
- `Callback` 函数实现具体逻辑 (面向对象语言中, 需要将其封装进 `Command.execute()` 对象方法).

```ts
// Higher order function
const Command = receiver => () => receiver.action()
```

Bind `Command` to UI components:

- `Executor`: UI components.
- `Client` and `Receiver`: background tasks or other UI components.
- `Executor` -> `Client` `Command.execute()` -> `Receiver.action()`:
  e.g. click `button` -> refresh `menu`.

```ts
// Executor
class Button {
  commands = new Set()

  add(command) {
    this.commands.set(command)
  }

  click() {
    for (const command of this.commands) command.execute()
  }
}

// Client: command object, `action` implemented
class Command {
  constructor(receiver) {
    this.receiver = receiver
  }

  execute() {
    this.receiver.action()
  }
}

// Receiver
class MenuBar {
  action() {
    this.refresh()
  }

  refresh() {
    console.log('refresh menu pages')
  }
}

const button = new Button()
const menuBar = new MenuBar()
const refreshMenuBarCommand = new Command(menuBar)

button.add(refreshMenuBarCommand)
button.click()
```

```ts
class MenuCommand {
  constructor(action) {
    this.action = action
  }

  execute() {
    this.action()
  }
}

// --------------
const appMenuBar = new MenuBar()

// --------------
const fileActions = new FileActions()
const EditActions = new EditActions()
const InsertActions = new InsertActions()
const HelpActions = new HelpActions()

// --------------
const openCommand = new MenuCommand(fileActions.open)
const closeCommand = new MenuCommand(fileActions.close)
const saveCommand = new MenuCommand(fileActions.save)
const saveAsCommand = new MenuCommand(fileActions.saveAs)
const fileMenu = new Menu('File')
fileMenu.add(new MenuItem('open', openCommand))
fileMenu.add(new MenuItem('Close', closeCommand))
fileMenu.add(new MenuItem('Save', saveCommand))
fileMenu.add(new MenuItem('Close', saveAsCommand))
appMenuBar.add(fileMenu)

// --------------
const cutCommand = new MenuCommand(EditActions.cut)
const copyCommand = new MenuCommand(EditActions.copy)
const pasteCommand = new MenuCommand(EditActions.paste)
const deleteCommand = new MenuCommand(EditActions.delete)
const editMenu = new Menu('Edit')
editMenu.add(new MenuItem('Cut', cutCommand))
editMenu.add(new MenuItem('Copy', copyCommand))
editMenu.add(new MenuItem('Paste', pasteCommand))
editMenu.add(new MenuItem('Delete', deleteCommand))
appMenuBar.add(editMenu)

// --------------
const textBlockCommand = new MenuCommand(InsertActions.textBlock)
const insertMenu = new Menu('Insert')
insertMenu.add(new MenuItem('Text  Block', textBlockCommand))
appMenuBar.add(insertMenu)

// --------------
const showHelpCommand = new MenuCommand(HelpActions.showHelp())
const helpMenu = new Menu('Help')
helpMenu.add(new MenuItem('Show Help', showHelpCommand))
appMenuBar.add(helpMenu)

// --------------
document.getElementsByTagName('body')[0].appendChild(appMenuBar.getElement())
appMenuBar.show()
```

Command sequences to implement `Macro`/`Batch`/`Undo`/`Redo` feature:

```ts
class Cursor {
  constructor(width, height, parent) {
    this.commandStack = []
    this.width = width
    this.height = height

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    parent.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = '#CCC000'
    this.move(0, 0)
  }

  move(x, y) {
    this.commandStack.push(() => {
      // `this` point to `Cursor`.
      this.lineTo(x, y)
    })
  }

  lineTo(x, y) {
    this.position.x += x
    this.position.y += y
    this.ctx.lineTo(this.position.x, this.position.y)
  }

  executeCommands() {
    this.position = { x: this.width / 2, y: this.height / 2 }
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.beginPath()
    this.ctx.moveTo(this.position.x, this.position.y)

    for (let i = 0; i < this.commandStack.length; i++) this.commandStack[i]()

    this.ctx.stroke()
  }

  undo() {
    this.commandStack.pop()
    this.executeCommands()
  }
}
```
