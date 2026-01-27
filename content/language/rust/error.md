---
sidebar_position: 20
tags: [Language, Rust, Error]
---

# Error

## Result

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => panic!("Problem opening the file: {:?}", other_error),
        },
    };
}
```

## Compositor

- `or`: logic or.
- `and`: logic and.
- `or_else`: logic or function.
- `and_then`: logic and function.
- `filter`: `Option` filter function.
- `map`: `Ok`/`Some` map function.
- `map_or`: `Ok`/`Some` map function with defaults value.
- `map_or_else`: `Ok`/`Some` map function with defaults function.
- `map_err`: `Err` map function.
- `ok_or`: `Option` -> `Result` with error message.
- `ok_or_else`: `Option` -> `Result` with error message function.

## Macro

`?` for `Result` type:

```rust
use std::fs::File;
use std::io;
use std::io::Read;

fn open_file() -> Result<File, Box<dyn std::error::Error>> {
    let mut f = File::open("hello.txt")?;
    Ok(f)
}

fn read_username_from_file() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
```

`?` for `Option` type:

```rust
fn last_char_of_first_line(text: &str) -> Option<char> {
    text.lines().next()?.chars().last()
}
```

## Trait

Standard error trait:

```rust
use std::fmt::{Debug, Display};

pub trait Error: Debug + Display {
    fn source(&self) -> Option<&(Error + 'static)> { ... }
}
```

```rust
use std::fs::read_to_string;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let html = render()?;
    println!("{}", html);
    Ok(())
}

fn render() -> Result<String, Box<dyn Error>> {
    let file = std::env::var("MARKDOWN")?;
    let source = read_to_string(file)?;
    Ok(source)
}
```

Custom error type:

```rust
use std::error;
use std::fmt;

#[derive(Debug)]
struct AppError;

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "An Error Occurred, Please Try Again!")
    }
}

impl error::Error for AppError {
    fn description(&self) -> &str {
        "Invalid App"
    }

    fn source(&self) -> Option<&(dyn error::Error + 'static)> {
        None
    }

    fn cause(&self) -> Option<&dyn error::Error> {
        None
    }
}

fn produce_error() -> Result<(), AppError> {
    Err(AppError)
}

fn main(){
    match produce_error() {
        Err(e) => eprintln!("{}", e),
        _ => println!("No error"),
    }

    eprintln!("{:?}", produce_error()); // Err({ file: src/main.rs, line: 17 })
}
```

## Conversion

```rust
use std::fs::File;
use std::io::{self, Read};
use std::num;

#[derive(Debug)]
struct AppError {
    kind: String,
    message: String,
}

impl From<io::Error> for AppError {
    fn from(error: io::Error) -> Self {
        AppError {
            kind: String::from("io"),
            message: error.to_string(),
        }
    }
}

impl From<num::ParseIntError> for AppError {
    fn from(error: num::ParseIntError) -> Self {
        AppError {
            kind: String::from("parse"),
            message: error.to_string(),
        }
    }
}

fn main() -> Result<(), AppError> {
    let mut file = File::open("hello_world.txt")?;

    let mut content = String::new();
    file.read_to_string(&mut content)?;

    let _number: usize;
    _number = content.parse()?;

    Ok(())
}

// --------------- 上述代码运行后的可能输出 ---------------
// 01. 若 hello_world.txt 文件不存在
// Error: AppError { kind: "io", message: "No such file or directory" }
// 02. 若用户没有相关的权限访问 hello_world.txt
// Error: AppError { kind: "io", message: "Permission denied" }
// 03. 若 hello_world.txt 包含有非数字的内容，例如 Hello, world!
// Error: AppError { kind: "parse", message: "invalid digit found in string" }
```
