---
sidebar_position: 26
tags: [Web, React, Hook]
---

# Data

## Asynchronous

- `useState` to store url and data.
- `useEffect` to trigger async `fetch` actions.

```ts
import { useEffect, useState } from 'react'

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null)

  function handleStatusChange(status) {
    setIsOnline(status.isOnline)
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange)
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange)
    }
  })

  return isOnline
}
```

```tsx
export default function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id)

  if (isOnline === null)
    return 'Loading...'

  return isOnline ? 'Online' : 'Offline'
}
```

```tsx
interface Props {
  friend: {
    id: number
    name: string
  }
}
export default function FriendListItem({ friend }: Props) {
  const isOnline = useFriendStatus(friend.id)

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>{friend.name}</li>
  )
}
```

```ts
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'

function useDataApi(initialUrl, initialData) {
  const [data, setData] = useState(initialData)
  const [url, setUrl] = useState(initialUrl)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchData = useCallback(async () => {
    setIsError(false)
    setIsLoading(true)

    try {
      const result = await axios(url)

      setData(result.data)
    } catch (error) {
      setIsError(true)
    }

    setIsLoading(false)
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const doGet = (event, url) => {
    setUrl(url)
    event.preventDefault()
  }

  return { data, isLoading, isError, doGet }
}
```

```tsx
function App() {
  const [query, setQuery] = useState('redux')
  const { data, isLoading, isError, doGet } = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=redux',
    { hits: [] }
  )

  return (
    <>
      <form
        onSubmit={event =>
          doGet(event, `http://hn.algolia.com/api/v1/search?query=${query}`)}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading
        ? (
            <div>Loading ...</div>
          )
        : (
            <ul>
              {data.hits.map(item => (
                <li key={item.objectID}>
                  <a href={item.url}>{item.title}</a>
                </li>
              ))}
            </ul>
          )}
    </>
  )
}

export default App
```

TypeScript fetch hook with caches:

```ts
import type { AxiosRequestConfig } from 'axios'

import axios from 'axios'
import { useEffect, useReducer, useRef } from 'react'

// State & hook output
interface State<T> {
  status: 'init' | 'fetching' | 'error' | 'fetched'
  data?: T
  error?: string
}

type Cache<T> = Record<string, T>

// discriminated union type
type Action<T>
  = | { type: 'request' }
    | { type: 'success', payload: T }
    | { type: 'failure', payload: string }

function useFetch<T = unknown>(
  url?: string,
  options?: AxiosRequestConfig
): State<T> {
  const cacheRef = useRef<Cache<T>>({})
  const cancelRequestRef = useRef<boolean>(false)

  const initialState: State<T> = {
    status: 'init',
    error: undefined,
    data: undefined,
  }

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'request':
        return { ...initialState, status: 'fetching' }
      case 'success':
        return { ...initialState, status: 'fetched', data: action.payload }
      case 'failure':
        return { ...initialState, status: 'error', error: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    if (!url)
      return

    const fetchData = async () => {
      dispatch({ type: 'request' })

      if (cacheRef.current[url]) {
        dispatch({ type: 'success', payload: cacheRef.current[url] })
      } else {
        try {
          const response = await axios(url, options)
          cacheRef.current[url] = response.data

          if (cancelRequestRef.current)
            return

          dispatch({ type: 'success', payload: response.data })
        } catch (error) {
          if (cancelRequestRef.current)
            return

          dispatch({ type: 'failure', payload: error.message })
        }
      }
    }

    fetchData()

    return () => {
      cancelRequestRef.current = true
    }
  }, [url])

  return state
}

export default useFetch
```

## Query

```ts
import type { UseQueryOptions } from 'react-query'
import firebase from 'firebase/app'
import { useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import 'firebase/auth'
import 'firebase/database'

// This value is default 403 code from firebase
const PERMISSION_DENIED_STATUS_CODE = 'PERMISSION_DENIED'

export interface RealTimeFetchParams {
  path: string
}

export interface RealTimeSubscribeParams<T> {
  path: string
  event?: firebase.database.EventType
  callback: (value: T) => void
}

export interface RealTimeUnsubscribeParams {
  path: string
  event?: firebase.database.EventType
}

export class RealTimeApi {
  private firebase: firebase.app.App

  constructor() {
    this.handleAuthenticationErrors = this.handleAuthenticationErrors.bind(this)

    this.firebase = firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_WEB_API_KEY,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      projectId: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    })
  }

  private handleAuthenticationErrors(error: firebase.FirebaseError) {
    if (error.code === PERMISSION_DENIED_STATUS_CODE) {
      // handle logout any way you want. For example, if you were using
      // AWS Cognito, you'd call `Auth.logout()`
    }
  }

  public connect(token: string) {
    return this.firebase.auth().signInWithCustomToken(token)
  }

  public disconnect() {
    return this.firebase.auth().signOut()
  }

  public fetch<T>({ path }: RealTimeFetchParams) {
    return new Promise<T>((resolve) => {
      this.firebase
        .database()
        .ref(path)
        .once(
          'value',
          (snapshot) => {
            resolve(snapshot.val())
          },
          this.handleAuthenticationErrors
        )
    })
  }

  public subscribe<T>({
    path,
    callback,
    event = 'value',
  }: RealTimeSubscribeParams<T>) {
    const ref = this.firebase.database().ref(path)
    const cb = (snapshot: firebase.database.DataSnapshot) => {
      callback(snapshot.val() as T)
    }

    ref.on(event, cb, this.handleAuthenticationErrors)
    return () => ref.off(event, cb)
  }

  public unsubscribe({ path, event = 'value' }: RealTimeUnsubscribeParams) {
    this.firebase.database().ref(path).off(event)
  }
}

const realTimeApi = new RealTimeApi()

function useRealTimeQuery<Data>(
  firebasePathKey: string,
  useQueryOptions: UseQueryOptions<Data> = {}
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = realTimeApi.subscribe<Data>({
      path: firebasePathKey,
      callback: (val) => {
        queryClient.setQueryData(firebasePathKey, val)
      },
    })

    return () => unsubscribe()
  }, [queryClient, firebasePathKey])

  return useQuery<Data, Error>(
    firebasePathKey,
    () => new Promise<Data>(() => {}),
    useQueryOptions
  )
}

export default useRealTimeQuery
```
