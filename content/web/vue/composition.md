---
tags: [Web, Vue, Composition]
sidebar_position: 12
---

# Composition

:::tip

Can't access to `this` inside of `setup`,
we cannot directly access `this.$emit` or `this.$route` anymore.

:::

## Setup

SFC with `script` [setup](https://vuejs.org/api/sfc-script-setup.html):

- Executes before
  `Components`,
  `Props`,
  `Data`,
  `Methods`,
  `Computed` properties,
  `Lifecycle` methods.
- Can't access `this`.
- Can access `props` and `context`:
  - `props`.
  - `context.attrs`.
  - `context.slots`.
  - `context.emit`.
  - `context.expose`.
  - `context.parent`.
  - `context.root`.

```ts
import { ref, toRefs } from 'vue'

export default {
  setup(props, { attrs, slots, emit, expose }) {
    const { title } = toRefs(props)

    const count = ref(0)
    const increment = () => ++count.value

    console.log(title.value)

    return { title, increment }
  },
}
```

## Lifecycle

- `onBeforeMount`.
- `onMounted`.
- `onBeforeUpdate`.
- `onUpdated`.
- `onBeforeUnmount`.
- `onUnmounted`.
- `onErrorCaptured`.
- `onRenderTracked`.
- `onRenderTriggered`.
- `onActivated`.
- `onDeactivated`.

`beforeCreate` -> `setup` -> `created`:
No need for `onBeforeCreate` and `onCreated` hooks,
just put code in `setup` methods.

## Reactive

```ts
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free',
})

const { author, title } = toRefs(book)

title.value = 'Vue 3 Detailed Guide'
console.log(book.title) // 'Vue 3 Detailed Guide'
```

## Ref

`ref` API:

```ts
import type { Ref } from 'vue'
import { isRef, reactive, ref, toRef, unref } from 'vue'

const count = ref(10)
const state = reactive({
  foo: 1,
  bar: 2,
})
const fooRef = toRef(state, 'foo')

console.log(isRef(count))
console.log(unref(count) === 10)
fooRef.value++
console.log(state.foo === 2)
state.foo++
console.log(fooRef.value === 3)
```

`toRef`/`toRefs`:

```ts
function toRef(reactive, key) {
  const wrapper = {
    get value() {
      return reactive[key]
    },
    set value(val) {
      reactive[key] = val
    },
  }

  Object.defineProperty(wrapper, '__v_isRef', {
    value: true,
  })

  return wrapper
}

function toRefs(reactive) {
  const refs = {}

  for (const key in reactive) refs[key] = toRef(reactive, key)

  return refs
}
```

`proxyRefs` (auto unref):

```ts
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      return result.__v_isRef ? result.value : result
    },
    set(target, key, value, receiver) {
      const result = target[key]

      if (result.__v_isRef) {
        result.value = value
        return true
      }

      return Reflect.set(target, key, value, receiver)
    },
  })
}
```

当一个 `ref` 被嵌套在一个响应式对象中作为属性被访问或更改时,
会自动解包 (无需使用 `.value`):

```ts
const count = ref(0)
const state = reactive({
  count,
})
console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

当 `ref` 作为响应式数组或 `Map` 原生集合类型的元素被访问时,
不会进行解包 (需要使用 `.value`):

```ts
const books = reactive([ref('Vue 3 Guide')])
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
console.log(map.get('count').value)
```

## Computed

计算属性的计算函数应只做计算而没有任何其他的副作用,
不要在计算函数中做异步请求或者更改 DOM:

```ts
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

**特殊情况**下可通过 getter 和 setter 创建可写计算属性:

```ts
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  },
})

plusOne.value = 1 // 可写计算属性
console.log(count.value) // 0
```

## Watch

Watch single value:

```ts
// watching a getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// directly watching a ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

Watch multiple value:

```ts
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
```

Watch reactive value:

```ts
const numbers = reactive([1, 2, 3, 4])

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers)
  }
)

numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]
```

Watch deep object:

```ts
const state = reactive({
  id: 1,
  attributes: {
    name: '',
  },
})

watch(
  () => state,
  (state, prevState) => {
    console.log('not deep', state.attributes.name, prevState.attributes.name)
  }
)

watch(
  () => state,
  (state, prevState) => {
    console.log('deep', state.attributes.name, prevState.attributes.name)
  },
  { deep: true }
)

// 直接给 `watch()` 传入一个响应式对象, 会隐式地创建一个深层侦听器
watch(state, (state, prevState) => {
  console.log('deep', state.attributes.name, prevState.attributes.name)
})

state.attributes.name = 'Alex' // Logs: "deep" "Alex" "Alex"
```

Watch effect:
`watchEffect()` 会立即执行一遍回调函数,
Vue 会自动追踪副作用的依赖关系,
自动分析出响应源 (自动追踪所有能访问到的响应式属性):

```ts
const url = ref('https://...')
const data = ref(null)

watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

Watch post effect:
默认情况下,
用户创建的 watcher 会在 Vue 组件更新前被调用,
DOM 仍为旧状态,
通过 `flush: post` 显式访问 Vue 更新后的 DOM:

```ts
watch(source, callback, {
  flush: 'post',
})

watchEffect(callback, {
  flush: 'post',
})

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

## Composable

组合式函数始终返回一个包含多个 ref 的普通的非响应式对象,
该对象在组件中被解构为 ref 之后仍可以保持响应性:

```ts
import { isRef, ref, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // 在请求之前重置状态...
    data.value = null
    error.value = null
    // unref() 解包可能为 ref 的值
    fetch(unref(url))
      .then(res => res.json())
      .then(json => (data.value = json))
      .catch(err => (error.value = err))
  }

  if (isRef(url)) {
    // 若输入的 URL 是一个 ref
    // 那么启动一个响应式的请求
    watchEffect(doFetch)
  } else {
    // 否则只请求一次
    // 避免监听器的额外开销
    doFetch()
  }

  return { data, error }
}

export function App() {
  const { data, error } = useFetch('https://...')
}
```

```ts
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```
