# Splitting Notes Examples

Complete examples showing how to split large note files into modular structures with index files.

## Example 1: Simple Split - Python Basics (300 lines)

### Before: `content/language/python/python.md`

**Structure** (300 lines total):

```markdown
---
tags: [Language, Python]
---

# Python

## Installation
### Anaconda
### pip

## String
### Methods
### Formatting

## List
### Operations
### Comprehension

## Dictionary
### Methods
### Iteration

## Control Flow
### If/Else
### Loops
```

**Analysis**: Each section is ~40-60 lines. All under 100 lines threshold, but topics are independent.
Better to split for discoverability.

### Planning Decisions for `python.md`

| Original H2  | Lines | Decision         | Rationale       |
| ------------ | ----- | ---------------- | --------------- |
| Installation | 40    | Merge with tools | Too small alone |
| String       | 50    | Keep             | Complete topic  |
| List         | 60    | Keep             | Complete topic  |
| Dictionary   | 45    | Keep             | Complete topic  |
| Control Flow | 55    | Keep             | Complete topic  |

**Split plan**: Merge Installation + String → `basics.md`, keep others separate.

### After: Directory Structure for `python/`

```text
content/language/python/
├── python.md          # Index (30 lines)
├── basics.md          # Installation + String (90 lines)
├── list.md            # List operations (60 lines)
├── dictionary.md      # Dictionary methods (45 lines)
└── control-flow.md    # Control structures (55 lines)
```

### Index File: `python.md`

```markdown
---
tags: [Language, Python]
---

# Python

## Getting Started
- [Basics](./basics.md) - Installation and string operations

## Data Structures
- [List](./list.md) - List operations and comprehensions
- [Dictionary](./dictionary.md) - Dictionary methods and iteration

## Control Flow
- [Control Flow](./control-flow.md) - Conditional statements and loops
```

**Index design decisions**:

- Progressive: Getting Started → Data Structures → Control Flow
- Every link has description (no periods)
- Grouping by category (Data Structures groups List + Dictionary)

## Example 2: Medium Split - Vue Guide (850 lines)

### Before: `content/web/vue/vue.md`

**Structure** (850 lines total):

```markdown
---
tags: [Web, Vue]
---

# Vue

## Toolchain
### Vite
### Vue CLI
### DevTools

## Directives
### v-if
### v-for
### v-model
### v-bind/v-on

## Components
### Props
### Events
### Slots
### Provide/Inject

## Composition API
### Setup
### Refs and Reactive
### Computed
### Watch

## Router
### Basic Routing
### Dynamic Routes
### Navigation Guards

## State Management
### Pinia
### Vuex

## Testing
### Unit Tests
### Component Tests
```

**Analysis**: Mix of topics, some sections large enough to standalone.

### Planning Decisions for `vue.md`

| Original H2      | Lines | Decision              | Rationale                   |
| ---------------- | ----- | --------------------- | --------------------------- |
| Toolchain        | 80    | Merge with Directives | Both are "basics"           |
| Directives       | 120   | Keep                  | Core concept                |
| Components       | 180   | Keep                  | Large, important            |
| Composition API  | 150   | Keep                  | Large, distinct topic       |
| Router           | 100   | Keep                  | Independent topic           |
| State Management | 90    | Merge with Testing    | Both <100 lines, "advanced" |

**Split plan**:

1. `basics.md` - Toolchain + Directives (200 lines)
2. `components.md` - Components only (180 lines)
3. `composition.md` - Composition API (150 lines)
4. `router.md` - Router (100 lines)
5. `advanced.md` - State + Testing (170 lines)

### After: Directory Structure for `vue/`

```text
content/web/vue/
├── vue.md          # Index (40 lines)
├── basics.md       # Toolchain + Directives (200 lines)
├── components.md   # Components (180 lines)
├── composition.md  # Composition API (150 lines)
├── router.md       # Router (100 lines)
└── advanced.md     # State + Testing (170 lines)
```

### Index File: `vue.md`

```markdown
---
tags: [Web, Vue]
---

# Vue

:::tip[Version Coverage]
These notes cover both Vue 2 (Options API) and Vue 3 (Composition API).
:::

## Getting Started
- [Basics](./basics.md) - Toolchain setup and core directives

## Core Concepts
- [Components](./components.md) - Props, events, slots, and patterns
- [Composition API](./composition.md) - Setup, reactivity, and lifecycle

## Routing
- [Router](./router.md) - Vue Router configuration and navigation

## Advanced Topics
- [Advanced](./advanced.md) - State management and testing strategies
```

**Index design decisions**:

- Tip callout for version info (common question)
- Progressive: Basics → Core → Router → Advanced
- Grouped State + Testing under "Advanced" (both are advanced topics)
- Descriptions are concise but informative

## Example 3: Complex Split - React Ecosystem (1500 lines)

### Before: `content/web/react/react.md`

**Structure** (1500 lines total):

