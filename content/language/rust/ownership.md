---
sidebar_position: 2
tags: [Language, Rust]
---

# Ownership

## Memory Model

### Stack

- Primitives
- Fixed size structs.
- Fixed size arrays.
- Pointers and references.

### Heap

- Collections:
  - Arrays.
  - Lists.
  - Strings.
- Dynamic sized objects:
  - Box.
  - Trait objects.

## Copy Trait

Copyable type (implement `Copy` trait):

- Integer type.
- Bool type.
- Float type.
- Char type.
- Copyable Tuple type, e.g. `(i32, i32)`.
- Reference type (**borrowing** ownership).

Most these types store on stack
(including reference type with vtable).

```rust
fn main() {
    // Primitive type.
    let a = 5;
    let b = a;

    // Reference type.
    let x: &str = "hello, world";
    let y = x;

    // Deep clone on `non-Copy` type.
    let s1 = String::from("hello");
    let s2 = s1.clone();

    // Correct.
    println!("a = {}, b = {}", a, b);
    println!("x = {}, y = {}", x, y);
    println!("s1 = {}, s2 = {}", s1, s2);
}
```

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;

    // Error[E0382]: use of moved value: `s1`.
    // Move occurs because `s1` has type `std::string::String`,
    // which does not implement the `Copy` trait.
    println!("{}, world!", s1);
}
```

## Reference

Borrowing ownership with reference type:

- At same time, only one mutable reference or multiple immutable reference.
- Reference should be valid (rustc will report dangling reference error).

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
    // Leave function without drop `s`,
    // due to `s` not owner string.
}
```

Mutable reference:

- Only one mutable reference for a value in a scope).
- Can't mutable borrow an already immutable borrowed value.

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

```rust
fn main() {
   let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;
    let r3 = &mut s;

    // Error.
    println!("{}, {} and {}", r1, r2, r3);
    // End of r1 and r2 borrowing.

    // Correct.
    let r4 = &mut s;
    println!("{}", r4);
}
```

## Smart Pointer

### Box

`Box<T>` 将一个值分配到堆上, 然后在栈上保留一个智能指针指向堆上数据:

- 实现转移所有权时的零拷贝.
- 将不定长类型转换为定长类型.

```rust
fn main() {
    // 在栈上创建一个长度为 1000 的数组.
    let arr = [0;1000];
    // 将 arr 所有权转移 arr1, 由于 `arr` 分配在栈上, 因此直接重新深拷贝了一份数据.
    let arr1 = arr;

    // arr 和 arr1 都拥有各自的栈上数组, 因此不会报错.
    println!("{:?}", arr.len());
    println!("{:?}", arr1.len());

    // 在堆上创建一个长度为 1000 的数组, 然后使用一个智能指针指向它.
    let arr = Box::new([0;1000]);
    // 将堆上数组的所有权转移给 arr1, 由于数据在堆上, 因此仅仅拷贝了智能指针的结构体, 底层数据并没有被拷贝.
    // 所有权顺利转移给 arr1, arr 不再拥有所有权.
    let arr1 = arr;
    println!("{:?}", arr1.len());
    // 由于 arr 不再拥有底层数组的所有权, 因此下面代码将报错.
    // println!("{:?}", arr.len());
}
```

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}
```

### Deref Trait

- `&smart_pointer`
  => `smart_pointer.defer()`.
- `*smart_pointer`
  => `*(smart_pointer.defer())`.
- `smart_pointer.method()`
  => `(&smart_pointer).method()`
  => `(smart_pointer.defer()).method()`.
- When `T: Deref<Target=U>`, then `&T => &U`.
- When `T: DerefMut<Target=U>`, then `&mut T => &mut U`.
- When `T: Deref<Target=U>`, then `&mut T => &U`.

```rust
use core::ops::{self};
use crate::str::{self, from_boxed_utf8_unchecked};
use crate::vec::Vec;

struct String {
    vec: Vec<u8>,
}

impl ops::Deref for String {
    type Target = str;

