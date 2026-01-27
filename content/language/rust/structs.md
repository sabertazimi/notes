---
sidebar_position: 7
tags: [Language, Rust, Struct, Generic, Trait]
---

# Structs

## Struct

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}

let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("username123"),
    active: true,
    sign_in_count: 1,
};

let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};
```

### Tuple

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

`newtype`: Wrap type into tuple struct:

- Make code more readable.
- Implement 3rd traits for 3rd types.
- Hide internal details of types.

```rust
struct Meters(u32);
```

### Unit

```rust
struct AlwaysEqual;
let subject = AlwaysEqual;
impl SomeTrait for AlwaysEqual {}
```

## Method

```rust
struct Circle {
    x: f64,
    y: f64,
    radius: f64,
}

impl Circle {
    fn new(x: f64, y: f64, radius: f64) -> Circle {
        Circle {
            x,
            y,
            radius,
        }
    }

    fn area(&self) -> f64 {
        std::f64::consts::PI * (self.radius * self.radius)
    }
}
```

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {}
}

fn main() {
    let m = Message::Write(String::from("hello"));
    m.call();
}
```

### Self

- `self`: 所有权转移.
- `&self`: 不可变借用.
- `&mut self`: 可变借用.

```rust
pub struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    pub fn new(width: u32, height: u32) -> Self {
        Rectangle { width, height }
    }
    pub fn width(&self) -> u32 {
        return self.width;
    }
    pub fn height(&self) -> u32 {
        return self.height;
    }
}

fn main() {
    let rect = Rectangle::new(30, 50);
    println!("{}", rect.width());
    println!("{}", rect.height());
}
```

## Generics

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}

struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }

    fn mixup<U>(self, other: Point<U>) {}
}

impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn add<T: std::ops::Add<T, Output = T>>(a:T, b:T) -> T {
    a + b
}

fn largest<T: PartialOrd>(list: &[T]) -> T {}
```

- TurboFish:
  - `generics_struct::<T>::method()`.
  - `struct.generics_method::<T>()`.
- Use associated types in traits.

## Traits

```rust
pub struct Post {
    pub username: String,
    pub content: String
}

pub trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

impl Summary for Post {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
}

fn main() {
    let post = Post{username: "username".to_string(),content: "content".to_string()};
    println!("1 new post: {}", post.summarize());
}
```

- `std::fmt::Display` (better than `std::string::ToString`).
- `std::fmt::Debug`.
- `std::ops::Add`/`Mul`/`Div`/`BitAnd`/`BitOr`/`Not`/`Neg`: operators overload.
- `std::ops::Fn`/`FnMut`/`FnOnce`.
- `std::ops::Deref`.
- `std::ops::Drop`.
- `std::clone::Clone`.
- `std::iter::Iterator`.

`std::prelude`:

- `std::marker::{Copy, Send, Sized, Sync, Unpin}`.
- `std::ops::{Drop, Fn, FnMut, FnOnce}`.
- `std::mem::drop`.
- `std::boxed::Box`.
- `std::borrow::ToOwned`.
- `std::clone::Clone`.
- `std::cmp::{PartialEq, PartialOrd, Eq, Ord}`.
- `std::convert::{AsRef, AsMut, Into, From}`.
- `std::default::Default`.
- `std::iter::{Iterator, Extend, IntoIterator, DoubleEndedIterator, ExactSizeIterator}`.
- `std::option::Option::{self, Some, None}`.
- `std::result::Result::{self, Ok, Err}`.
- `std::string::{String, ToString}`.
- `std::vec::Vec`.
- `std::convert::{TryFrom, TryInto}`.
- `std::iter::FromIterator`.

```rust
use std::io::prelude::*;
```

### Orphan

Rust can’t implement external traits on external types:
can’t implement the `Display` trait on `Vec<T>` in `some_package` crate,
because `Display` and `Vec<T>` are **both** defined out of `some_package`.
This restriction is part of a property of programs called coherence,
ensures that other people’s code can’t break your code and vice versa.

### Bound

```rust
fn notify(item: &impl Summary) {}
fn notify(item: &(impl Summary + Display)) {}
fn notify<T: Summary>(item: &T) {}
fn notify<T: Summary + Display>(item: &T) {}
fn notify<T, U>(t: &T, u: &U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{}
```

```rust
trait SomeTrait: BoundTrait {}
```

```rust
// 可以对任何实现了 Display 特征的类型调用 ToString 特征中方法.
impl<T: Display> ToString for T {}
```

### Derive

```rust
#[derive(Debug)]
#[derive(PartialEq)]
#[derive(Eq)]
#[derive(PartialOrd)]
#[derive(Ord)]
#[derive(Clone)]
#[derive(Copy)]
#[derive(Hash)]
#[derive(Default)]
```

```rust
trait Person {
    fn name(&self) -> String;
}

trait Student: Person {
    fn university(&self) -> String;
}

trait Programmer {
    fn fav_language(&self) -> String;
}

trait CompSciStudent: Programmer + Student {
    fn git_username(&self) -> String;
}

fn comp_sci_student_greeting(student: &dyn CompSciStudent) -> String {
    format!(
        "My name is {} and I attend {}. My language is {}. My Git username is {}",
        student.name(),
        student.university(),
        student.fav_language(),
        student.git_username()
    )
}
```

### Object

- Define trait object:
  - `Box<dyn some_trait>`.
  - `&dyn some_trait`.
- A trait can have trait object only when
  it is `object safe`:
  - all methods can't return `Self`.
  - all methods can't be generics.
- Trait object has `'static` lifetime.
- Trait object stand for dynamic distributing (runtime),
  generics stand for static distributing (compile time).

```rust
trait Draw {
    fn draw(&self) -> String;
}

impl Draw for u8 {
    fn draw(&self) -> String {
        format!("u8: {}", *self)
    }
}

impl Draw for f64 {
    fn draw(&self) -> String {
        format!("f64: {}", *self)
    }
}

fn draw1(x: Box<dyn Draw>) {
    x.draw();
}

fn draw2(x: &dyn Draw) {
    x.draw();
}

fn main() {
    let x = 1.1f64;
    let y = 8u8;

    draw1(Box::new(x));
    draw1(Box::new(y));
    draw2(&x);
    draw2(&y);
}
```

### Associated Types

Associated types make code become readable and concise:

```rust
trait Container<A,B> {
    fn contains(&self,a: A,b: B) -> bool;
}

fn difference<A,B,C>(container: &C) -> i32
  where
    C : Container<A,B> {}
```

```rust
trait Container{
    type A;
    type B;
    fn contains(&self, a: &Self::A, b: &Self::B) -> bool;
}

fn difference<C: Container>(container: &C) {}
```

For all **generic trait**,
use associated types better than `<T>`.
