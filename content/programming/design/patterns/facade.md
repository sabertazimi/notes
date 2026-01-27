---
sidebar_position: 10
tags: [Programming, Design, Design Pattern, Structural Pattern]
---

# Facade

封装复杂逻辑:

将多个复杂的子系统`封装 + 合并`,
实现一个复杂功能,
但只暴露一个简单的接口.

```ts
class CPU {
  freeze() {
    console.log('Freezed....')
  }

  jump(position) {
    console.log('Go....')
  }

  execute() {
    console.log('Run....')
  }
}

class Memory {
  load(position, data) {
    console.log('Load....')
  }
}

class HardDrive {
  read(lba, size) {
    console.log('Read....')
  }
}

class ComputerFacade {
  constructor() {
    this.processor = new CPU()
    this.ram = new Memory()
    this.hd = new HardDrive()
  }

  start() {
    this.processor.freeze()
    this.ram.load(
      this.BOOT_ADDRESS,
      this.hd.read(this.BOOT_SECTOR, this.SECTOR_SIZE)
    )
    this.processor.jump(this.BOOT_ADDRESS)
    this.processor.execute()
  }
}

const computer = new ComputerFacade()
computer.start()
```

```ts
sabertazimi.addMyEvent = function (el, ev, fn) {
  if (el.addEventListener)
    el.addEventListener(ev, fn, false)
  else if (el.attachEvent)
    el.attachEvent(`on${ev}`, fn)
  else el[`on${ev}`] = fn
}
```
