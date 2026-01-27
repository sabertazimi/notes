---
sidebar_position: 4
tags: [Web, Network, HTTPS]
---

# HTTPS

HyperText Transfer Protocol (HTTP) + Transport Layer Security (TLS):

- 验证身份 (不可抵赖性):
  - 通过证书认证客户端, 保证访问的是正确的服务器, 而不是伪造的公钥.
  - CA (Certificate Authority) 认证体系是 HTTPS 防止中间人攻击 (HTTP 明文传输) 的核心,
    客户端需要对服务器发来的证书进行安全性校验 (使得中间人无法替换证书和公私钥).
  - 通过 CA 认证体系避免了中间人窃取 AES 密钥并发起拦截和修改 HTTP 通讯的报文.
- 内容加密 (保密性):
  - 采用混合加密技术 (结合对称加密和非对称加密技术), 中间者无法直接查看明文内容.
  - 会话密钥传输使用非对称加密: 服务器公钥加密, 服务器私钥解密.
  - 会话内容传输使用对称加密: 对称密钥为上一步获取的会话密钥, 性能优于非对称加密.
- 保护数据 (完整性):
  采用单向 Hash 算法, 防止传输的内容被中间人冒充或者篡改.

```bash
server {
  listen 443 ssl;
  server_name www.example.com;
  ssl_certificate www.example.com.crt;
  ssl_certificate_key www.example.com.key;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
}

server {
  listen 80 default_server;
  server_name _;
  return 301 https://$host$request_uri;
}

server {
  add_header Strict-Transport-Security "max-age=31536000" always;
}
```

## Workflow

证书获取及验证过程 (CA 认证体系):

- 客户端发送一个 `ClientHello` 消息到服务器端,
  消息中同时包含了它的 Transport Layer Security (TLS) 版本,
  可用的加密算法和压缩算法.
- 服务器端向客户端返回一个 `ServerHello` 消息,
  消息中包含了服务器端的 TLS 版本,
  服务器所选择的加密和压缩算法,
  以及数字证书认证机构 (Certificate Authority) 签发的服务器公开证书,
  证书中包含了**公钥**, 域名范围 (Common Name), 用于客户端验证身份.
- 客户端通过 CA 认证体系 (CA 服务器) 验证证书是否合法 (浏览器地址栏进行相应提示):
  CA 私钥加密签名, 浏览器公钥解密验证.
  - 浏览器读取证书中的证书所有者与证书有效期等信息进行校验,
    校验证书的网站域名是否与证书颁发的域名一致,
    校验证书是否在有效期内.
  - 浏览器查找操作系统中已内置的受信任的证书发布机构 CA,
    与服务器发来的证书中的颁发者 CA 比对,
    用于校验证书是否为合法机构颁发.
  - 若查找失败, 则浏览器会报错, 服务器发来的证书不可信任.
  - 若查找成功, 则浏览器会从本地取出颁发者 CA 的公钥
    (多数浏览器开发商发布版本时, 会事先在内部植入常用认证机关的公开密钥),
    对服务器发来的证书里包含的签名进行解密.
  - 浏览器使用相同的 Hash 算法计算出服务器发来的证书的 Hash 值,
    将这个计算的 Hash 值与证书中签名做对比.
  - 若对比结果一致, 则证明服务器发来的证书合法, 没有被冒充.

加密密钥传输 (B 端公钥加密 - 传输 - S 端私钥解密):

- 浏览器端生成一个随机数 (**会话密钥**) 并通过**公钥加密**, 传输给服务器.
- 服务器使用**私钥解密**此随机数, 并存储随机数作为对称加密的密钥.

加密报文传输 (S 端对称加密 - 传输 - B 端对称解密):

- 服务器使用随机数对数据进行**对称加密**, 并将加密信息返回给客户端.
- 客户端获得加密数据, 使用随机数作为密钥基于对称加密算法对报文进行**对称解密**.

## Security

- 当浏览器获验证假公钥不合法时, 会对用户进行风险提示, 但用户仍可以授权信任证书继续操作.
- HTTPS 重点关注传输安全, 无法保证本地随机数的存储安全 (木马, 浏览器漏洞).

## CORS

Cross origin resource sharing:

- Same origin:
  URLs (Uniform Resource Locator) with same `protocol + host + port`.
- CORS-safeListed response header:
  `Cache-Control`, `Content-Language`, `Content-Length`, `Content-Type`,
  `Expires`, `Last-Modified`, `Pragma`.
- 由客户端 HTML 标签等发出的跨域 `GET` 请求默认合法, 构成开放的 Web 世界:
  通过 `src` 属性加载的资源, 浏览器限制了 JavaScript 的权限, 使其不能读写返回的内容.

![Cross Origin Resource Sharing](./figures/cors.png 'Cross Origin Resource Sharing')

```bash
OPTIONS /resource.js HTTP/1.1
Host: third-party.com
Origin: http://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: My-Custom-Header

------

HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: My-Custom-Header
```

```bash
Access-Control-Allow-Origin: *
```

```bash
Access-Control-Expose-Headers: X-Custom-Header, Content-Encoding
Access-Control-Expose-Headers: *
```

```bash
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://example.com
Vary: Cookie, Origin
```

```bash
Access-Control-Max-Age: 600
Access-Control-Allow-Methods: Custom-Method, CUSTOM-METHOD
Access-Control-Allow-Headers: X-Custom-Header
```
