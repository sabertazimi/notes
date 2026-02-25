---
sidebar_position: 9
tags: [Web, React, Hook, Server, Form]
---

# Servers

## useOptimistic

[`updateOptimistic()`](https://jser.dev/2024-03-20-how-does-useoptimisticwork-internally-in-react#42-updateoptimistic):

- An optimistic update has `revertLane` of `TransitionLaneXX` and `lane` of `SyncLane`.
- Update is processed in `SyncLane` and also in all following renders,
  but it is NOT skipped and always kept in the next update queue.
- Update is reverted in `revertLane` (low priority transition lane),
  by NOT getting added to the next queue.
  But if the async action on the transition lane is not yet complete,
  it suspends by throwing the promise.
  The revert will be tried again after the async action is done.

```tsx
function useOptimistic(state, optimisticDispatcher) {
  const [optimisticState, setOptimisticState] = useState(state)

  useLayoutEffect(() => {
    setOptimisticState(optimisticState)
  }, [state])

  const dispatch = (action) => {
    setOptimisticState(state => optimisticDispatcher(state, action))
  }

  return [
    optimisticState,
    dispatch
  ]
}

function Thread({ messages, sendMessage }) {
  const formRef = useRef()

  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'))
    formRef.current.reset()
    await sendMessage(formData)
  }

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  )

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={message.id}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  )
}
```

## useActionState

Form loading state:

```tsx
import { useActionState } from 'react'

export default function App() {
  const sendMessage = async (_actionState: null, formData: FormData) => {
    const message = formData.get('message')

    console.log(message)

    // Artificial delay to simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: do call (e.g. API call) to send the message

    return null
  }

  const [_actionState, action, isPending] = useActionState(sendMessage, null)

  return (
    <form action={action}>
      <label htmlFor="message">Message:</label>
      <input name="message" id="message" />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending ...' : 'Send'}
      </button>
    </form>
  )
}
```

## useFormStatus

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending ...' : 'Send'}
    </button>
  )
}

export default function App() {
  const sendMessage = async (formData: FormData) => {
    const message = formData.get('message')

    console.log(message)

    // Artificial delay to simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: do call (e.g. API call) to send the message
  }

  return (
    <form action={sendMessage}>
      <label htmlFor="message">Message:</label>
      <input name="message" id="message" />

      <SubmitButton />
    </form>
  )
}
```
