---
sidebar_position: 10
tags: [Language, Rust, Iterator]
---

# Iterator

```rust
let arr = [1, 2, 3];

for v in arr.into_iter() {
    println!("{}", v);
}
```

```rust
fn main() {
    let arr = [1, 2, 3];
    let mut arr_iter = arr.into_iter();

    assert_eq!(arr_iter.next(), Some(1));
    assert_eq!(arr_iter.next(), Some(2));
    assert_eq!(arr_iter.next(), Some(3));
    assert_eq!(arr_iter.next(), None);
}
```

## Iterator Trait

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}

impl<I: Iterator> IntoIterator for I {
    type Item = I::Item;
    type IntoIter = I;

    #[inline]
    fn into_iter(self) -> I {
        self
    }
}
```

- `iter`: 不可变借用.
- `iter_mut`: 可变借用.
- `into_iter`: 改变所有权.

```rust
fn iter(&self) -> Iter             // Iter implements Iterator<Item = &U>
fn iter_mut(&mut self) -> IterMut  // IterMut implements Iterator<Item = &mut U>
fn into_iter(self) -> IntoIter     // IntoIter implements Iterator<Item = U>
```

```rust
fn main() {
    let values = vec![1, 2, 3];

    for v in values.into_iter() {
        println!("{}", v)
    }

    // 下面的代码将报错.
    // println!("{:?}",values);

    let values = vec![1, 2, 3];
    let _values_iter = values.iter();

    // 不会报错.
    println!("{:?}", values);

    let mut values = vec![1, 2, 3];
    // 对 values 中的元素进行可变借用.
    let mut values_iter_mut = values.iter_mut();

    // 取出第一个元素, 并修改为0.
    if let Some(v) = values_iter_mut.next() {
        *v = 0;
    }

    // 输出 [0, 2, 3].
    println!("{:?}", values);
}
```

Implement iterator:

```rust
struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

fn main() {
    let mut counter = Counter::new();
    assert_eq!(counter.next(), Some(1));
    assert_eq!(counter.next(), Some(2));
    assert_eq!(counter.next(), Some(3));
    assert_eq!(counter.next(), Some(4));
    assert_eq!(counter.next(), Some(5));
    assert_eq!(counter.next(), None);

    let sum: u32 = Counter::new()
        .zip(Counter::new().skip(1))
        .map(|(a, b)| a * b)
        .filter(|x| x % 3 == 0)
        .sum();
    assert_eq!(18, sum);
}
```

## Adapter Methods

- 消费性适配器: 获取迭代器的所有权, 并消耗迭代器中所有元素.
  - `collect::<T>()`.
  - fold.
  - partition.
  - `sum::<T>()`.
- 迭代性适配器: 惰性方法 (Lazy Iterator)
  - enumerate.
  - filter.
  - filter_map.
  - map.
  - take_while.
  - zip.
- Ordinary iterator methods:
  - Iterator::any.
  - Iterator::find.

More adapter methods see `Iterator` trait
[documentation](https://doc.rust-lang.org/std/iter/trait.Iterator.html).

```rust
fn main() {
    let v1 = vec![1, 2, 3];
    let v1_iter = v1.iter();
    let total: i32 = v1_iter.sum();
    assert_eq!(total, 6);

    // v1_iter 是借用了 v1, 因此 v1 可以照常使用.
    println!("{:?}",v1);

    // 以下代码会报错, 因为 `sum` 拿到了迭代器 `v1_iter` 的所有权.
    // println!("{:?}",v1_iter);
}
```

```rust
fn main() {
    let v1: Vec<i32> = vec![1, 2, 3];
    let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();
    assert_eq!(v2, vec![2, 3, 4]);
}
```

```rust
use std::collections::HashMap;

fn main() {
    let names = ["name1", "name2"];
    let ages = [18, 18];
    let folks: HashMap<_, _> = names.into_iter().zip(ages.into_iter()).collect();
    println!("{:?}",folks);
}
```
