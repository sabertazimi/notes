---
sidebar_position: 13
tags: [Web, Security, Command, Injection, Vulnerability]
---

# Command Injection

## Attack

```json
{
  "query": "?domain=google.com%3BEcho%20%22Hacked%22"
}
```

## Protection

- Escape control characters: `<`/`>`/`?`/`=`/`&&`.
- Disable code execution during deserialization.
- 尽量不使用系统执行命令.
- 保证动态函数为受信任函数, 防止被攻击者替换.
