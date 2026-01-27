---
tags: [Web, Vue, Directive]
sidebar_position: 10
---

# Directives

## Control Flow

```html
<template>
  <p v-if="isShow">Show</p>
  <p v-if="isEnabled">Enabled</p>
  <p v-else>Disabled</p>
  <p v-if="inventory > 10">In Stock</p>
  <p v-else-if="inventory <= 10 && inventory > 0">Almost Sold Out</p>
  <p v-else>Out of Stock</p>
  <ul>
    <!-- list -->
    <li v-for="item in items" :key="item.id">{{ item.message }}</li>
    <li v-for="(item, index) in items">{{ item.message }} {{ index }}</li>
    <!-- destructured list -->
    <li v-for="{ message } in items">{{ message }}</li>
    <li v-for="({ message }, index) in items">{{ message }} {{ index }}</li>
    <!-- nested list -->
    <li v-for="item in items">
      <span v-for="childItem in item.children"> {{ item.message }} {{ childItem }} </span>
    </li>
    <!-- iterator list -->
    <li v-for="item of items">{{ item.message }}</li>
    <!-- object list -->
    <li v-for="(value, key, index) in myObject">{{ index }}. {{ key }}: {{ value }}</li>
    <!-- range list -->
    <li v-for="n in 10">{{ n }}</li>
  </ul>
</template>
```

:::tip[Show and If Directive]

Prefer `v-show` if you need to toggle something very often (`display: none`),
and prefer `v-if` if the condition is unlikely to change at runtime (lifecycle called).

:::

:::tip[For and If Directive]

- 不要把 `v-if` 和 `v-for` 同时用在同一个元素上,
  会带来性能方面的浪费,
  且有语法歧义:
  Vue 2.x 中 `v-for` 优先级高于 `v-if`,
  Vue 3.x 中 `v-if` 优先级高于 `v-for`.
- 外层嵌套 template (页面渲染不生成 DOM 节点),
  在这一层进行 `v-if` 判断,
  然后在内部进行 `v-for` 循环.

```ts
// Vue 2.x: compiler/codegen/index.js
export function genElement(el: ASTElement, state: CodegenState): string {
  if (el.parent)
    el.pre = el.pre || el.parent.pre

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
  }
}
```

```html
<template v-if="isShow"><p v-for="item in items"></p></template>
```

:::

## Attributes

```html
<template>
  <a :href="url">Dynamic Link</a>
  <img :src="link" :alt="description" />
  <button :disabled="item.length === 0">Save Item</button>
</template>
```

## Class and Style

- Static class.
- Array binding.
- Object binding.

```html
<script setup lang="ts">
  const isActive = ref(true)
  const hasError = ref(false)
  const activeClass = ref('active')
  const errorClass = ref('text-danger')
  const classObject = reactive({
    active: true,
    'text-danger': false,
  })
  const classObject = computed(() => ({
    active: isActive.value && !error.value,
    'text-danger': hasError.value,
  }))

  const activeColor = ref('red')
  const fontSize = ref(30)
  const styleObject = reactive({
    color: 'red',
    fontSize: '13px',
  })
</script>

<template>
  <div class="static"></div>
  <div :class="{ active: isActive, 'text-danger': hasError }"></div>
  <div :class="[isActive ? activeClass : '', errorClass]"></div>
  <div :class="[{ active: isActive }, errorClass]"></div>
  <div :class="classObject"></div>
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
  <div :style="[baseStyles, overridingStyles]"></div>
  <div :style="styleObject"></div>
  <div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
</template>
```

## Event

### Handlers and Modifiers

```html
<div id="handler">
  <button @click="warn('Warn message.', $event)">Submit</button>
  <button @click="one($event), two($event)">Submit</button>

  <!-- 阻止单击事件继续传播 -->
  <a @click.stop="doThis"></a>

  <!-- 提交事件不再重载页面 -->
  <form @submit.prevent="onSubmit"></form>

  <!-- 修饰符可以串联 -->
  <a @click.stop.prevent="doThat"></a>

  <!-- 只有修饰符 -->
  <form @submit.prevent></form>

  <!-- 添加事件监听器时使用事件捕获模式 -->
  <!-- 即内部元素触发的事件先在此处理, 然后才交由内部元素进行处理 -->
  <div @click.capture="doThis">...</div>

  <!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
  <!-- 即事件不是从内部元素触发的 -->
  <div @click.self="doThat">...</div>

  <!-- 点击事件将只会触发一次 -->
  <a @click.once="doThis"></a>

  <!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发   -->
  <!-- 而不会等待 `onScroll` 完成                   -->
  <!-- 这其中包含 `event.preventDefault()` 的情况   -->
  <div @scroll.passive="onScroll">...</div>

  <input @keyup.enter="submit" />
  <input @keyup.tab="submit" />
  <input @keyup.delete="submit" />
  <input @keyup.esc="submit" />
  <input @keyup.space="submit" />
  <input @keyup.up="submit" />
  <input @keyup.down="submit" />
  <input @keyup.left="submit" />
  <input @keyup.right="submit" />
  <input @keyup.page-down="onPageDown" />
  <input @keyup.ctrl.enter="clear" />
  <input @keyup.alt.space="clear" />
  <input @keyup.shift.up="clear" />
  <input @keyup.meta.right="clear" />

  <!-- Ctrl + Click -->
  <div @click.ctrl="doSomething">Do something</div>
  <!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
  <button @click.ctrl="onClick">A</button>
  <!-- 有且只有 Ctrl 被按下的时候才触发 -->
  <button @click.ctrl.exact="onCtrlClick">A</button>
  <!-- 没有任何系统修饰符被按下的时候才触发 -->
  <button @click.exact="onClick">A</button>
  <button @click.left="onClick">Left click</button>
  <button @click.right="onClick">Right click</button>
  <button @click.middle="onClick">Middle click</button>
</div>
```