```markdown
---
tags: [Web, React]
---

# React

## Installation
### create-react-app
### Vite
### Next.js

## JSX
### Syntax
### Expressions
### Fragments

## Components
### Function Components
### Class Components
### Props
### State

## Hooks
### useState
### useEffect
### useContext
### useReducer
### Custom Hooks

## Events
### Synthetic Events
### Event Handling
### Forms

## Patterns
### HOC
### Render Props
### Compound Components

## Performance
### Memoization
### Code Splitting
### Lazy Loading

## Testing
### Jest
### React Testing Library
### Cypress

## SSR
### Next.js SSR
### Remix

## Internals
### Virtual DOM
### Fiber
### Reconciliation
```

**Analysis**: Large file covering entire ecosystem. Multiple distinct domains.

### Planning Decisions for `react.md`

| Original H2  | Lines | Decision             | Target File      |
| ------------ | ----- | -------------------- | ---------------- |
| Installation | 70    | Merge with JSX       | `basics.md`      |
| JSX          | 80    | Merge                | `basics.md`      |
| Components   | 200   | Keep                 | `components.md`  |
| Hooks        | 180   | Keep                 | `hooks.md`       |
| Events       | 120   | Merge with Patterns  | `patterns.md`    |
| Patterns     | 100   | Merge                | `patterns.md`    |
| Performance  | 140   | Keep                 | `performance.md` |
| Testing      | 130   | Keep                 | `testing.md`     |
| SSR          | 90    | Merge with Internals | `internals.md`   |
| Internals    | 110   | Merge                | `internals.md`   |

**Rationale**:

- Installation + JSX = basics (150 lines) ✅
- Events + Patterns = both about "how to structure code" (220 lines) ✅
- SSR + Internals = both about "how React works" (200 lines) ✅
- Others are substantial enough to standalone

### After: Directory Structure for `react/`

```text
content/web/react/
├── react.md           # Index (50 lines)
├── basics.md          # Installation + JSX (150 lines)
├── components.md      # Components (200 lines)
├── hooks.md           # Hooks (180 lines)
├── patterns.md        # Events + Patterns (220 lines)
├── performance.md     # Performance (140 lines)
├── testing.md         # Testing (130 lines)
└── internals.md       # SSR + Internals (200 lines)
```

### Index File: `react.md`

```markdown
---
tags: [Web, React]
---

# React

## Getting Started
- [Basics](./basics.md) - Installation setup and JSX syntax

## Core Concepts
- [Components](./components.md) - Function and class components
- [Hooks](./hooks.md) - Built-in hooks and custom patterns
- [Patterns](./patterns.md) - Events handling and design patterns

## Development
- [Performance](./performance.md) - Optimization and code splitting
- [Testing](./testing.md) - Testing strategies and tools

## Advanced Topics
- [Internals](./internals.md) - Server-side rendering and React internals
```

**Index design decisions**:

- Progressive: Getting Started → Core → Development → Advanced
- Grouped Events with Patterns under "Core Concepts" (both are foundational)
- Performance + Testing under "Development" (practical concerns)
- SSR + Internals under "Advanced Topics" (deep technical content)
- Description format: `- [Name](./path.md) - Description` (no period, first letter capitalized)

## Index File Writing Guide

### Structure Template

```markdown
---
tags: [Category, Subcategory]
---

# Topic Name

## Progressive Category 1
- [File Name](./file-name.md) - Concise description here

## Progressive Category 2
- [File Name](./file-name.md) - Concise description here
```

### Progressive Grouping Patterns

Pattern 1: By **Skill Level**

```text
Getting Started → Core Concepts → Advanced Topics
```

Pattern 2: By **Workflow**

```text
Setup → Development → Deployment → Operations
```

Pattern 3: By **Layer**

```text
Basics → Intermediate → Advanced → Expert
```

### Link Format Rules

| Element        | Rule                 | Example                       |
| -------------- | -------------------- | ----------------------------- |
| Display name   | Title case           | `Components`                  |
| Path           | Relative, kebab-case | `./components.md`             |
| Separator      | Space dash space     | `-`                           |
| Description    | No period            | `Component patterns and refs` |
| Capitalization | First letter only    | `Installation and setup`      |

**✅ Correct**:

```markdown
- [Components](./components.md) - Component patterns and refs
```

**❌ Wrong**:

```markdown
- [Components](./components.md) - Component patterns and refs.
- [components](./components.md) - component patterns
- [Components](./components.md) component patterns
```

### Description Writing Tips

1. **Be specific**: "Component patterns" → "Component patterns and refs"
2. **Stay concise**: < 10 words preferred
3. **Use keywords**: Include searchable terms
4. **Match content**: Description should match file's primary focus

**Good descriptions**:

- "Installation setup and JSX syntax" (clear, covers both topics)
- "State management and context" (specific, searchable)
- "Event handling and synthetic events" (technical terms included)

**Weak descriptions**:

- "Basics" (too vague)
- "All about components" (uninformative)
- "React hooks stuff" (informal)

## Verification Checklist

After splitting, verify:

```bash
# 1. Check file sizes
wc -l content/web/react/*.md

# 2. Verify internal links
grep -r "\[.*\](./" content/web/react/

# 3. Check image references
grep -r "](figures/" content/web/react/

# 4. Build test
pnpm build

# 5. Lint check
pnpm lint:content

# 6. Manual verify
# Open each file and check:
# - Frontmatter is correct
# - Internal links work
# - Images load
# - Index order is logical
```
