---
sidebar_position: 2
tags: [Web, Testing, Jest]
---

# Jest

## Installation

```bash
npm i -D jest ts-jest @types/jest react-test-renderer
```

## Configuration

`jest.config.js`:

```ts
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.json')

const paths = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/',
})

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.jsx?$': '<rootDir>/jest.transformer.js',
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/jest.mock.js',
    ...paths,
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/build'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  globals: {
    'window': {},
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  testURL: 'http://localhost',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.env.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/src/setupEnzyme.ts',
}
```

`jest.env.setup.js`:

```ts
import path from 'node:path'
import dotenv from 'dotenv'

console.log(`============ env-setup Loaded ===========`)
dotenv.config({
  path: path.resolve(process.cwd(), 'tests', 'settings', '.test.env'),
})
```

`jest.setup.js`:

- Mock missing JSDOM functions.
- Inject more expect DOM assertion.
- [Jest DOM Expect API](https://github.com/testing-library/jest-dom)

```ts
import '@testing-library/jest-dom'

// Global/Window object Stubs for Jest
window.matchMedia
  = window.matchMedia
    || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      }
    }

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

window.requestAnimationFrame = function (callback) {
  setTimeout(callback)
}

window.cancelAnimationFrame = window.clearTimeout

window.localStorage = {
  getItem() {},
  setItem() {},
}

Object.values = () => []
```

`vitest.config.ts`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
})
```

`tests/setup.ts`:

```ts
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
```

`setupEnzyme.ts`:

```ts
import { configure } from 'enzyme'
import * as EnzymeAdapter from 'enzyme-adapter-react-16'

configure({ adapter: new EnzymeAdapter() })
```

## Getting Started

- `describe` block.
- `test` statement.
- `it` statement.
- `test.todo`:
  - Skip empty todo tests.
  - Skip temporary broken tests.

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import LandingNav from './LandingNav'

describe('LandingNav', () => {
  test('should expanded when clicked', () => {
    render(<LandingNav />)

    expect(screen.getByRole('navigation')).toHaveStyle(
      'transform: translateX(-100%) translateZ(0);'
    )
    expect(screen.getByRole('banner')).toHaveStyle('opacity: 0')

    fireEvent.click(screen.getByTestId('hamburger-icon'))

    expect(screen.getByRole('navigation')).toHaveStyle(
      'transform: translateX(0%) translateZ(0);'
    )
    expect(screen.getByRole('banner')).toHaveStyle('opacity: 0.8')

    fireEvent.click(screen.getByTestId('hamburger-button'))

    expect(screen.getByRole('navigation')).toHaveStyle(
      'transform: translateX(-100%) translateZ(0);'
    )
    expect(screen.getByRole('banner')).toHaveStyle('opacity: 0')
  })
})
```

Use `userEvent` instead of `fireEvent`:

```tsx
import userEvent from '@testing-library/user-event'

// setup userEvent
function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

describe('Form', () => {
  it('should save correct data on submit', async () => {
    const mockSave = jest.fn()
    const { user } = setup(<Form saveData={mockSave} />)

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Test')
    await user.click(screen.getByRole('button', { name: 'Sign up' }))

    expect(mockSave).toHaveBeenLastCalledWith({ ...defaultData, name: 'Test' })
  })
})
```

Use `findBy` instead of `waitFor` + `getBy`:

```tsx
describe('ListPage', () => {
  it('renders without breaking', async () => {
    render(<ListPage />)
    expect(
      await screen.findByRole('heading', { name: 'List of items' }),
    ).toBeInTheDocument()
  })
})
```

## Snapshots

- When you run jest first time,
  it will produce an snapshot file.
- The next time run the tests,
  rendered output will be compared to previously created snapshot.
- If change is expected,
  use `jest -u` to overwrite existing snapshot.

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import ThemeSwitch from './ThemeSwitch'

describe('ThemeSwitch', () => {
  test('should switch dark mode when clicked', () => {
    const { container } = render(<ThemeSwitch />)

    fireEvent.click(screen.getByTestId('toggle-wrapper'))

    expect(container).toMatchSnapshot()
  })
})
```

## Asynchronous

Jest async [guide](https://jestjs.io/docs/tutorial-async):

```ts
await expect(asyncCall()).resolves.toEqual('Expected')
await expect(asyncCall()).rejects.toThrowError()
```

## Mocks

![Mocks](./figures/mocks.png 'Mocks')

### Utils

`__mocks__`:

- `jest.createMockFromModule('moduleName')`.
- `jest.requireActual('moduleName')`.

`spyOn`:

- `jest.spyOn().mockImplementation`.
- `jest.spyOn().mockReturnValue`.
- `jest.spyOn().mockReturnValueOnce`.
- `jest.spyOn().mockResolvedValue`.
- `jest.spyOn().mockRejectedValue`.
- `mockModule.mockClear`.
- `mockModule.mockReset`.
- `mockModule.mockRestore`.

### Module

```tsx
// react-dom.js
const reactDom = jest.requireActual('react-dom')

function mockCreatePortal(element, target) {
  return (
    <div>
      <div id="content">{element}</div>
      <div id="target" data-target-tag-name={target.tagName}></div>
    </div>
  )
}

reactDom.createPortal = mockCreatePortal

module.exports = reactDom
```

```ts
// gatsby.js
const gatsby = jest.requireActual('gatsby')

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest
    .fn()
    .mockImplementation(
      ({
        activeClassName,
        activeStyle,
        getProps,
        innerRef,
        partiallyActive,
        ref,
        replace,
        to,
        ...rest
      }) =>
        React.createElement('a', {
          ...rest,
          href: to,
        })
    ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
}
```

### Date

```ts
jest
  .spyOn(Date.prototype, 'toISOString')
  .mockReturnValue('2020-06-20T13:37:00.000Z')
