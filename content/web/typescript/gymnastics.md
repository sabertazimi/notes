---
sidebar_position: 21
tags: [Web, TypeScript, Gymnastics]
---

# Type Gymnastics

[Type programming](https://exploringjs.com/tackling-ts/ch_computing-with-types-overview.html):

| Level         | Environment  | Operands       | Operations    |
| ------------- | ------------ | -------------- | ------------- |
| Program level | Runtime      | Values         | Functions     |
| Type level    | Compile time | Specific types | Generic types |

| `TypeScript` Term         | Set Term                 |
| ------------------------- | ------------------------ |
| `never`                   | `∅` (Empty set)          |
| Literal type              | Single element set       |
| `Value` assignable to `T` | `Value ∈ T` (Member)     |
| `T1` assignable to `T2`   | `T1 ⊆ T2` (Subset)       |
| `T1 extends T2`           | `T1 ⊆ T2` (Subset)       |
| `T1 \| T2`                | `T1 ∪ T2` (Union)        |
| `T1 & T2`                 | `T1 ∩ T2` (Intersection) |
| `unknown`                 | Universal set            |

## Types

- [Template literal types](./literal.md#template-literal).
- [Index signature](./signature.md#index-signature).
- [Mapped types](./mapped.md).
- [Conditional types](./conditional.md):
  - [Nested conditional types](./conditional.md#nested).
  - [Index conditional types](./conditional.md#index).
  - [Mapped conditional types](./conditional.md#mapped).
  - [Distributive conditional types](./conditional.md#distributive).
- `infer` [inference types](./narrowing.md#type-inference).
- `...` [rest types](./function.md#rest-parameters): `Items extends [infer Head, ...infer Tail]`.
- [Recursive types](./utility.md#recursive).

## Examples

- `PathOf<Form>` complex recursive [types](https://mp.weixin.qq.com/s/KJdUdwbLN4g4M7xy34m-fA).
- Type-safe React router advanced [types](https://speakerdeck.com/zoontek/advanced-typescript-how-we-made-our-router-typesafe).

```tsx
type PathSegments<Path extends string>
  = Path extends `${infer SegmentA}/${infer SegmentB}`
    ? ParamOnly<SegmentA> | PathSegments<SegmentB>
    : ParamOnly<Path>
type ParamOnly<Segment extends string> = Segment extends `:${infer Param}`
  ? Param
  : never
type RouteParams<Path extends string> = {
  [Key in PathSegments<Path>]: string
}

interface RouteProps<Path extends string> {
  path: Path
  render: (routeProps: { match: { params: RouteParams<Path> } }) => void
}

export default function App() {
  return (
    <Route
      path="/user/:username"
      render={(routeProps) => {
        const params = routeProps.match.params
      }}
    />
  )
}
```

## References

- Type [challenges](https://github.com/type-challenges/type-challenges).
- Type [gymnastics](https://github.com/g-plane/type-gymnastics).
- Type [trident](https://github.com/anuraghazra/type-trident).