```ts
Vue.createApp({
  methods: {
    warn(message, event) {
      if (event)
        event.preventDefault()
      alert(message)
    },
    one(event) {
      if (event)
        event.preventDefault()
      console.log('one')
    },
    two(event) {
      if (event)
        event.preventDefault()
      console.log('two')
    },
  },
}).mount('#inline-handler')
```

### Custom

Form events:

```ts
app.component('CustomForm', {
  emits: {
    // 没有验证
    click: null,

    // 验证 submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    },
  },
  methods: {
    customEvent() {
      this.$emit('custom-event')
    },
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    },
  },
})
```

```html
<custom-form @click="handleClick" @submit="handleSubmit" @custom-event="handleEvent"></custom-form>
```

Drag and Drop events:

```html
<!-- Drag.vue -->
<template>
  <div draggable="true" @dragstart.self="onDrag">
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      transferData: {
        type: Object,
        required: true,
      },
    },
    methods: {
      onDrag(e) {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'
        e.dataTransfer.setData('payload', JSON.stringify(this.transferData))
      },
    },
  }
</script>
```

```html
<!-- Drop.vue -->
<template>
  <div @dragenter.prevent @dragover.prevent @drop.stop="onDrop">
    <slot />
  </div>
</template>

<script>
  export default {
    methods: {
      onDrop(e) {
        const transferData = JSON.parse(e.dataTransfer.getData('payload'))
        this.$emit('drop', transferData)
      },
    },
  }
</script>
```

## Model

本质为语法糖 (`v-model = v-bind + v-on`):

```html
<input v-model="searchText" />
<input :value="searchText" @input="searchText = $event.target.value" />
```

- `checkbox`/`radio`:
  `checked` property and `@change` event.
- Multiple `checkbox`:
  value array.
- `select`:
  `value` property and `@change` event.
- `text`/`textarea`:
  `value` property and `@input` event.
- Child component:
  - Default: `value` property and `@input` event.
  - Use `options.model` on Child component to change default `v-bind` and `v-on`.

```html
<input v-model="message" placeholder="edit me" />
<textarea v-model="message" placeholder="add multiple lines"></textarea>

<input type="radio" id="one" value="One" v-model="picked" />
<input type="radio" id="two" value="Two" v-model="picked" />

<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

<!-- Debounce -->
<input v-model.lazy="msg" />
<!-- 自动将用户的输入值转为数值类型 -->
<input v-model.number="age" type="number" />
<!-- 自动过滤用户输入的首尾空白字符 -->
<input v-model.trim="msg" />
```

Component `v-model` directive:

```html
<CustomInput v-model="searchText" />
<CustomInput :modelValue="searchText" @update:modelValue="newValue => searchText = newValue" />
```

```html
<!-- CustomInput.vue -->
<script setup>
  defineProps(['modelValue'])
  defineEmits(['update:modelValue'])
</script>

<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>
```

```html
<!-- CustomInput.vue -->
<script setup>
  import { computed } from 'vue'

  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])

  const value = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })
</script>

<template>
  <input v-model="value" />
</template>
```

Custom component `v-model` name:

```html
<!-- MyComponent.vue -->
<script setup>
  defineProps(['title'])
  defineEmits(['update:title'])
</script>

<template>
  <input type="text" :value="title" @input="$emit('update:title', $event.target.value)" />
</template>
```

Custom component `v-model` modifier:

```html
<script setup>
  const props = defineProps({
    modelValue: String,
    modelModifiers: { default: () => ({}) },
  })

  const emit = defineEmits(['update:modelValue'])

  function emitValue(e) {
    let value = e.target.value
    if (props.modelModifiers.capitalize) {
      value = value.charAt(0).toUpperCase() + value.slice(1)
    }
    emit('update:modelValue', value)
  }
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

## Customization

Custom [build-in directives](https://github.com/vuejs/core/tree/main/packages/runtime-dom/src/directives):

```html
<script setup lang="ts">
  import { ref, vModelText } from 'vue'

  vModelText.updated = (el, { value, modifiers: { capitalize } }) => {
    if (capitalize && Object.hasOwn(value, 0)) {
      el.value = value[0].toUpperCase() + value.slice(1)
    }
  }

  const value = ref('')
</script>

<template>
  <input v-model.capitalize="value" type="text" />
</template>
```

Custom [new directives](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/directives.ts):

```ts
const vDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {},
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及其他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及其他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {},
}
```
