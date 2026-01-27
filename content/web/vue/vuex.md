---
tags: [Web, Vue, Vuex]
sidebar_position: 17
---

# Vuex

## Types

- Vuex types [guide](https://dev.to/3vilarthas/vuex-typescript-m4j).

```ts
// store.ts
import type { InjectionKey } from 'vue'
import type { Store } from 'vuex'
import { createStore, useStore } from 'vuex'

// define your typings for the store state
interface State {
  count: number
}

// define injection key
const key: InjectionKey<Store<State>> = Symbol('key')

const store = createStore<State>({
  state: {
    count: 0,
  },
})

const useAppStore = () => useStore<State>(key)

export { key, useAppStore }
export type { State }
export default store
```

```ts
// main.ts
import { createApp } from 'vue'
import store, { key } from './store'

const app = createApp({})

// pass the injection key
app.use(store, key)

app.mount('#app')
```

```html
<script setup lang="ts">
  // in a vue component
  import { useAppStore } from './store'

  const store = useAppStore()
  const count = store.state.count // typed as number
</script>
```
