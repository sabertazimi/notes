---
sidebar_position: 26
tags: [Language, Rust, Macro]
---

# Macros

```rust
#[macro_export]
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
```

## Unsafe Code

`unsafe {}`:

- 对原始指针进行解引用.
- 调用`不安全`的函数 (包括 C 函数, 编译器内建指令, 原始分配器).
- 实现`不安全`的特性.
- 访问`union`字段.
- 改变静态数据.

## Attributes

- Crate scope:`#![crate_attribute]`.
- Module/Function scope: `#[item_attribute]`.

```rust
#[attribute = "value"]
#[attribute(key = "value")]
#[attribute(value)]
```

### Crate Attributes

```rust
#![crate_type = "lib"]
#![crate_name = "rand"]
```

### Linter Attributes

```rust
#[allow(dead_code)]
#[allow(unused)]
```

### Compile Attributes

```rust
#[cfg(target_os = "linux")]
fn are_you_on_linux() {
    println!("You are running linux!")
}

#[cfg(not(target_os = "linux"))]
fn are_you_on_linux() {
    println!("You are *not* running linux!")
}

fn main() {
    are_you_on_linux();

    if cfg!(target_os = "linux") {
        println!("Yes. It's definitely linux!");
    } else {
        println!("Yes. It's definitely *not* linux!");
    }
}
```

## Comments

```rust
// Line Comments
/* Block Comments */
/// Document Line Comments
/** Document Block Comments */
//! Crate Line Comments
/*! Crate Block Comments */

/// [`Option`]
/// [`Type`](struct@Type)
/// [`Type`](fn@Type)

#[doc(alias = "alias" )]
```