```

### APIs

```ts
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const handlers = [
  rest.get('https://mysite.com/api/role', async (req, res, ctx) => {
    res(ctx.status(200), ctx.json({ userType: 'user' }))
  }),
]

const server = setupServer(...handlers)

export default server
```

```ts
import server from './mockServer/server'

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
```

```tsx
import type { UserRoleType } from './apis/user'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import AuthButton from './components/AuthButton'
import server from './mockServer/server'

function setup(userType: UserRoleType) {
  server.use(
    rest.get('https://mysite.com/api/role', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ userType }))
    })
  )
}

describe('AuthButton', () => {
  it('should render user text', async () => {
    setup('user')

    render(<AuthButton>Hello</AuthButton>)

    expect(await screen.findByText('Hello User')).toBeInTheDocument()
  })

  it('should render admin text', async () => {
    setup('admin')

    render(<AuthButton>Hello</AuthButton>)

    expect(await screen.findByText('Hello Admin')).toBeInTheDocument()
  })
})
```

## Internals

### Runtime Sandbox

Running tests in
[`ShadowRealms`](https://2ality.com/2022/04/shadow-realms.html#use-cases-for-shadowrealms):

```ts
// demo.test.js
import { test } from './TestLib.js'

test('succeeds', () => {
  assert.equal(3, 3)
})

test('fails', () => {
  assert.equal(1, 3)
})

// This statement can add by `babel`.

export default true

// TestLib.js
const testSuites = []

export function test(description, callback) {
  testSuites.push({ description, callback })
}

export function runTests() {
  const testResults = []

  for (const testSuite of testSuites) {
    try {
      testSuite.callback()
      testResults.push(`${testSuite.description}: OK\n`)
    } catch (err) {
      testResults.push(`${testSuite.description}: ${err}\n`)
    }
  }

  return testResults.join('')
}

// TestRunner.js
async function runTestModule(moduleSpecifier) {
  const sr = new ShadowRealm()
  await sr.importValue(moduleSpecifier, 'default')
  const runTests = await sr.importValue('./TestLib.js', 'runTests')
  const result = runTests()
  console.log(result)
}

await runTestModule('./demo.test.js')
```

### Test Runner

A simple
[test runner](https://github.com/typicode/xv)
implementation:

```ts
import { promises as fs } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = join(dir, d.name)

    if (d.isDirectory())
      yield* walk(entry)
    else if (d.isFile())
      yield entry
  }
}

async function runTestFile(file: string): Promise<void> {
  for (const value of Object.values(
    await import(pathToFileURL(file).toString())
  )) {
    if (typeof value === 'function') {
      try {
        await value()
      } catch (e) {
        console.error(e instanceof Error ? e.stack : e)
        process.exit(1)
      }
    }
  }
}

async function run(arg = '.') {
  if ((await fs.lstat(arg)).isFile())
    return runTestFile(arg)

  for await (const file of walk(arg)) {
    if (
      !dirname(file).includes('node_modules')
      && (basename(file) === 'test.js' || file.endsWith('.test.js'))
    ) {
      console.log(file)
      await runTestFile(file)
    }
  }
}

run(process.argv[2])
```

### Native Runner

Implement component testing with
[native `node:test` module](https://whistlr.info/2022/test-react-builtin):

```tsx
import assert from 'node:assert'
import test from 'node:test'
import { cleanup, render } from '@testing-library/react'
import jsdom from 'jsdom'

const j = new jsdom.JSDOM(undefined, {
  url: 'http://localhost', // Many APIs are confused without being "on a real URL"
  pretendToBeVisual: true, // This adds dummy requestAnimationFrame and friends
})

// We need to add everything on JSDOM's window object to global scope.
// We don't add anything starting with _, or anything that's already there.
Object.getOwnPropertyNames(j.window)
  .filter(k => !k.startsWith('_') && !(k in globalThis))
  .forEach(k => (globalThis[k] = j.window[k]))

// Finally, tell React 18+ that we are not really a browser.
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function reactTest(name, fn) {
  return test(name, () => {
    cleanup() // always cleanup first
    return fn()
  })
}

export default function FooComponent({ text }: { text: string }) {
  return (
    <div>
      Hello
      {' '}
      <span data-testid="hold">{text}</span>
    </div>
  )
}

reactTest('test component', () => {
  const result = render(<FooComponent name={Sam} />)
  assert.strictEqual(result.getByTestId('hold').textContent, 'Sam')
})
```

## Performance

`Jest` 的整体架构, 其中有 3 个地方比较耗性能:

- 生成虚拟文件系统 (`jest-haste-map`): 在跑第一个测试会很慢.
- 多线程: 生成新线程耗费的资源.
- 文件转译: `Jest` 会在执行到该文件再对它进行转译. 使用 `esbuild-jest`/`@swc/jest` 加速转译.

## Plugins

- Jest debug [tool](https://github.com/nvh95/jest-preview).
- Jest visual regression testing [tool](https://github.com/americanexpress/jest-image-snapshot).

## Best Practices

- Avoid [flaky testing](https://semaphoreci.com/blog/flaky-react).
- Use [`userEvent`](https://claritydev.net/blog/improving-react-testing-library-tests#use-userevent-instead-of-fireevent)
  instead of `fireEvent`.
- Use [`findBy`](https://claritydev.net/blog/improving-react-testing-library-tests#simplify-the-waitfor-queries-with-findby)
  instead of `waitFor` + `getBy`.