    fn deref(&self) -> &str {
        unsafe { str::from_utf8_unchecked(&self.vec) }
    }
}

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> ops::Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

fn main() {
    let x = MyBox::new(5);
    assert_eq!(5, *x);
    // => *(x.deref())
    // => *(&x.0)
    // => x.0

    let s = MyBox::new(String::from("hello world"));
    display(&s);
    // => &MyBox
    // => MyBox.deref()
    // => &String
    // => String.deref()
    // => &str

    let hello_world = MyBox::new(String::from("hello, world"));
    let s1: &str = &hello_world;
    // => &MyBox<String>
    // => MyBox<String>.deref()
    // => &String
    // => String.deref()
    // => &str
    let s2: String = hello_world.to_string();
    // => MyBox<String>.to_string()
    // => (&MyBox<String>).to_string()
    // => (MyBox<String>.defer()).to_string()
    // => (&String).to_string()
    let ptr: *const u8 = hello_world.as_ptr();
    // => MyBox<String>.as_ptr()
    // => (&MyBox<String>).as_ptr()
    // => (MyBox<String>.defer()).as_ptr()
    // => (&String).as_ptr()
    // => (String.defer()).as_ptr()
    // => (&str).as_ptr()
}

fn display(s: &str) {
    println!("{}", s);
}
```

### Drop Trait

Drop order:

- 变量级别, 按照逆序的方式, 先创建的变量后 drop.
- 结构体内部, 按照顺序的方式, 结构体中的字段按照定义中的顺序依次 drop.

### Reference Counting

通过引用计数的方式, 允许一个数据资源在同一时刻拥有多个所有者.

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("hello, world"));
    let b = Rc::clone(&a); // 复制了智能指针并增加了引用计数, 并没有克隆底层数据.
    assert_eq!(2, Rc::strong_count(&a));
    assert_eq!(Rc::strong_count(&a), Rc::strong_count(&b))
}
```

- `Rc`/`Arc` 是不可变引用, 无法修改它指向的值.
- `Rc<T>` 是一个智能指针, 实现了 `Deref` 特征, 可以直接使用 `T`.
- 一旦最后一个拥有者消失, 则资源会自动被回收.
- `Arc`: Atomic reference counting.

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let s = Arc::new(String::from("Multiple threads walker"));

    for _ in 0..10 {
        let s = Arc::clone(&s);
        let handle = thread::spawn(move || {
           println!("{}", s)
        });
    }
}
```

### Cell and RefCell

`Cell` for copyable type.

```rust
use std::cell::Cell;

fn main() {
    let c = Cell::new("abc");
    let one = c.get();
    c.set("xyz");
    let two = c.get();
    println!("{}, {}", one, two); // abc, xyz
}
```

```rust
use std::cell::Cell;

fn retain_even(nums: &mut Vec<i32>) {
    let slice: &[Cell<i32>] = Cell::from_mut(&mut nums[..])
        .as_slice_of_cells();

    let mut i = 0;

    for num in slice.iter().filter(|num| is_even(num.get())) {
        slice[i].set(num.get());
        i += 1;
    }

    nums.truncate(i);
}
```

`RefCell` for borrowing reference:

- 实现内部可变性: 不可变值的可变借用.
  `imut_self.refcell_member.borrow_mut().changeMember()`.
- `Rc<RefCell<T>>`: 实现多个可变数据所有者.
- 实现编译期**可变借用**与**不可变借用**共存,
  但会引起运行时 `panic`.

```rust
use std::cell::RefCell;

fn main() {
    let s = RefCell::new(String::from("hello, world"));
    let s1 = s.borrow();
    let s2 = s.borrow_mut();

    println!("{}, {}", s1, s2);
}
```

通过包裹一层 `RefCell`,
将不可变借用 `&self` 的成员成为一个可变值,
然后实现修改:

```rust
use std::cell::RefCell;

pub trait Messenger {
    fn send(&self, msg: String);
}

