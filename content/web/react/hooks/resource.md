---
sidebar_position: 25
tags: [Web, React, Hook, Resource, Storage]
---

# Resource

## Script Loading

```ts
import { useEffect, useState } from 'react'

export type Status = 'idle' | 'loading' | 'ready' | 'error'
export type ScriptElt = HTMLScriptElement | null

function useScript(src: string): Status {
  const [status, setStatus] = useState<Status>(src ? 'loading' : 'idle')

  useEffect(
    () => {
      if (!src) {
        setStatus('idle')
        return
      }

      // Fetch existing script element by src
      // It may have been added by another instance of this hook
      // **Cache mechanism**
      let script: ScriptElt = document.querySelector(`script[src="${src}"]`)

      if (!script) {
        // Create script
        script = document.createElement('script')
        script.src = src
        script.async = true
        script.setAttribute('data-status', 'loading')
        // Add script to document body
        document.body.appendChild(script)

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          script?.setAttribute(
            'data-status',
            event.type === 'load' ? 'ready' : 'error'
          )
        }

        // eslint-disable-next-line react-web-api/no-leaked-event-listener -- Remove event listener on cleanup.
        script.addEventListener('load', setAttributeFromEvent)
        // eslint-disable-next-line react-web-api/no-leaked-event-listener -- Remove event listener on cleanup.
        script.addEventListener('error', setAttributeFromEvent)
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(script.getAttribute('data-status') as Status)
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === 'load' ? 'ready' : 'error')
      }

      // Add event listeners
      script.addEventListener('load', setStateFromEvent)
      script.addEventListener('error', setStateFromEvent)

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener('load', setStateFromEvent)
          script.removeEventListener('error', setStateFromEvent)
        }
      }
    },
    [src] // Only re-run effect if script src changes
  )

  return status
}

export default useScript
```

```ts
const cachedScripts = []

function useScript(src) {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    loaded: false,
    error: false,
  })

  useEffect(
    () => {
      // If cachedScripts array already includes src
      // that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (cachedScripts.includes(src)) {
        setState({
          loaded: true,
          error: false,
        })
      } else {
        cachedScripts.push(src)

        // Create script
        const script = document.createElement('script')
        script.src = src
        script.async = true

        // Script event listener callbacks for load and error
        const onScriptLoad = () => {
          setState({
            loaded: true,
            error: false,
          })
        }

        const onScriptError = () => {
          // Remove from cachedScripts we can try loading again
          const index = cachedScripts.indexOf(src)
          if (index >= 0)
            cachedScripts.splice(index, 1)
          script.remove()

          setState({
            loaded: true,
            error: true,
          })
        }

        script.addEventListener('load', onScriptLoad)
        script.addEventListener('error', onScriptError)

        // Add script to document body
        document.body.appendChild(script)

        // Remove event listeners on cleanup
        return () => {
          script.removeEventListener('load', onScriptLoad)
          script.removeEventListener('error', onScriptError)
        }
      }
    },
    [src] // Only re-run effect if script src changes
  )

  return [state.loaded, state.error]
}
```

## Cookie

```ts
// https://github.com/tylerwolff/useCookie.
import { useState } from 'react'

const isBrowser = typeof window !== 'undefined'

function stringifyOptions(options) {
  return Object.keys(options).reduce((acc, key) => {
    if (key === 'days') {
      // Skip `days`.
      return acc
    } else {
      if (options[key] === false)
        return acc
      else if (options[key] === true)
        return `${acc}; ${key}`
      else return `${acc}; ${key}=${options[key]}`
    }
  }, '')
}

function getCookie(name, initialValue = '') {
  return (
    (isBrowser
      && document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
      }, ''))
      || initialValue
  )
}

function setCookie(name, value, options) {
  if (!isBrowser)
    return

  const optionsWithDefaults = {
    days: 7,
    path: '/',
    ...options,
  }

  const expires = new Date(
    Date.now() + optionsWithDefaults.days * 864e5
  ).toUTCString()

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}${stringifyOptions(optionsWithDefaults)}`
}

function useCookie(key, initialValue) {
  const [item, setItem] = useState(() => {
    return getCookie(key, initialValue)
  })

  const updateItem = (value, options) => {
    setItem(value)
    setCookie(key, value, options)
  }

  return [item, updateItem]
}
```

## LocalStorage

```tsx
// https://www.robinwieruch.de/react-uselocalstorage-hook.
function useLocalStorage(storageKey, fallbackState) {
  const [value, setValue] = React.useState(
    JSON.parse(localStorage.getItem(storageKey)) || fallbackState
  )

  // Update logic.
  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value))
  }, [value, storageKey])

  return [value, setValue]
}

export default function App() {
  const [isOpen, setOpen] = useLocalStorage('is-open', false)

  const handleToggle = () => {
    setOpen(!isOpen)
  }

  return (
    <div>
      <button type="button" onClick={handleToggle}>Toggle</button>
      {isOpen && <div>Content</div>}
    </div>
  )
}
```
