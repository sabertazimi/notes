---
sidebar_position: 5
tags: [Language, Rust]
---

# Flow Control

## If

`if` expression:

```rust
let number = if condition {
    5
} else {
    6
};
```

`if let` expression:

```rust
let o = Some(3);
let v = if let Some(x) = o {
    x
} else {
    0
};
```

## Loop

### For

```rust
for i in 1..=5 {}
for _ in 0..10 {}
for item in collection {}
for item in &collection {}
for item in &mut collection {}
for (i, v) in collection.iter().enumerate() {}
```

### While

```rust
fn main() {
    let mut n = 0;

    while n <= 5  {
        println!("{}!", n);
        n = n + 1;
    }
}
```

### Expression

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {}", result);
}
```