pub struct MsgQueue {
    msg_cache: RefCell<Vec<String>>,
}

impl Messenger for MsgQueue {
    fn send(&self, msg: String) {
        self.msg_cache.borrow_mut().push(msg)
    }
}

fn main() {
    let mq = MsgQueue {
        msg_cache: RefCell::new(Vec::new()),
    };
    mq.send("hello, world".to_string());
}
```

### Circle Reference

`Weak` 通过 `use std::rc::Weak` 引入, 具有以下特点:

- 可访问, 但没有所有权, 不增加引用计数, 不影响 drop.
- 可由 `Rc<T>` 调用 `downgrade` 方法转换成 `Weak<T>`.
- `Weak<T>` 可使用 `upgrade` 方法转换成 `Option<Rc<T>>`,
  如果资源已经被释放, 则 `Option` 的值是 `None`.
- 常用于解决循环引用的问题.

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf),
    );

    {
        let branch = Rc::new(Node {
            value: 5,
            parent: RefCell::new(Weak::new()),
            children: RefCell::new(vec![Rc::clone(&leaf)]),
        });

        *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

        println!(
            "branch strong = {}, weak = {}",
            Rc::strong_count(&branch),
            Rc::weak_count(&branch),
        );

        println!(
            "leaf strong = {}, weak = {}",
            Rc::strong_count(&leaf),
            Rc::weak_count(&leaf),
        );
    }

    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf),
    );
}
```

## Phantom

虚类型/幽灵类型参数是一种在**运行时不出现**,
仅进行**静态编译检查**的类型参数.

```rust
use std::marker::PhantomData;

struct Iter<'a, T: 'a> {
    ptr: *const T,
    end: *const T,
    _marker: PhantomData<&'a T>,
}

struct Vec<T> {
    data: *const T,
    len: usize,
    cap: usize,
    _marker: PhantomData<T>,
}
```

```rust
use std::marker::PhantomData;

#[derive(PartialEq)]
struct PhantomTuple<A, B>(A, PhantomData<B>);

#[derive(PartialEq)]
struct PhantomStruct<A, B> { first: A, phantom: PhantomData<B> }

fn main() {
    let _tuple1: PhantomTuple<char, f32> = PhantomTuple('Q', PhantomData);
    let _tuple2: PhantomTuple<char, f64> = PhantomTuple('Q', PhantomData);

    let _struct1: PhantomStruct<char, f32> = PhantomStruct {
        first: 'Q',
        phantom: PhantomData,
    };
    let _struct2: PhantomStruct<char, f64> = PhantomStruct {
        first: 'Q',
        phantom: PhantomData,
    };

    // 编译期错误！类型不匹配，所以这些值不能够比较：
    println!("_tuple1 == _tuple2 yields: {}",
              _tuple1 == _tuple2);

    // 编译期错误！类型不匹配，所以这些值不能够比较：
    println!("_struct1 == _struct2 yields: {}",
              _struct1 == _struct2);
}
```

```rust
use std::ops::Add;
use std::marker::PhantomData;

#[derive(Debug, Clone, Copy)]
enum Inch {}
#[derive(Debug, Clone, Copy)]
enum Mm {}

#[derive(Debug, Clone, Copy)]
struct Length<Unit>(f64, PhantomData<Unit>);

impl<Unit> Add for Length<Unit> {
     type Output = Length<Unit>;

    fn add(self, rhs: Length<Unit>) -> Length<Unit> {
        Length(self.0 + rhs.0, PhantomData)
    }
}

fn main() {
    let one_foot:  Length<Inch> = Length(12.0, PhantomData);
    let one_meter: Length<Mm>   = Length(1000.0, PhantomData);

    let two_feet = one_foot + one_foot;
    let two_meters = one_meter + one_meter;

    println!("one foot + one_foot = {:?} in", two_feet.0);
    println!("one meter + one_meter = {:?} mm", two_meters.0);

    // 编译期错误: 类型不匹配.
    let compile_error = one_foot + one_meter;
}
```
