---
sidebar_position: 4
tags: [Web, React, Redux, State Management]
---

# Query

## Server State

- Tracking loading state in order to show UI spinners.
- Avoiding duplicate requests for the same data.
- Optimistic updates to make the UI feel faster
  - Requires asynchronous APIs for fetching and updating.
  - Updating `out of date` data in the background.
- Managing cache lifetimes as the user interacts with the UI.
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview).
- [React Query](https://github.com/tannerlinsley/react-query).

## APIs

- Query hooks.
- Mutation hooks.
- Refetch function.
- Cache tags.

```ts
// Import the RTK Query methods from the React-specific entry point.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object.
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api`.
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'.
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  // The "endpoints" represent operations and requests for this server.
  endpoints: builder => ({
    getPost: builder.query({
      query: postId => `/posts/${postId}`,
    }),
    // The `getPosts` endpoint is a "query" operation that returns data.
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'.
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        // Include the entire post object as the body of the request
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})

// Export the auto-generated hook for the `getPost` query endpoint
export const { useGetPostQuery, useGetPostsQuery, useAddNewPostMutation }
  = apiSlice
```

```ts
import { apiSlice } from '../features/api/apiSlice'

export default configureStore({
  reducer: {
    // ... Other reducers.
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
```

```tsx
import { useGetPostsQuery } from '../api'
import { PostExcerpt, Spinner } from '../components'

export function PostsList() {
  const {
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(
    () => posts.slice().sort((a, b) => b.date.localeCompare(a.date)),
    [posts]
  )

  let content

  if (isLoading)
    content = <Spinner text="Loading..." />
  else if (isSuccess)
    content = sortedPosts.map(post => <PostExcerpt key={post.id} post={post} />)
  else if (isError)
    content = <div>{error.toString()}</div>

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button type="button" onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
```

```tsx
import { useState } from 'react'
import { useAddNewPostMutation } from '../api'

export function AddPostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const [addNewPost, { isLoading }] = useAddNewPostMutation()

  const canSave = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, content, user: userId }).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      }
    }
  }
}
```

## Cache

RTK Query creates a **cache key** for each `unique endpoint` + `argument` combination,
and stores the results for each cache key separately.

Use the same query hook multiple times,
pass it different query parameters,
and each result will be cached separately in Redux `store`.

It's important to note that the query parameter must be a **single value**
(a primitive value or an object containing multiple fields, same as with `createAsyncThunk`).
RTK Query will do **shallow stable** comparison of fields,
and re-fetch the data if any of them have changed.

By default, **unused data is removed from the cache after 60 seconds**,
can be configured in root API slice definition
or overridden in individual endpoint definitions using `keepUnusedDataFor` flag.

RTK query [cache utils](https://redux-toolkit.js.org/rtk-query/api/created-api/cache-management-utils):

```ts
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map(({ id }) => ({ type: 'Post', id })),
      ],
    }),
    getPost: builder.query({
      query: postId => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
    editPost: builder.mutation({
      query: post => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
  }),
})
```

1. The `PATCH /posts/:postId` from the editPost mutation.
2. A `GET /posts/:postId` as the getPost query is refetched.
3. A `GET /posts` as the getPosts query is refetched.

## Selector

```ts
import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const emptyUsers = []

export const selectUsersResult = apiSlice.endpoints.getUsers.select()

export const selectAllUsers = createSelector(
  selectUsersResult,
  usersResult => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
  selectAllUsers,
  (state, userId) => userId,
  (users, userId) => users.find(user => user.id === userId)
)
```

## Splitting Endpoints

[RTK query code splitting](https://redux-toolkit.js.org/rtk-query/usage/code-splitting):

- `injectEndpoints()`:
  mutates original API slice object
  to add additional endpoint definitions
  and then returns it.
- `enhanceEndpoints()`:
  merged together on a per-definition basis.
- `apiSlice` and `extendedApiSlice` are the same object.

```ts
import { apiSlice } from '../api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()
```

## Transform Response

```ts
import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (responseData) => {
        return usersAdapter.setAll(initialState, responseData)
      },
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice

const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)

export const { selectAll: selectAllUsers, selectById: selectUserById }
  = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
```

## References

- RTK Query real world [example](https://www.toptal.com/react/redux-toolkit-and-rtk-query).
