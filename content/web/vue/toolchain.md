---
tags: [Web, Vue, Toolchain, Vite]
sidebar_position: 18
---

# Toolchain

## Vite

### Configuration

```ts
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/lab/vue-trello/',
  plugins: [vue()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
})
```

### Environment Variables

- `import.meta.env.MODE`: `{string}` running mode.
- `import.meta.env.BASE_URL`: `{string}` vite `base` url.
- `import.meta.env.PROD`: `{boolean}` whether in production.
- `import.meta.env.DEV`: `{boolean}` whether in development.

```ts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
```

```ts
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_TITLE: string
  // More environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

```bash
.env                # Loaded in all cases.
.env.local          # Loaded in all cases, ignored by git.
.env.[mode]         # Only loaded in specified mode.
.env.[mode].local   # Only loaded in specified mode, ignored by git.
```

## Vue CLI

### SCSS

[Build with Bulma](https://css-tricks.com/how-to-increase-your-page-size-by-1500-with-webpack-and-vue):

Every element and every style for this scoped styled component
will have a `data-v-2929` on them at runtime.
If import a Sass file into component that has actual styles in it,
Vue (via webpack) will pull in those styles and
"namespace" them with that dynamic `data-v` attribute.
The result is that is include `Bulma` in your **many** times
with a bunch of `data-v` weirdness in front of it.

```css
/* bulma-custom.scss */
@import './variables.scss';

/* UTILITIES */
@import 'bulma/sass/utilities/animations.sass';
@import 'bulma/sass/utilities/controls.sass';
@import 'bulma/sass/utilities/mixins.sass';

/* etc... */
```

```css
/* site.scss */
@import 'https://use.fontawesome.com/releases/v5.6.3/css/all.css';
@import './bulma-custom.scss';

html,
body {
  height: 100%;
  background-color: #f9fafc;
}

/* etc... */
```

```ts
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import styles
import '@/styles/site.scss'
```

```ts
// webpack.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/variables.scss";`,
      },
    },
  },
}
```

## Best Practices

When it comes to Vue 3,
Evan You [recommended](https://github.com/vuejs/rfcs/discussions/378):

- Use SFC + `<script setup>` + Composition API (drop Options API).
- Use VSCode + [Volar](https://github.com/johnsoncodehk/volar).
- Not strictly required for TS, but if applicable, use Vite for build tooling.

:::tip[Composition API vs Options API]

Original intention for supporting both APIs:
existing Options-API-based codebases can benefit from Composition API-based libraries,
It's not for new codebases to mix Composition API and Options API.

Intentionally mixing Composition API and Options API
should be avoided except in existing Options API codebases,
to either replace mixins or leverage a Composition API-based library.

:::
