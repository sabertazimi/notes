---
sidebar_position: 25
tags: [Language, Rust, Testing]
---

# Testing

```rust
fn greeting(name: &str) -> String {
    format!("Hello {}!", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[ignore]
    #[should_panic]
    #[should_panic(expected = "Panic message.")]
    fn greeting_contains_name() {
        let target = "name";
        let result = greeting("Name");
        assert!(
            result.contains(target),
            "Expect: `{}`, Result: `{}`",
            target,
            result
        );
    }
}
```
