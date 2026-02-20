---
sidebar_position: 1
tags: [Language, Rust, Toolchain]
---

# Toolchain

## Installation

```bash
# RustUp script.
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
# Setup environment variables.
echo '. $HOME/.cargo/env' >> ~/.zshrc
# Install GCC linker and OpenSSL.
sudo apt install build-essential libssl-dev pkg-config
# Done.
cargo -V
rustc -V
```

## Mirrors

```bash
mkdir -vp /home/sabertaz/.cargo

cat << EOF | tee -a /home/sabertaz/.cargo/config.toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = sparse+https://mirrors.ustc.edu.cn/crates.io-index/

[registries.ustc]
index = sparse+https://mirrors.ustc.edu.cn/creates.io-index/
EOF
```

## Cargo

### Commands

```bash
cargo new hello_world
cargo run
cargo build
cargo run --release
cargo build --release
cargo check
cargo generate-lockfile
```

```bash
cargo fmt --check
cargo clippy
cargo test
```

```bash
cargo install cargo-edit
cargo install cargo-release
cargo install cargo-tarpaulin
cargo install cargo-watch
cargo install cargo-workspaces
```

Cargo release configuration:

```toml
[workspace.metadata.release]
# cargo install cargo-release
# cargo release -x
sign-commit = true
sign-tag = true
release = false
push = false
publish = false
shared-version = true
pre-release-commit-message = "chore(release): {{version}}"
post-release-commit-message = "chore(release): {{version}}"
tag-message = "{{tag_name}}"
```

### Cache

`~/.cargo/`:

- `config.toml`: global configuration.
- `credentials.toml`: `cargo login` related file.
- `.crates.toml`/`.crates2.json`: installed package information.
- `bin/`: installed binaries.
- `git/`: installed rust git repositories.
  - `git/db/`: installed git repositories.
  - `git/checkouts/`: branches of git repositories.
- `registry/`: `crates.io` metadata and packages.
  - `registry/index/`: metadata git repository.
  - `registry/cache/`: dependencies cache (`.crate` gzip files).
  - `registry/src/`: package source files.

### Configuration

`Cargo.toml`:

- `cargo-features`: 只能用于 `nightly`版本的 `feature`.
- `[package]`: 定义项目( `package` )的元信息.
  - `name`: 名称.
  - `version`: 版本.
  - `authors`: 开发作者.
  - `edition`: Rust edition.
  - `rust-version`: 支持的最小化 Rust 版本.
  - `description`: 描述.
  - `documentation`: 文档 URL.
  - `readme`: README 文件的路径.
  - `homepage`: 主页 URL.
  - `repository`: 源代码仓库的 URL.
  - `license`: 开源协议 License.
  - `license-file`: License 文件的路径.
  - `keywords`: 项目的关键词.
  - `categories`: 项目分类.
  - `workspace`: 工作空间 workspace 的路径.
  - `build`: 构建脚本的路径.
  - `links`: 本地链接库的名称.
  - `exclude`: 发布时排除的文件.
  - `include`: 发布时包含的文件.
  - `publish`: 用于阻止项目的发布.
  - `metadata`: 额外的配置信息，用于提供给外部工具.
  - `default-run`: [`cargo run`] 所使用的默认可执行文件( binary ).
  - `autobins`: 禁止可执行文件的自动发现.
  - `autoexamples`: 禁止示例文件的自动发现.
  - `autotests`: 禁止测试文件的自动发现.
  - `autobenches`: 禁止 bench 文件的自动发现.
  - `resolver`: 设置依赖解析器( dependency resolver).
- Cargo target configuration:
  - `[lib]`: Library target.
  - `[[bin]]`: Binary target.
  - `[[example]]`: Example target.
  - `[[test]]`: Test target.
  - `[[bench]]`: Benchmark target.
- Dependency tables:
  - `[dependencies]`: 项目依赖包.
  - `[dev-dependencies]`:
    用于 examples、tests 和 benchmarks 的依赖包.
  - `[build-dependencies]`: 用于构建脚本的依赖包.
  - `[target]`: 平台特定的依赖包.
