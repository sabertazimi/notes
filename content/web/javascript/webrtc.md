---
sidebar_position: 52
tags: [Web, JavaScript, ECMAScript, Network, WebRTC]
---

# WebRTC

```ts
const ice = {
  iceServers: [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'turn:user@turnserver.com', credential: 'pass' },
  ],
}
const signalingChannel = new SignalingChannel()
const pc = new RTCPeerConnection(ice)

navigator.getUserMedia({ audio: true }, getStream, logError)

function getStream(evt) {
  pc.addstream(evt.stream)

  const localVideo = document.querySelector('#local-video')
  localVideo.src = window.URL.createObjectURL(evt.stream)

  pc.createOffer((offer) => {
    pc.setLocalDescription(offer)
    signalingChannel.send(offer.sdp)
  })
}

pc.onicecandidate = function (evt) {
  if (evt.candidate)
    signalingChannel.send(evt.candidate)
}

pc.oniceconnectionstatechange = function (evt) {
  logStatus(`ICE connection state change: ${evt.target.iceConnectionState}`)
}

pc.onaddstream = function (evt) {
  const remoteVideo = document.querySelector('#remote-video')
  remoteVideo.src = window.URL.createObjectURL(evt.stream)
}

signalingChannel.onmessage = function (msg) {
  if (msg.candidate)
    pc.addIceCandidate(msg.candidate)
}
```

## Communication

[Web Real-Time Communication](https://developer.mozilla.org/docs/Web/API/WebRTC_API)
(Web 实时通信, WebRTC) 由一组标准, 协议和 JavaScript API 组成,
用于实现浏览器之间 (端到端, P2P) 的音频/视频/数据共享:

- [MediaStream](https://developer.mozilla.org/docs/Web/API/MediaStream).
- [RTCPeerConnection](https://developer.mozilla.org/docs/Web/API/RTCPeerConnection):
  - 管理穿透 NAT 的完整 ICE 工作流.
  - 发送自动 (STUN) 持久化信号.
  - 跟踪本地流.
  - 跟踪远程流.
  - 按需触发自动流协商.
  - 生成连接提议, 接收应答, 允许查询连接的当前状态等.
- [RTCDataChannel](https://developer.mozilla.org/docs/Web/API/RTCDataChannel):
  DataChannel API 用于实现端到端之间的任意应用数据交换 (端到端交换版本的 WebSocket).

![WebRTC Engine](./figures/web-rtc-engine.png 'WebRTC Engine')

## Protocol

![WebRTC Layer Protocol](./figures/web-rtc-layer-protocol.png 'WebRTC Layer Protocol')

- WebRTC 使用 UDP 作为传输层协议: 低延迟和及时性才是关键.
- ICE: Interactive Connectivity Establishment (RFC 5245).
  - STUN: Session Traversal Utilities for NAT (RFC 5389).
  - TURN: Traversal Using Relays around NAT (RFC 5766).
- SDP: Session Description Protocol (RFC 4566).
- DTLS: Datagram Transport Layer Security (RFC 6347).
- SCTP: Stream Control Transport Protocol (RFC 4960).
- SRTP: Secure Real-Time Transport Protocol (RFC 3711).

## Performance

- 发信服务:
  - 使用低延迟传输机制.
  - 提供足够的容量.
  - 建立连接后, 考虑使用 DataChannel 发信.
- 防火墙和 NAT 穿透:
  - 初始化 RTCPeerConnection 时提供 STUN 服务器.
  - 尽可能使用增量 ICE, 虽然发信次数多, 但建立连接速度快.
  - 提供 STUN 服务器, 以备端到端连接失败后转发数据.
  - 预计并保证 TURN 转发时容量足够用.
- 数据分发:
  - 对于大型多方通信, 考虑使用超级节点或专用的中间设备.
  - 中间设备在转发数据前, 考虑先对其进行优化或压缩.
- 数据效率:
  - 对音频和视频流指定适当的媒体约束.
  - 优化通过 DataChannel 发送的二进制净荷.
  - 考虑压缩通过 DataChannel 发送的 UTF-8 数据.
  - 监控 DataChannel 缓冲数据的量, 同时注意适应网络条件变化.
- 交付及可靠性:
  - 使用乱序交付避免队首阻塞.
  - 如果使用有序交付, 把消息大小控制到最小, 以降低队首阻塞的影响.
  - 发送小消息 (小于 1150 字节), 以便将分段应用消息造成的丢包损失降至最低.
  - 对部分可靠交付:
    - 设置适当的重传次数和超时间隔.
    - 正确的设置取决于消息大小, 应用数据类型, 端与端之间的延迟.

## References

- [WebRTC Guide](https://hpbn.co/webrtc)
- [WebRTC Security List](https://dzone.com/articles/webrtc-security-vulnerabilities-you-should-know-ab)
