---
sidebar_position: 9
tags: [Language, Rust, Closure]
---

# Closure

## Function Parameter Closure

改变捕获变量的所有权 (FnOnce):

```rust
fn fn_once<F>(func: F)
where
    F: FnOnce(usize) -> bool + Copy,
{
    println!("{}", func(3));
    println!("{}", func(4));
}

fn main() {
    let x = vec![1, 2, 3];
    fn_once(|z|{z == x.len()})
}
```

可变借用捕获 (FnMut):

```rust
fn main() {
    let mut s = String::new();

    let update_string =  |str| s.push_str(str);

    exec(update_string);

    println!("{:?}",s);
}

fn exec<'a, F: FnMut(&'a str)>(mut f: F)  {
    f("hello")
}
```

不可变借用捕获 (Fn):

```rust
fn main() {
    let s = "hello, ".to_string();

    let update_string =  |str| println!("{},{}",s,str);

    exec(update_string);

    println!("{:?}",s);
}

fn exec<'a, F: Fn(String) -> ()>(f: F)  {
    f("world".to_string())
}
```

- 所有闭包都自动实现了 `FnOnce` 特征, 因此任何一个闭包都至少可以被调用一次.
- 没有移出所捕获变量的所有权的闭包自动实现了 `FnMut` 特征.
- 不需要对捕获变量进行改变的闭包自动实现了 `Fn` 特征.

## Function Return Closure

```rust
fn factory() -> impl Fn(i32) -> i32 {
    let num = 5;
    |x| x + num
}
```

```rust
fn factory(x:i32) -> Box<dyn Fn(i32) -> i32> {
    let num = 5;

    if x > 1{
        Box::new(move |x| x + num)
    } else {
        Box::new(move |x| x - num)
    }
}
```
