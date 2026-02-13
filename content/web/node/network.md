---
sidebar_position: 9
tags: [Web, Node.js, Network, Fetch, HTTP, Socket, DNS, URL]
---

# Network

## Fetch

```ts
async function fetchData(url) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000) // Built-in timeout support
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Request timed out')
    }
    throw error
  }
}
```

```ts
// Cancel long-running operations cleanly
const controller = new AbortController()

// Set up automatic cancellation
setTimeout(() => controller.abort(), 10000)

try {
  const data = await fetch('https://slow-api.com/data', {
    signal: controller.signal
  })
  console.log('Data received:', data)
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled - this is expected behavior')
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## Http

### Request

```ts
const request = {
  method: 'POST',
}
```

### Response

```cpp
typedef Stream response
```

监听事件:

```ts
response.on('data', (data) => {
  process(data)
})
response.on('error', (err) => {
  console.error(err)
})
response.on('end', () => {
  stream.end()
})
```

发出事件:

```ts
response.end() //  传输结束
```

```ts
response.setEncoding('utf8') // 自动将 data 事件中 Buffer 对象转换成 String

//  content-type: text/plain
//                application/json
response.writeHead(200, { 'Content-Type': '' })
```

### Get

```ts
http.get(url, (response) => {})
```

```ts
http.get(url, (response) => {
  let pipeData = ''

  response.setEncoding('utf8')
  response.on('data', (data) => {
    pipeData += data
  })
  response.on('end', () => {
    console.log(pipeData.length)
    console.log(pipeData)
  })
})
```

### Server

```ts
const server = http.createServer((request, response) => {
  // 处理请求的逻辑...
})
server.listen(8000)
```

```ts
const net = require('node:net')

const chatServer = net.createServer()
// 用于检测僵尸客户端,用于及时清除僵尸客户端
const clientList = []

chatServer.on('connection', (client) => {
  client.name = `${client.remoteAddress}:${client.remotePort}`
  client.write(`Hi ${client.name}!\n`)
  clientList.push(client)

  client.on('data', (data) => {
    broadcast(data, client)
  })
  client.on('end', () => {
    clientList.splice(clientList.indexOf(client), 1)
  })
  client.on('error', (e) => {
    console.log(e)
  })
})

function broadcast(message, client) {
  const cleanup = []

  for (let i = 0; i < clientList.length; i += 1) {
    // 向其他人(排除自身)发送消息
    if (client !== clientList[i]) {
      if (clientList[i].writable) {
        clientList[i].write(`${client.name} says ${message}`)
      } else {
        cleanup.push(clientList[i])
        clientList[i].destroy()
      }
    }
  }

  // 清除僵尸客户端
  for (let i = 0; i < cleanup.length; i += 1)
    clientList.splice(clientList.indexOf(cleanup[i]), 1)
}

chatServer.listen(9000)
```

## Socket

```ts
socket.write(data)
socket.end(data)
socket.end()
```

```ts
const fs = require('node:fs')
const http = require('node:http')
const io = require('socket.io')

const sockFile = fs.readFileSync('socket.html')

server = http.createServer()
server.on('request', (req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  res.end(sockFile)
})
server.listen(8080)

const socket = io.listen(server)

// 命名空间
socket.of('/upAndRunning').on('connection', (client) => {
  console.log('Client connected to Up and Running namespace.')
  client.send('Welcome to \'Up and Running\'')
})
socket.of('/weather').on('connection', (client) => {
  console.log('Client connected to Weather namespace.')
  client.send('Welcome to \'Weather Updates\'')
})
```

## DNS

- `dns.resolve`
- `dns.reverse`
- `dns.lookup`

```ts
const dns = require('node:dns')

dns.lookup('google.com', 4, (e, a) => {
  console.log(a)
})

dns.resolve('tazimi.tk', 'A', (e, r) => {
  if (e)
    console.log(e)

  console.log(JSON.stringify(r, null, 2))
})
```

```ts
const dns = require('node:dns')

dns.resolve('tazimi.dev', 'A', (err, res) => {
  if (err)
    console.log(err)
  else
    console.log(`A: ${JSON.stringify(res, null, 2)}`)
})

dns.resolve('github.com', 'MX', (err, res) => {
  if (err)
    console.log(err)
  else
    console.log(`MX: ${JSON.stringify(res, null, 2)}`)
})
```

## URL

解析处 URL 各个组成部分:

- `href`
- `protocol`
- `host`
- `auth`
- `hostname`
- `port`
- `pathname`
- `search`
- `query`
- `hash`

```ts
// true 表示调用 queryString 模块查询字符串
url.parse(request.url, true)
```

## References

- HTTP request definitive [guide](https://nodejsdesignpatterns.com/blog/nodejs-http-request).
