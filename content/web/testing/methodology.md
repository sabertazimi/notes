---
sidebar_position: 1
tags: [Web, Testing]
---

# Methodology

## Pyramid

- Unit testing.
- Module testing.
- Integration testing.
- System testing.
- E2E testing.

## Model

### PIE

- (Execution) Fault.
- (Infection) Error.
- (Propagation) Failure.

### Heuristic Strategy

软件功能测试 (难以实现完全自动化):

- 关注价值(Value)：用户得到价值
- 风险驱动(Risk)：降低价值/用户体验的风险项
- 产品元素(Product Elements)
- 结构(Structure):产品物理元素(如代码、硬件、配置文件)
- 功能(Function):产品功能
- 数据(Data):产品所操作的数据(如输入、输出)
- 接口(Interface):产品所使用/暴露出的接口
- 平台(Platform):产品所依赖的外部元素(如操作系统、输入/输出设备)
- 操作(Operation):产品被使用的方式(如键盘、鼠标、触摸等命令操作)
- 时间(Time):影响产品的时间因素
- 组合元素:测试产品功能间协作

### User Experience

对软件功能测试的有益补充:

- 功能性体验
- 易用性体验
- 性能体验
- 可靠性体验(如软件兼容性)

### Mobile

- 机型碎片化.
- 屏幕碎片化.
- 环境碎片化.
- 耗电量.

## Patterns

### FAIR

- Fast tests:
  break down into small separate and well structured tests.
- Automated tests.
- Isolated tests:
  any particular test should not depend on any others.
- Repeatable tests:
  mock everything you can't control:
  - 3rd-party libraries.
  - 3rd-party APIs.
  - Timer API: `jest.useFakerTimers()`/`jest.advanceTimersByTime()`/`cy.clock()`.
  - `Date` API: `jest.spyOn(Date.prototype)`/`cy.tick()`.
  - `Math.random()` API: `jest.spyOn()`/`jest.mock()`/`cy.stub()`.
- 如果不能保持测试套件的**确定性**和**速度**, 那么它将成为生产力的障碍.

### AAA

Structure every test to 3 part code:

- Arrange.
- Act.
- Assert.

### 测试路径

起始顶点至终止顶点.

## Methods

- Positive tests:
  valid inputs,
  verify functions.
- Negative tests:
  invalid inputs (e.g. `null`/`undefined`/`''`/mismatch type/mismatch structure)
  verify robustness.
- Exception tests:
  `expect(api()).toThrow(error)`.
- Bottom-up testing:
  gives more granular feedback but slows down iteration speed.
- Top-down testing:
  allows to iterate more quickly but will generate more coarse feedback.

### 图结构

- 顶点覆盖,边覆盖,边对覆盖(三顶点,两邻边)
- VC/EC/EPC 法

### 数据流

- 数据流覆盖:定义处覆盖,使用处覆盖
- DU 法(Data&Use)

### 逻辑测试

- 逻辑覆盖:条件处覆盖,判定处覆盖
- DC(Decision),CC(Condition)法
- MC/DC 法
- MCC 法(完全覆盖)

### 随机测试

- ART(随机测试):每个用例间"距离"尽可能远

### 黑盒测试

- 等价类划分:合法输入(软件功能),非法输入(异常处理)
- 等价类的边界值分析:合法 MIN,MIN+,MAX-,MAX 非法:MIN-,MAX+
- 决策表+组合测试:简化决策表(考虑输入相关性)
  - 组合用例:维度与测试准度成正比
  - 约束用例:需避开约束输入(输入相关性,同时输入会成为无效输入)
  - 测试用例约简+测试用例优先级:额外贪心算法进行化简+排序测试用例求得近似解

### Fault Location

- 代码可疑度=
  (失败测试用例经过数/失败测试用例总数)/
  (成功测试用例经过数/成功测试用例总数+失败测试用例经过数/失败测试用例总数)

即在执行过目标代码的测试用例中失败测试用例占比

### Fuzzing

Fuzzing 是一种通过向目标系统提供非预期的输入并监视异常结果来发现软件漏洞的方法.

## Testable Code

- 完整注释.
- 最小复杂度 = (扇入 `*` 扇出) ^ 2.
- 可隔离性: 最小依赖性 + 松耦合性.
- 使用依赖注入, 将外部对象移至函数参数处(不在函数内部调用构造器): 易于构造 mock/stub, 降低扇出(函数复杂度).

### 圈复杂度

`V(G) = e - n + 2`: `**<10**`.

### 函数复杂度

函数复杂度 = (扇入 `*` 扇出) ^ 2.

### 扇出

引用:

- 所引用外部对象/方法之和.
- 扇出: `**<7**`.
- 高扇出: 高复杂度/高依赖性/高耦合度.

### 扇入

被引用:

- 其他对象/方法引用此函数的次数之和.
- 低扇入: 顶层代码, 不常用模块.
- 高扇入: 标准库与工具类, 高扇入模块需要保持稳定.

### 耦合度

#### 内容耦合

5 级耦合度:

```ts
O.property = 'tazimi'
O.method = function () {}
O.prototype.method = function () {}
```

#### 公共耦合

4 级耦合度, 共享全局变量:

```ts
let Global = 'global'

function A() {
  Global = 'A'
}
function B() {
  Global = 'B'
}
```

#### 控制耦合

3 级耦合度:

```ts
const absFactory = new AbstractFactory({ env: 'TEST' })
```

#### 印记耦合

2 级耦合度:

```ts
O.prototype.makeBread = function (args) {
  return new Bread(args.type, args.size)
}

O.makeBread({ type: wheat, size: 99, name: 'foo' })
```

#### 数据耦合

1 级耦合度.

#### 无耦合

0 级耦合度.

## Units

### Principles

- 代码覆盖率.
- 非法值测试.
- 边界测试.
- 非边界测试.

### Code Isolation

- 编写代码时, 保持最小复杂度(最小依赖, 最低耦合).
- 利用 mock/stub 模拟外部依赖/测试数据.

### Mocks

- mock: 模拟对象中的方法/接口
- stub: 模拟对象中的返回值
- spy: 在原有对象的基础上, 增加监视用变量/方法 e.g. assert/调用次数/参数限制

```ts
const mockery = require('mockery')

mockery.enable()

describe('Sum suite File', () => {
  beforeEach(() => {
    mockery.registerAllowable('./mySumFS', true)
  })

  afterEach(() => {
    mockery.deregisterAllowable('./mySumFS')
  })

  it('Adds Integers!', () => {
    const filename = 'numbers'
    const fsMock = {
      readFileSync(path, encoding) {
        expect(path).toEqual(filename)
        expect(encoding).toEqual('utf8')
        return JSON.stringify({ a: 9, b: 3 })
      },
    }

    mockery.registerMock('fs', fsMock)
    const mySum = require('./mySumFS')
    expect(mySum.sum(filename)).toEqual(12)
    mockery.deregisterMock('fs')
  })
})
```

## Headless Automation

Puppeteer [recipes](https://addyosmani.com/blog/puppeteer-recipes):

```ts
const puppeteer = require('puppeteer')

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto('https://example.com')
await page.screenshot({ path: 'example.png' })
await browser.close()
```

- `page.setOfflineMode`
- `page.setGeolocation`
- `page.metrics`
- `page.accessibility`
- `page.coverage`

### Browser Context

```ts
// Create a new incognito browser context
const context = await browser.createIncognitoBrowserContext()
// Create a new page inside context.
const page = await context.newPage()
// ... do stuff with page ...
await page.goto('https://example.com')
// Dispose context once it's no longer needed.
await context.close()
```

### DOM

`page.$(selector)` same to `querySelector`

### Events

```ts
// wait for selector
await page.waitFor('.foo')
// wait for 1 second
await page.waitFor(1000)
// wait for predicate
await page.waitFor(() => !!document.querySelector('.foo'))
```

```ts
const puppeteer = require('puppeteer')

puppeteer.launch().then(async (browser) => {
  const page = await browser.newPage()
  const watchDog = page.waitForFunction('window.innerWidth < 100')
  await page.setViewport({ width: 50, height: 50 })
  await watchDog
  await browser.close()
})
```

```ts
const [response] = await Promise.all([
  page.waitForNavigation(), // The promise resolves after navigation has finished
  page.click('a.my-link'), // Clicking the link will indirectly cause a navigation
])
```

```ts
const firstRequest = await page.waitForRequest('http://example.com/resource')
const finalRequest = await page.waitForRequest(
  request =>
    request.url() === 'http://example.com' && request.method() === 'GET'
)
return firstRequest.url()
```

```ts
const firstResponse = await page.waitForResponse('https://example.com/resource')
const finalResponse = await page.waitForResponse(
  response =>
    response.url() === 'https://example.com' && response.status() === 200
)
return finalResponse.ok()
```

```ts
await page.evaluate(() => window.open('https://www.example.com/'))
const newWindowTarget = await browserContext.waitForTarget(
  target => target.url() === 'https://www.example.com/'
)
```

### Operation Simulation

```ts
const [response] = await Promise.all([
  page.waitForNavigation(waitOptions),
  page.click(selector, clickOptions),
])
```

```ts
// Using ‘page.mouse’ to trace a 100x100 square.
await page.mouse.move(0, 0)
await page.mouse.down()
await page.mouse.move(0, 100)
await page.mouse.move(100, 100)
await page.mouse.move(100, 0)
await page.mouse.move(0, 0)
await page.mouse.up()
```

```ts
await page.keyboard.type('Hello World!')
await page.keyboard.press('ArrowLeft')

await page.keyboard.down('Shift')
for (let i = 0; i < ' World'.length; i++) await page.keyboard.press('ArrowLeft')
await page.keyboard.up('Shift')

await page.keyboard.press('Backspace')
// Result text will end up saying 'Hello!'
```

### Tracing

```ts
await page.tracing.start({ path: 'trace.json' })
await page.goto('https://www.google.com')
await page.tracing.stop()
```

## Test-Driven Development

- Reduce costs: find bugs early.
- Reduce fear and anxiety.
- Lead to better-designed and more testable code.
- Make tests more thorough (彻底的).
  Easy to refactor legacy code.

### Workflow

- Pure function.
  - 工具函数.
  - 数据转换函数.
  - 后端接口函数.
- Bug fix:
  - Add failed testing first.
  - One bug fixed, one or more testing added.
- UI interaction.

## Library

- Jest.
- Jasmine.
- Mocha.
- Cypress/PlayWright/Puppeteer.
- 用户行为: Karma/Selenium.
- 功能测试: Phantom.js/Slimer.js/Karma.
- JUnit.
- SeleniumIDE.
- PICT.
- GuiTar.
- Randoop.
- Apache Jmeter: 压力测试.
- Monkey: Random testing.

## References

- JavaScript testing [best practices](https://github.com/goldbergyoni/javascript-testing-best-practices).
