---
sidebar_position: 4
tags: [Language, Rust, Collection]
---

# Collections

## Vector

Create and Insert:

```rust
let mut v = Vec::new();
v.push(1);
```

Access and Get:

```rust
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
println!("3rd: {}", third);

match v.get(2) {
    Some(third) => println!("3rd: {}", third),
    None => println!("None."),
}
```

Visit:

```rust
let v = vec![1, 2, 3];

for i in &v {
    println!("{}", i);
}
```

Visit and Mutate:

```rust
let mut v = vec![1, 2, 3];

for i in &mut v {
    *i += 10
}
```

Store different types:

```rust
enum IpAddr {
    V4(String),
    V6(String)
}

fn main() {
    let v = vec![
        IpAddr::V4("127.0.0.1".to_string()),
        IpAddr::V6("::1".to_string())
    ];

    for ip in v {
        show_addr(ip)
    }
}

fn show_addr(ip: IpAddr) {
    println!("{:?}",ip);
}
```

## HashMap

```rust
use std::collections::HashMap;
```

```rust
// Create.
let mut scores = HashMap::new();

// Insert.
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
scores.entry("Red").or_insert(5);

// Get.
let team_name = String::from("Blue");
let score: Option<&i32> = scores.get(&team_name);

// Visit
for (key, value) in &scores {
    println!("{}: {}", key, value);
}

// Transform.
let from_list: HashMap<_,_> = some_list.into_iter().collect();
```

## HashSet

- insert.
- contains.
- union.
- difference.
- intersection.
- symmetric_difference.
