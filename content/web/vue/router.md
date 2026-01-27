---
tags: [Web, Vue, Router]
sidebar_position: 16
---

# Router

## Routes

```ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
```

## Dynamic

Two methods to access route `params` in components:

- Composition route API: `const { params } = useRoute()`.
- Passing route props to component: `const props = defineProps<{ id: string }>()`:
  - `props` better testing friendly.
  - `props` better TypeScript types inference.

```html
<template>
  <router-link class="event-link" :to="{ name: 'EventDetails', params: { id: event.id } }">
    <div class="event-card">
      <span>@{{ event.time }} on {{ event.date }}</span>
      <h4>{{ event.title }}</h4>
    </div>
  </router-link>
</template>
```

:::tip

Can't access to `this` inside of `setup`,
we cannot directly access `this.$router` or `this.$route` anymore.

:::

## APIs

[Composition API](https://next.router.vuejs.org/guide/advanced/composition-api.html):

```ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import EventDetails from '../views/EventDetails.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/event/:id',
    name: 'EventDetails',
    component: EventDetails,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

```html
<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { getEvent } from '@/services'
  import type { Event } from '@/services'

  const { params } = useRoute()
  const event: Event = await getEvent(Number.parseInt(params.id))
</script>
```

## Passing Props

```ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import EventDetails from '../views/EventDetails.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/event/:id',
    name: 'EventDetails',
    component: EventDetails,
    props: true /* Passing route props to component */,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

```html
<script setup lang="ts">
  import { getEvent } from '@/services'
  import type { Event } from '@/services'

  const props = defineProps<{ id: string }>()
  const event: Event = await getEvent(Number.parseInt(props.id))
</script>
```

## Named

```ts
const routes = [
  {
    path: '/user/:username',
    name: 'User',
    component: User,
  },
]
```

```html
<router-link :to="{ name: 'User', params: { username: 'sabertaz' }"> User </router-link>
```

```ts
router.push({ name: 'User', params: { username: 'sabertaz' } })
```

## Nested

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'board',
    component: Board,
    children: [
      {
        path: 'task/:id',
        name: 'task',
        component: Task,
        props: true,
      },
    ],
  },
]
```

```html
<!-- App.vue -->
<!-- Root router view -->
<template><router-view /></template>
```

```html
<!-- Board.vue -->
<!-- Nested router view -->
<template>
  <div>Board View</div>
  <router-view />
</template>
```

```html
<!-- Task.vue -->
<script setup lang="ts">
  defineProps<{ id: string }>()
</script>

<template>
  <div>Task View {{ id }}</div>
</template>
```

## Programmatic Navigation

```ts
import { useRouter } from 'vue-router'

function App() {
  const router = useRouter()
}
```

### Navigate

```ts
const username = 'eduardo'
// we can manually build the url but we will have to handle encoding ourselves
router.push(`/user/${username}`) // -> /user/eduardo
// same as
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// if possible use `name` and `params` to benefit from automatic URL encoding
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` cannot be used alongside `path`
router.push({ path: '/user', params: { username } }) // -> /user
```

```ts
// literal string path
router.push('/users/eduardo')

// object with path
router.push({ path: '/users/eduardo' })

// named route with params to let the router build the url
router.push({ name: 'user', params: { username: 'eduardo' } })

// with query, resulting in /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// with hash, resulting in /about#team
router.push({ path: '/about', hash: '#team' })
```

### Replace

```ts
// replace current location
router.push({ path: '/home', replace: true })
// equivalent to
router.replace({ path: '/home' })
```

### Traverse

```ts
// go forward by one record, same as router.forward()
router.go(1)

// go back by one record, same as router.back()
router.go(-1)

// go forward by 3 records
router.go(3)

// fails silently if there aren't that many records
router.go(-100)
router.go(100)
```

## Navigation Guard

### Configuration

```ts
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

:::caution

`beforeEnter` guards only trigger when entering a route,
don't trigger when params, query or hash change.

Going from `/users/2` to `/users/3` or going from `/users/2#info` to `/users/2#projects`
don't trigger `beforeEnter` guards.

:::

### Global

```ts
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated)
    next({ name: 'Login' })
  else next()
})
```

```ts
router.beforeResolve(async (to) => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // Handle the error and then cancel the navigation.
        return false
      } else {
        // Unexpected error: cancel the navigation and pass error to global handler.
        throw error
      }
    }
  }
})
```

```ts
router.afterEach((to, from, failure) => {
  if (!failure)
    sendToAnalytics(to.fullPath)
})
```

## Navigation Resolution

- Navigation triggered.
- Call `beforeRouteLeave` guards in deactivated components.
- Call global `beforeEach` guards.
- Call `beforeRouteUpdate` guards in reused components.
- Call `beforeEnter` in route configs.
- Resolve async route components.
- Call `beforeRouteEnter` in activated components.
- Call global `beforeResolve` guards.
- Navigation is confirmed.
- Call global `afterEach` hooks.
- DOM updates triggered.
- Call `next` callbacks in `beforeRouteEnter` guards with instantiated instances.