- `[badges]`: 维护状态.
- `[features]`: `features` 可以用于条件编译.
- `[patch]`: 推荐使用的依赖覆盖方式.
- `[profile]`: 编译器设置和优化.
- `[workspace]`: 工作空间的定义.

## GitHub Action

- Use [tool](https://github.com/mozilla/sccache) to speed up compilation.

```yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  CARGO_TERM_COLOR: always

jobs:
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          override: true
      - uses: actions-rs/cargo@v1
        with:
          command: test
          args: --all-features --workspace

  rustfmt:
    name: Rustfmt
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          override: true
          components: rustfmt
      - name: Check formatting
        uses: actions-rs/cargo@v1
        with:
          command: fmt
          args: --all -- --check

  clippy:
    name: Clippy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          override: true
          components: clippy
      - name: Clippy check
        uses: actions-rs/cargo@v1
        with:
          command: clippy
          args: --all-targets --all-features --workspace -- -D warnings

  docs:
    name: Docs
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          override: true
      - name: Check documentation
        env:
          RUSTDOCFLAGS: -D warnings
        uses: actions-rs/cargo@v1
        with:
          command: doc
          args: --no-deps --document-private-items --all-features --workspace

  publish-dry-run:
    name: Publish dry run
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          override: true
      - uses: actions-rs/cargo@v1
        with:
          command: publish
          args: --dry-run

  coverage:
    name: Code coverage
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          override: true
      - name: Run cargo-tarpaulin
        uses: actions-rs/tarpaulin@v0.1
        with:
          args: --all-features --workspace --ignore-tests --out Lcov
      - name: Upload to Coveralls
        if: ${{ github.event_name == 'push' }}
        uses: coverallsapp/github-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          path-to-lcov: ./lcov.info
```

## Node.js Bindings

Tasks suite for native `Node.js` add-ons:

- Computing intensive tasks with simple I/O:
  e.g. `@node-rs/crc32` (CPU SIMD instruction), `@node-rs/bcrypt`, `@node-rs/jieba`.
- System call tasks:
  SIMD instruction, GPU instruction.

[Napi](https://github.com/napi-rs/napi-rs):
Framework for building compiled `Node.js` add-ons in `Rust` via Node API.

```rust
#[macro_use]
extern crate napi;

/// import the preludes
use napi::bindgen_prelude::*;

/// module registration is done by the runtime, no need to explicitly do it now.
#[napi]
fn fibonacci(n: u32) -> u32 {
    match n {
        1 | 2 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

/// use `Fn`, `FnMut` or `FnOnce` traits to defined JavaScript callbacks
/// the return type of callbacks can only be `Result`.
#[napi]
fn get_cwd<T: Fn(String) -> Result<()>>(callback: T) {
    callback(env::current_dir().unwrap().to_string_lossy().to_string()).unwrap();
}

/// or, define the callback signature in where clause
#[napi]
fn test_callback<T>(callback: T)
where T: Fn(String) -> Result<()>
{}

/// async fn, require `async` feature enabled.
/// [dependencies]
/// napi = {version="2", features=["async"]}
#[napi]
async fn read_file_async(path: String) -> Result<Buffer> {
    tokio::fs::read(path)
        .map(|r| match r {
            Ok(content) => Ok(content.into()),
            Err(e) => Err(Error::new(
                Status::GenericFailure,
                format!("failed to read file, {}", e),
            )),
        })
        .await
}
```

[Neon](https://github.com/neon-bindings/neon):
`Rust` bindings for safe and fast native `Node.js` modules.

```rust
use neon::context::{Context, ModuleContext, FunctionContext};
use neon::types::JsNumber;
use neon::result::JsResult;
use neon::result::NeonResult;

fn fibonacci(n: i32) -> i32 {
    return match n {
        n if n < 1 => 0,
        n if n <= 2 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2)
  }
}

fn fibonacci_api(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let handle = cx.argument::<JsNumber>(0).unwrap();
    let res = fibonacci(handle.value(&mut cx) as i32);
    Ok(cx.number(res))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("fibonacci_rs", fibonacci_api)?;
    Ok(())
}
```

```ts
const { fibonacci_rs } = require('./index.node')

const value = process.argv[2] || null
const number = Number.parseInt(value)

if (Number.isNaN(number)) {
  console.log('Provided value is not a number')
  return
}

const result = fibonacci_rs(number)
console.log(result)
```

## Standard Library

- `as_`: `borrowed` -> `borrowed`.
- `into_`: `owned` -> `owned` (移除所有权).
- `to_`:
  `borrowed` -> `borrowed`,
  `borrowed` -> `owned` on non-copy types,
  `owned` -> `owned` on copy types.
- `try_`: 尝试一次, 失败则返回或报错.
- `_mut`: 可变借用.

## Library

### Number

- [Num](https://github.com/rust-num/num):
  Numeric Types and Traits.
- [Rand](https://github.com/rust-random/rand):
  Random Number Generator.

### String

- [Regex](https://github.com/rust-lang/regex):
  Regular Expression Engine.
- [RuleX](https://github.com/rulex-rs/rulex):
  A New and Portable Regular Expression Language.

### DateTime

- [Chrono](https://github.com/chronotope/chrono):
  DateTime Library.

### Asynchronous and Concurrency

- [AsyncStd](https://github.com/async-rs/async-std):
  Asynchronous Version Standard Library.
- [Crossbeam](https://github.com/crossbeam-rs/crossbeam):
  Concurrent Programming.
- [Tokio](https://github.com/tokio-rs/tokio):
  Asynchronous Runtime.
- [Rayon](https://github.com/rayon-rs/rayon):
  Data Parallelism Library.

### Network

- [Reqwest](https://github.com/seanmonstar/reqwest):
  HTTP Client.
- [Quiche](https://github.com/cloudflare/quiche):
  QUIC and HTTP/3 Library.
- [Tonic](https://github.com/hyperium/tonic):
  gRPC Framework.

### Serialization

- [Serde](https://github.com/serde-rs/serde):
  Serialization Framework.

### Web Frameworks

- [Axum](https://github.com/tokio-rs/axum):
  Tokio Web Framework.
- [Rocket](https://github.com/SergioBenitez/Rocket):
  Web Framework.
- [Actix](https://github.com/actix/actix-web):
  Web Framework.
- [Warp](https://github.com/seanmonstar/warp):
  Web Framework.

### Search Engines

- [QuickWit](https://github.com/quickwit-oss/quickwit):
  Distributed Search Engine.
- [MeiliSearch](https://github.com/meilisearch/MeiliSearch):
  Realtime Search Engine.
- [DocFind](https://github.com/microsoft/docfind):
  High-performance document search engine with WebAssembly support.

### Command Line Interface

- [Rata](https://github.com/ratatui/ratatui):
  Cook up terminal user interfaces.
- [Clap](https://github.com/clap-rs/clap):
  CLI Framework.
- [Console](https://github.com/console-rs/indicatif):
  ProgressBar.

### Language Bindings

- [Neon](https://github.com/neon-bindings/neon):
  Node.js Bindings Library.
- [Git](https://github.com/rust-lang/git2-rs):
  Git Bindings Library.

### Testing

- [PrettyAssertions](https://github.com/colin-kiegel/rust-pretty-assertions):
  Overwrite `assert_eq!` with a drop-in replacement, adding a colorful diff.
- [Criterion](https://github.com/bheisler/criterion.rs):
  Benchmarking Library.

### Logging and Tracing

- [Log](https://github.com/rust-lang/log):
  Logging Library.
- [Tracing](https://github.com/tokio-rs/tracing):
  Tracing Library.

### Code Analysis

- [Syn](https://github.com/dtolnay/syn):
  Source Code Parser.

### Documentation

- [Clog](https://github.com/clog-tool/clog-cli):
  Conventional Changelog.

## References

- [Rust Book](https://github.com/rust-lang/book)
- [Rust Nomicon](https://github.com/rust-lang/nomicon)
- [Rust Asynchronism](https://github.com/rust-lang/async-book)
- [Rust Data Structures](https://github.com/rust-unofficial/too-many-lists)
- [Rust Example](https://github.com/rust-lang/rust-by-example)
- [Rust Lings](https://github.com/rust-lang/rustlings)
- [Rust Course](https://github.com/sunface/rust-course)
