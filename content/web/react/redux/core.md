---
sidebar_position: 1
tags: [Web, React, Redux, State Management]
---

# Core

## Concepts

- 单一数据源: 整个应用程序的状态存储在单个对象树中 (容易跟踪/调试)
- 状态只读: 通过 dispatch(action) 间接更改状态, 不直接写入状态
- 纯函数更改状态: reducer(state, action) => newState

## Store

Redux 中只有一个全局唯一 store 状态树, 且由 reducers 创建 store.

```ts
export default appStore = createStore(rootReducers, initState)
```

### Creation

```ts
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production' && module.hot)
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))

  return store
}
```

### Configuration

By default, `configureStore` from Redux Toolkit will:

- Call `applyMiddleware` with a default list of middlewares
  - [Async thunk middleware](https://github.com/reduxjs/redux-thunk).
  - [Immutability check middleware](https://redux-toolkit.js.org/api/immutabilityMiddleware):
    throw error when detecting mutations in reducers during a dispatch.
  - [Serializability check middleware](https://redux-toolkit.js.org/api/serializabilityMiddleware):
    throw error when deeply detecting non-serializable values in state tree
    (functions, promises, symbols, and other non-plain-data values).
- Call `composeWithDevTools` to set up the Redux DevTools Extension.

```ts
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState,
  })

  if (process.env.NODE_ENV === 'development' && module.hot)
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))

  return store
}
```

## State

在 Redux 中 State 并不显式定义:

- 初态与变化态皆由 Reducers 定义并控制
- Actions 中保存着 action.type 外, 还保存着供 Reducers 进行有效状态变化的其他信息(可自定义)
- 调用 Dispatch 方法自动向 Store 传递一个 Action(因为只有一个全局 Store, 故无需额外指定 Store 参数),
  Store 遍历调用其中的 Reducers, 根据 switch 语句进行匹配 action 处理
- reducer 只保存最基本的 state, 可计算出的 state 放在 mapStateToProps(selector) 中直接计算后绑定至 props
- 将数据保存在 Redux 存储中, 并在组件内部保持 UI 相关状态

### Persistence

```ts
// localStorage.getItem('state')/localStorage.setItem('state', serializedState)
const persistedState = loadLocalStorageState()
const appStore = createStore(rootReducers, persistedState)

appStore.subscribe(
  throttle(() => {
    saveLocalStorageState({
      todos: store.getState().todos,
    })
  }, 1000)
)
```

### Normalization

[Redux normalizing state shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape):

- Only have one copy of each particular piece of data in state (no duplication).
- Normalized data is kept in lookup table (key-value store),
  where item IDs are keys, items themselves are values.
- There may also be an array of all of the IDs for a particular item type.

Normalizing data:

- Each type of data gets its own `table` in state.
- Each `data table` should store individual items in an `{ key, value }` object:
  `"p1" : { id : "p1", author : "user1", comments : ["comment1", "comment2"] }`.
- Any references to individual items should be item ID.
- Arrays of IDs should be used to indicate ordering.

```ts
const state = {
  users: {
    ids: ['user1', 'user2', 'user3'],
    entities: {
      user1: { id: 'user1', firstName, lastName },
      user2: { id: 'user2', firstName, lastName },
      user3: { id: 'user3', firstName, lastName },
    },
  },
}

const userId = 'user2'
const userObject = state.users.entities[userId]
```

Normalize nesting data with [Normalizr](https://github.com/paularmstrong/normalizr):

```ts
const data = {
  entities: {
    authors: { byId: {}, allIds: [] },
    books: { byId: {}, allIds: [] },
    authorBook: {
      byId: {
        1: {
          id: 1,
          authorId: 5,
          bookId: 22,
        },
        2: {
          id: 2,
          authorId: 5,
          bookId: 15,
        },
        3: {
          id: 3,
          authorId: 42,
          bookId: 12,
        },
      },
      allIds: [1, 2, 3],
    },
  },
}
```

```ts
const blogPosts = [
  {
    id: 'post1',
    author: { username: 'user1', name: 'User 1' },
    body: '......',
    comments: [
      {
        id: 'comment1',
        author: { username: 'user2', name: 'User 2' },
        comment: '.....',
      },
      {
        id: 'comment2',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
    ],
  },
  {
    id: 'post2',
    author: { username: 'user2', name: 'User 2' },
    body: '......',
    comments: [
      {
        id: 'comment3',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
      {
        id: 'comment4',
        author: { username: 'user1', name: 'User 1' },
        comment: '.....',
      },
      {
        id: 'comment5',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
    ],
  },
  // and repeat many times
]

const normalizedBlogPosts = {
  posts: {
    byId: {
      post1: {
        id: 'post1',
        author: 'user1',
        body: '......',
        comments: ['comment1', 'comment2'],
      },
      post2: {
        id: 'post2',
        author: 'user2',
        body: '......',
        comments: ['comment3', 'comment4', 'comment5'],
      },
    },
    allIds: ['post1', 'post2'],
  },
  comments: {
    byId: {
      comment1: {
        id: 'comment1',
        author: 'user2',
        comment: '.....',
      },
      comment2: {
        id: 'comment2',
        author: 'user3',
        comment: '.....',
      },
      comment3: {
        id: 'comment3',
        author: 'user3',
        comment: '.....',
      },
      comment4: {
        id: 'comment4',
        author: 'user1',
        comment: '.....',
      },
      comment5: {
        id: 'comment5',
        author: 'user3',
        comment: '.....',
      },
    },
    allIds: ['comment1', 'comment2', 'comment3', 'comment4', 'comment5'],
  },
  users: {
    byId: {
      user1: {
        username: 'user1',
        name: 'User 1',
      },
      user2: {
        username: 'user2',
        name: 'User 2',
      },
      user3: {
        username: 'user3',
        name: 'User 3',
      },
    },
    allIds: ['user1', 'user2', 'user3'],
  },
}
```

### Entity Adapter

[createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter):

- Build normalized state.
- Return normalized state CURD operation reducers.
- Get data selectors by `getSelectors`.

```ts
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { client } from './api'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

// State = { ids: [], entities: {}, status: 'idle', error: null };
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost)
        existingPost.reactions[reaction]++
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      })
      // Use the `addOne` reducer for the fulfilled case
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)

export default postsSlice.reducer
```
