---
sidebar_position: 51
tags: [Web, JavaScript, ECMAScript, Network, WebSocket]
---

# WebSocket

通信功能:

- `data`:
  - `string`.
  - `ArrayBuffer`.
  - `Blob`.
- `readyState`:
  - `WebSocket.OPENING`: `0`, 连接正在建立.
  - `WebSocket.OPEN`: `1`, 连接已经建立.
  - `WebSocket.CLOSING`: `2`, 连接正在关闭.
  - `WebSocket.CLOSE`: `3`, 连接已经关闭.

```ts
function WebSocketTest() {
  if ('WebSocket' in window) {
    alert('WebSocket is supported by your Browser!')
    // Let us open a web socket
    const ws = new WebSocket('ws://localhost:9998/echo')

    ws.onopen = function () {
      // WebSocket is connected, send data using send()
      ws.send('Message to send')
      alert('Message is sent...')
    }

    ws.onmessage = function (event) {
      const receivedMessage = event.data
      alert('Message is received...')
    }

    ws.onclose = function (event) {
      // websocket is closed.
      console.log(
        `As clean? ${event.wasClean} Code=${event.code} Reason=${event.reason}`
      )
    }

    ws.onerror = function () {
      alert('Connection error.')
    }
  } else {
    // The browser doesn't support WebSocket
    alert('WebSocket NOT supported by your Browser!')
  }
}
```

## Header

Request Header:

```bash
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: 16-byte, base64 encoded
Sec-WebSocket-Version: 13
Sec-Websocket-Protocol: protocol [,protocol]*
Sec-Websocket-Extension: extension [,extension]*
```

Response Header:

```bash
HTTP/1.1 101 "Switching Protocols" or other description
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: 20-byte, MD5 hash in base64
Sec-Websocket-Protocol: protocol [,protocol]*
Sec-Websocket-Extension: extension [,extension]*
```

## Extension

WebSocket 存在与 HTTP/1.1 类似的性能瓶颈: 队头阻塞, 无法多路复用.

WebSocket 规范允许对协议进行扩展,
数据格式和 WebSocket 协议的语义可以通过新的操作码和数据字段扩展:

- 多路复用扩展 (WebSocket Multiplexing Extension):
  使用`信道 ID`扩展每个 WebSocket 帧, 实现多个虚拟的 WebSocket 信道共享一个 TCP 连接.
- 压缩扩展 (WebSocket Compression Extension):
  给 WebSocket 协议增加了压缩功能.

## HeartBeat

连接终止时, WebSocket 不会自动恢复,
需要自己实现, 通常为了保持连接状态, 需要增加心跳机制.

每隔一段时间会向服务器发送一个数据包, 告诉服务器自己 Alive,
服务器端如果 Alive, 就会回传一个数据包给客户端.
主要在一些**长时间连接**的应用场景需要考虑心跳机制及重连机制,
以保证长时间的连接及数据交互.

## Performance

- 使用安全 WebSocket (基于 TLS 的 WSS) 实现可靠的部署, 绕过中间代理.
- 密切关注腻子脚本的性能.
- 利用子协议协商确定应用协议.
- 优化二进制净荷以最小化传输数据.
- 考虑压缩 UTF-8 内容以最小化传输数据.
- 设置正确的二进制类型以接收二进制净荷.
- 监控客户端缓冲数据的量.
- 切分应用消息以避免队首阻塞.
- 合用的情况下利用其他传输机制.
- 对于无线设备, 注意节能:
  消除周期性无效数据, 减少冗余数据, 消除不必要的长连接.

## References

- [WebSocket Guide](https://hpbn.co/websocket)
- [WebSocket vs Long Polling](https://ably.com/blog/websockets-vs-long-polling)
