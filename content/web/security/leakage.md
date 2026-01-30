---
sidebar_position: 25
tags: [Web, Security, Leakage, Privacy, Vulnerability]
---

# Information Leakage

## Attack

- Server in response headers.
- Cookie: J_SESSION_ID -> Java.
- URL: `.jsp`, `.php`, `.asp`.
- Error message.
- AJAX responses.
- JSON/XML responses.
- Code information.

```json
[
  {
    "Server": "Apache/1.3.23",
    "Accept-Ranges": "bytes",
    "Content-length": 196,
    "Connection": "close",
    "Content-Type": "text/html",
    "Cookie": "SESSION_ID=XXXXX"
  },
  {
    "Server": "Microsoft-IIS/5.0",
    "Content-Type": "text/html",
    "Accept-Ranges": "bytes",
    "ETag": "b0aac0542e25c31",
    "Content-Length": 7369
  }
]
```

## Protection

- `NODE_ENV=production`.
- 处理/混淆/加密原始数据 (raw data).
- 处理/混淆客户端代码.
- 去除工具库的版本信息.
- Disable `Server` HTTP header and similar headers.
- Use clean URLs without extensions.
- Use generic cookie parameters.
- Disable client-side error reporting.
- Sanitize data passed to client.
- Obfuscate JavaScript.
- Sanitize template files.
- Ensure correct configuration of Web root directory.
- 配置边界路由器和防火墙: 阻止从敏感来源发起的信息请求.
- 限制对所有敏感信息源的访问.
- 永远不要硬编码密码, 且不放在易暴露位置.
- 对任何敏感信息源使用双因素认证.
- 执行审核来查找潜在的漏洞.
- 使用评估工具来确定是否存在从指定位置外的任何位置访问敏感信息源的可能.

## References

- Leaked secrets in [forced commits and orphan commits](https://github.com/trufflesecurity/force-push-scanner).
