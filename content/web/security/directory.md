---
sidebar_position: 24
tags: [Web, Security, Directory, Vulnerability]
---

# Directory Traversal

## Attack

```bash
GET /../../../passwd.key HTTP/1.1
```

## Protection

- 检查请求路径是否安全, 否则不返回响应.
- Use mature hosting service.
- Use indirect file reference.
- Sanitize file reference.
