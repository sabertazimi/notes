---
sidebar_position: 3
tags: [Language, Rust, Type]
---

# Types

## String

`&str` string slice reference type:

- Borrowing type.
- UTF-8 encode (1 ~ 4 bytes).
- String literal is `&str` type.

```rust
let s = String::from("hello world");
let len = s.len();

let hello = &s[0..5];
let world = &s[6..11];
let slice1 = &s[0..2];
let slice2 = &s[..2];
let slice3 = &s[4..len];
let slice4 = &s[4..];
let slice5 = &s[0..len];
let slice6 = &s[..];
```

`String` type:

- Ownership type.
- UTF-8 encode (1 ~ 4 bytes).

```rust
fn main() {
    let mut s = String::new();
    s.push_str("hello,world");
    s.push('!');
    assert_eq!(s,"hello,world!");

    let mut s = "hello,world".to_string();
    s.push('!');
    assert_eq!(s,"hello,world!");

    let mut s = String::from("你好, 世界");
    s.push('!');
    assert_eq!(s,"你好, 世界!");

    let s1 = String::from("hello,");
    let s2 = String::from("world!");
    let s3 = s1 + &s2;
    assert_eq!(s3,"hello,world!");

    for c in "中国人".chars() {
        println!("{}", c);
    }
}
```

## Enum

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let m1 = Message::Quit;
    let m2 = Message::Move{x: 1, y: 1};
    let m3 = Message::ChangeColor(255, 255, 0);
}
```

```rust
enum Option<T> {
    Some(T),
    None,
}

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

## Array

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
let b = [3; 5];
let slice: &[i32] = &a[1..3];
assert_eq!(slice, &[2, 3]);

fn main() {
  let one             = [1, 2, 3];
  let two: [u8; 3]    = [1, 2, 3];
  let blank1          = [0; 3];
  let blank2: [u8; 3] = [0; 3];

  let arrays: [[u8; 3]; 4]  = [one, two, blank1, blank2];

  for a in &arrays {
    print!("{:?}: ", a);

    for n in a.iter() {
      print!("\t{} + 10 = {}", n, n+10);
    }

    let mut sum = 0;

    for i in 0..a.len() {
      sum += a[i];
    }

    println!("\t({:?} = {})", a, sum);
  }
}
```

## Alias

```rust
type Meters = i32;

let x: u32 = 5;
let y: Meters = 5;

println!("x + y = {}", x + y);
```

```rust
type Result<T> = std::result::Result<T, std::io::Error>;
type Thunk = Box<dyn Fn() + Send + 'static>;

let f: Thunk = Box::new(|| println!("hi"));
fn takes_long_type(f: Thunk) {}
fn returns_long_type() -> Thunk {}
```

## Conversion

### Explicit

```rust
fn main() {
    let a = 3.1 as i8;
    let b = 100_i8 as i32;
    let c = 'a' as u8;
    println!("{}, {}, {}", a, b, c);

    let x: i16 = 1500;
    let x_: u8 = match x.try_into() {
        Ok(x1) => x1,
        Err(e) => {
            println!("{:?}", e.to_string());
            0
        }
    };
}
```

### Implicit

`target.method()`:

1. Call by value: `T::method(target)`.
2. Call by reference: `T::method(&target)` or `T::method(&mut target)`.
3. Call by deref: when `T: Deref<Target = U>`, then `(&T).method() => (&U).method()`.
4. Length-non-determined collection to length-determined slice.
5. Panic.

```rust
let array: Rc<Box<[T; 3]>> = ...;
let first_entry = array[0];
// 1. `Index` trait grammar sugar: array[0] => array.index(0).
// 2. Call by: value: `Rc<Box<[T; 3]>>` not impl `Index` trait.
// 3. Call by reference: `&Rc<Box<[T; 3]>>` not impl `Index` trait.
// 4. Call by reference: `&mut Rc<Box<[T; 3]>>` not impl `Index` trait.
// 5. Call by deref -> Call by value: `Box<[T; 3]>` not impl `Index` trait.
// 6. Call by deref -> Call by reference: `&Box<[T; 3]>` not impl `Index` trait.
// 7. Call by deref -> Call by reference: `&mut Box<[T; 3]>` not impl `Index` trait.
// 8. Call by deref -> Call by deref: `[T; 3]` not impl `Index` trait.
// 9. `[T; 3]` => `[T]` impl `Index` trait.
```

### From Trait

```rust
use std::convert::From;

#[derive(Debug)]
struct Number {
    value: i32,
}

impl From<i32> for Number {
    fn from(item: i32) -> Self {
        Number { value: item }
    }
}

fn main() {
    let num = Number::from(30);
    println!("My number is {:?}", num);

    let int = 5;
    let num: Number = int.into();
    println!("My number is {:?}", num);
}
```

```rust
use std::convert::TryFrom;
use std::convert::TryInto;

#[derive(Debug, PartialEq)]
struct EvenNumber(i32);

impl TryFrom<i32> for EvenNumber {
    type Error = ();

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        if value % 2 == 0 {
            Ok(EvenNumber(value))
        } else {
            Err(())
        }
    }
}

fn main() {
    // TryFrom
    assert_eq!(EvenNumber::try_from(8), Ok(EvenNumber(8)));
    assert_eq!(EvenNumber::try_from(5), Err(()));

    // TryInto
    let result: Result<EvenNumber, ()> = 8i32.try_into();
    assert_eq!(result, Ok(EvenNumber(8)));
    let result: Result<EvenNumber, ()> = 5i32.try_into();
    assert_eq!(result, Err(()));
}
```

## Dynamically Sized Type

DST:

- DST 无法单独被使用, 必须要通过 `&`/`Box`/`Rc` 来间接使用.
- `str`, `[T]`, `dyn Trait`.

```rust
// Error!
let s1: str = "Hello there!";
let s2: str = "How's it going?";

// Ok.
let s3: &str = "on?";
let s4: Box<str> = "Hello there!".into();
```

```rust
// Error!
fn my_function(n: usize) {
    let array = [123; n];
}
```

```rust
fn foobar_1(thing: &dyn MyThing) {}     // OK.
fn foobar_2(thing: Box<dyn MyThing>) {} // OK.
fn foobar_3(thing: Rc<dyn MyThing>) {}  // OK.
fn foobar_4(thing: MyThing) {}          // ERROR!
```

### Sized Trait

Implicit sized trait:

```rust
fn generic<T>(t: T) {}
// Auto-transform to by Rust compiler
fn generic<T: Sized>(t: T) {}
```

Dynamic sized generics:

```rust
fn generic<T: ?Sized>(t: &T) {}
```
