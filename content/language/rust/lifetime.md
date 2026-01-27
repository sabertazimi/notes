---
sidebar_position: 8
tags: [Language, Rust, Lifetime]
---

# Lifetime

显式地使用生命周期, 可以让编译器正确地认识到多个**引用**之间的关系.

```rust
&i32        // 一个引用
&'a i32     // 具有显式生命周期的引用
&'a mut i32 // 具有显式生命周期的可变引用
```

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## Function

函数或者方法中,
参数的生命周期被称为`输入生命周期`,
返回值的生命周期被称为`输出生命周期`:

- 每一个引用参数都会获得独自的生命周期:
  `fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`.
- 若只有一个输入生命周期, 则该生命周期会被赋给所有输出生命周期.
- 若存在多个输入生命周期, 且其中一个是`&self`/`&mut self`,
  则`&self`生命周期被赋给所有输出生命周期 (除非显式地声明输出生命周期).

## Static

生命周期`'static`表示持续整个程序,
例如字符串字面量和特征对象.

## Constraint

- `'a: 'b`: `'a` 生命周期更长.
- `T: 'a`: `T` 生命周期更长.
