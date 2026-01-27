---
sidebar_position: 18
tags: [Web, React, Testing]
---

# Testing

## Mindset

`User behavior` and `A11Y`:

- Rather than tests focusing on the **implementation** (props and state) (Enzyme),
  tests are more focused on **user behavior** (react-testing-library).
- React testing library enforce to
  use `placeholder`, `aria`, `test-ids` to access elements,
  benefiting for a11y components
  (write tests > build accessible components > tests pass).

But sometimes may need to test the internals of the component
when just testing the DOM from user’s perspective may not make sense.

So depending on the use cases,
we can choose between these two libraries
or just install them all for individual use cases.

> Enzyme for Internal API, React testing library for user behavior.

## Installation

```bash
pnpm add -D @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

## Events

### FireEvent

- `fireEvent` trigger DOM event: `fireEvent(node, event)`.
- `fireEvent.*` helpers for default event types:
  - click fireEvent.click(node).
  - See [all supported events](https://github.com/testing-library/dom-testing-library/blob/main/src/event-map.js).

```tsx
import { fireEvent, render, wait } from '@testing-library/react'
import { api } from './api'
import { App } from './App'

// Normally you can mock entire module using jest.mock('./api);
const mockCreateItem = (api.createItem = jest.fn())

test('allows users to add items to their list', async () => {
  const todoText = 'Learn spanish'
  mockCreateItem.mockResolvedValueOnce({ id: 123, text: todoText })

  const { getByText, getByLabelText } = render(<App />)

  const input = getByLabelText('What needs to be done?')
  const button = getByText('Add #1')

  fireEvent.change(input, { target: { value: todoText } })
  fireEvent.click(button)

  await wait(() => getByText(todoText))

  expect(mockCreateItem).toBeCalledTimes(1)
  expect(mockCreateItem).toBeCalledWith('/items', expect.objectContaining({ text: todoText }))
})
```

### UserEvent

[User Event](https://testing-library.com/docs/ecosystem-user-event)
provides more advanced simulation of browser interactions
than the built-in `fireEvent method`.

```bash
pnpm add -D @testing-library/user-event @testing-library/dom
```

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('click', () => {
  render(
    <div>
      <label htmlFor="checkbox">Check</label>
      <input id="checkbox" type="checkbox" />
    </div>,
  )

  userEvent.click(screen.getByText('Check'))
  expect(screen.getByLabelText('Check')).toBeChecked()
})
```

```tsx
/**
 * render: render the component
 * screen: finding elements along with user
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox, Welcome } from './'

describe('Welcome should', () => {
  test('has correct welcome message', () => {
    render(<Welcome firstName="John" lastName="Doe" />)
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome, John Doe')
  })

  test('has correct input value', () => {
    render(<Welcome firstName="John" lastName="Doe" />)
    expect(screen.getByRole('form')).toHaveFormValues({
      firstName: 'John',
      lastName: 'Doe',
    })
  })

  test('handles click correctly', () => {
    render(<Checkbox />)
    userEvent.click(screen.getByText('Check'))
    expect(screen.getByLabelText('Check')).toBeChecked()
  })
})
```

## Hooks

```ts
import { useCallback, useState } from 'react'

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const increment = useCallback(() => setCount(x => x + 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  return { count, increment, reset }
}
```

```ts
import { act, renderHook } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should reset counter to updated initial value', () => {
  const { result, rerender } = renderHook(({ initialValue }) => useCounter(initialValue), {
    initialProps: { initialValue: 0 },
  })

  rerender({ initialValue: 10 })

  act(() => {
    result.current.reset()
  })

  expect(result.current.count).toBe(10)
})
```

### Async

```ts
import { use, useCallback, useState } from 'react'

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const step = use(CounterStepContext)
  const increment = useCallback(() => setCount(x => x + step), [step])
  const incrementAsync = useCallback(() => setTimeout(increment, 100), [increment])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  return { count, increment, incrementAsync, reset }
}
```

```ts
import { renderHook } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should increment counter after delay', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCounter())
  result.current.incrementAsync()
  await waitForNextUpdate()
  expect(result.current.count).toBe(1)
})
```

### Error

```ts
import { use, useCallback, useState } from 'react'

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const step = use(CounterStepContext)
  const increment = useCallback(() => setCount(x => x + step), [step])
  const incrementAsync = useCallback(() => setTimeout(increment, 100), [increment])
  const reset = useCallback(() => setCount(initialValue), [initialValue])

  if (count > 9000)
    throw new Error('It\'s over 9000!')

  return { count, increment, incrementAsync, reset }
}
```

```ts
import { act, renderHook } from '@testing-library/react-hooks'
import { useCounter } from './useCounter'

it('should throw when over 9000', () => {
  const { result } = renderHook(() => useCounter(9000))

  act(() => {
    result.current.increment()
  })

  expect(result.error).toEqual(new Error('It\'s over 9000!'))
})
```

## APIs

- `getByXXX` queries: common use case.
- `queryByXXX` queries: not throw error when nothing match.
- `findByXXX` queries: `getBy` queries + `waitFor`.

| API        | No Match | 1 Match | 1+ Match | Await |
| ---------- | -------- | ------- | -------- | ----- |
| getBy      | throw    | return  | throw    | No    |
| queryBy    | null     | return  | throw    | No    |
| findBy     | throw    | return  | throw    | Yes   |
| getAllBy   | throw    | array   | array    | No    |
| queryAllBy | []       | array   | array    | No    |
| findAllBy  | throw    | array   | array    | Yes   |

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TransactionCreateStepTwo from './TransactionCreateStepTwo'

test('if amount and note is entered, pay button becomes enabled', async () => {
  render(<TransactionCreateStepTwo sender={{ id: '5' }} receiver={{ id: '5' }} />)

  expect(await screen.findByRole('button', { name: /pay/i })).toBeDisabled()

  userEvent.type(screen.getByPlaceholderText(/amount/i), '50')
  userEvent.type(screen.getByPlaceholderText(/add a note/i), 'dinner')
  expect(await screen.findByRole('button', { name: /pay/i })).toBeEnabled()
})
```

:::tip[waitFor]

`findBy` handles DOM waiting automatically,
`waitFor` is more suitable for non-DOM things,
e.g. function/spy was called or resolved:

```ts
// DOM waiting
expect(await screen.findByText('Data loaded')).toBeInTheDocument()

// Non-DOM waiting
await waitFor(() => expect(window.fetch).toHaveBeenCalled())
```

:::

## Best Practices

- Good frontend tests [guide](https://howtotestfrontend.com/resources/how-to-write-good-frontend-tests).

## References

- Custom Jest DOM [matchers](https://github.com/testing-library/jest-dom).
- React testing library [cheat sheet](https://testing-library.com/docs/react-testing-library/cheatsheet).
- UI testing with [GitHub Actions](https://storybook.js.org/blog/how-to-automate-ui-tests-with-github-actions).
- React testing [tutorial](https://www.robinwieruch.de/react-testing-tutorial).
- Cypress testing [recipes](https://glebbahmutov.com/blog/tags/cypress).
