---
tags: [Web, Vue, Component, Slot]
sidebar_position: 11
---

# Components

## Computed Properties

```html
<div id="computed-basics">
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</div>
```

```ts
Vue.createApp({
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery',
        ],
      },
    }
  },
  computed: {
    // 计算属性的 getter
    publishedBooksMessage() {
      // `this` 指向 vm 实例
      return this.author.books.length > 0 ? 'Yes' : 'No'
    },
    fullName: {
      // getter
      get() {
        return `${this.firstName} ${this.lastName}`
      },
      // setter
      set(newValue) {
        const names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
      },
    },
  },
}).mount('#computed-basics')
```

## Slots

- [Web Slot](https://developers.google.com/web/fundamentals/web-components/shadowdom#slots)
- `name` attribute.
- `fallback` content.
- 插槽基本目的为自定义组件渲染细节: e.g. 高级列表组件.
- Normal Slots:
  在父组件编译和渲染阶段生成 Slots VNodes,
  数据作用域为父组件实例 (使用插槽的组件),
  即父组件同时提供 View 与 Data.
- Scoped Slots:
  在父组件编译和渲染阶段为 `vnode.data` 添加 `scopedSlots` 对象,
  在子组件编译和渲染阶段生成 Slots VNodes,
  数据作用域为子组件实例 (定义插槽的组件),
  即父组件提供 View, 子组件提供 Data.

### Fallback

```html
<!-- SubmitButton -->
<button type="submit">
  <slot>Submit</slot>
</button>
```

```html
<SubmitButton></SubmitButton>
```

render to

```html
<button type="submit">Submit</button>
```

```html
<SubmitButton>Save</SubmitButton>
```

render to

```html
<button type="submit">Save</button>
```

### Named

- `#`: `v-slot` directive shorthand.

```html
<!-- Layout -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

```html
<Layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>
  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>
  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</Layout>
```

Named slot directive shorthand:

```html
<Layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>
  <template>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>
  <template #footer>
    <p>Here's some contact info</p>
  </template>
</Layout>
```

### Scoped

Pass data from child to parent
(like `Render Props` in React):

```ts
app.component('TodoList', {
  data() {
    return {
      items: ['Feed a cat', 'Buy milk'],
    }
  },
  template: `
    <ul>
      <li v-for="( item, index ) in items">
        <slot :item="item"></slot>
      </li>
    </ul>
  `,
})
```

```html
<TodoList>
  <!-- `default` can be other named slots -->
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
</TodoList>
```

Slot props shorthand
(`default` can be other named slots):

```html
<TodoList v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</TodoList>

<TodoList v-slot="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</TodoList>

<TodoList v-slot="{ item: todo }">
  <i class="fas fa-check"></i>
  <span class="green">{{ todo }}</span>
</TodoList>

<TodoList v-slot="{ item = 'Placeholder' }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</TodoList>

<TodoList #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</TodoList>
```

## Provide and Inject

Root `provide` context value:

```ts
import { provide, ref } from 'vue'

const count = ref(0)
provide('key', count)
```

Child `inject` context value:

```ts
import { inject } from 'vue'

const message = inject('message', defaultValue)
```
