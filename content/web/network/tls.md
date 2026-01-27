---
sidebar_position: 12
tags: [Web, Network, TLS]
---

# TLS

![Transport Layer Security](./figures/tls.png 'Transport Layer Security')

## Protocol

- SSL 1.0 (Security Sockets Layer) (Netscape).
- SSL 2.0.
- SSL 3.0.
- TLS 1.0 (RFC 2246).
- TLS 1.1.
- TLS 1.2.
- 加密:
  通过密钥协商, 混淆数据的机制.
- 身份验证:
  通过建立认证机构信任链 (Chain of Trust and Certificate Authorities), 验证身份标识有效性的机制.
- 完整性:
  通过 MAC (Message Authentication Code) 签署消息, 检测消息是否被篡改或伪造的机制.

![TLS Setup](./figures/tls-setup.png 'TLS Setup')

## Performance

- 在支持的客户端中使用会话记录单 (Session Ticket, RFC 5077),
  在不支持的客户端中使用会话标识符 (Session Identifier, RFC 5246).
- 支持多进程或工作进程的服务器应该使用共享的会话缓存.
- 共享的会话缓存的大小应该根据流量调整.
- 应该设置会话超时时间.
- 在多台服务器并存的情况下,
  把相同的客户端 IP 或相同的 TLS 会话 ID 路由到同一台服务器可以最好地利用会话缓存.
- 在不适宜使用单一负载均衡策略的情况下,
  应该为多台服务器配置共享缓存, 以便最好地利用会话缓存.
- 检查和监控 SSL/TLS 会话缓存的使用情况, 以之作为性能调优的依据.
- 小记录会造成浪费, 大记录会导致延迟:
  一方面不要让 TLS 记录分成多个 TCP 分组, 另一方面又要尽量在一条记录中多发送数据
  (e.g. 1400 bytes).
- 尽量减少中间证书颁发机构的数量 (确保证书链不会超过拥塞窗口的大小):
  理想情况下, 发送的证书链应该只包含两个证书,
  即站点证书和中间证书颁发机构的书 (根证书颁发机构的证书由浏览器内置提供).
- 禁用 TLS 压缩: 防止 `CRIME` 攻击 (2012), 防止双重压缩 (Gzip).
- 启用服务器对 SNI (Server Name Indication) 的支持.
- 启用服务器的 OCSP (Online Certificate Status Protocol) 封套功能.
- 追加 HTTP 严格传输 (HSTS, HTTP Strict Transport Security) 安全首部.
- 降低 TLS 延迟:
  - 服务器应该通过 ALPN (Application Layer Protocol Negotiation) 协商支持 TLS.
  - 服务器应该支持 TLS 恢复以最小化握手延迟.
- TLS testing [toolkit](https://www.ssllabs.com/ssltest/index.html).

```bash
openssl s_client -state -CAfile start-ssl.ca.crt -connect server.com:443
```
