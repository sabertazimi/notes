---
sidebar_position: 50
tags: [Web, JavaScript, ECMAScript, Network, Fetch]
---

# Fetch

- GET: read resources.
- POST: create resources.
- PUT: fully update resources.
- PATCH: partially update resources.
- DELETE: delete resources.

```ts
const response = await fetch('/api/names', {
  headers: {
    Accept: 'application/json',
  },
})

const response = await fetch('/api/names', {
  method: 'POST',
  body: JSON.stringify(object),
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## JSON

JSON (JavaScript Object Notation) methods:

```ts
const obj = JSON.parse(json)
const json = JSON.stringify(obj)
```

[`JSON.stringify(value, filter, space)`](https://exploringjs.com/impatient-js/ch_json.html#json-replacers-revivers):

- `Symbol`/`function`/`NaN`/`Infinity`/`undefined`: `null`/ignored.
- `BitInt`: throw `TypeError`.
- Circular reference object: throw `TypeError`.
- `toJSON` method:

```ts
const obj = {
  name: 'zc',
  toJSON() {
    return 'return toJSON'
  },
}

// return toJSON
console.log(JSON.stringify(obj))

// "2022-03-06T08:24:56.138Z"
JSON.stringify(new Date())
```

## Form Data

```ts
const imageFormData = new FormData()
const imageInput = document.querySelector('input[type="file"][multiple]')
const imageFiles = imageInput.files

for (const file of imageFiles)
  imageFormData.append('image', file)

fetch('/img-upload', {
  method: 'POST',
  body: imageFormData,
})
```

## Abort Controller

```ts
const abortController = new AbortController()

fetch('wikipedia.zip', { signal: abortController.signal }).catch(() =>
  console.log('Aborted!')
)

// 10 毫秒后中断请求
setTimeout(() => abortController.abort(), 10)
```

## APIs

[`Headers` object](https://developer.mozilla.org/docs/Web/API/Headers):

```ts
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'text/xml')
myHeaders.get('Content-Type') // should return 'text/xml'
```

[`Request` object](https://developer.mozilla.org/docs/Web/API/Request):

```ts
const request = new Request('/api/names', {
  method: 'POST',
  body: JSON.stringify(object),
  headers: {
    'Content-Type': 'application/json',
  },
})

const response = await fetch(request)
```

[`Response` object](https://developer.mozilla.org/docs/Web/API/Response):

```ts
fetch('//foo.com').then(console.log)
// Response {
//   body: (...)
//   bodyUsed: false
//   headers: Headers {}
//   ok: true
//   redirected: false
//   status: 200
//   statusText: "OK"
//   type: "basic"
//   url: "https://foo.com/"
// }

fetch('//foo.com/redirect-me').then(console.log)
// Response {
//   body: (...)
//   bodyUsed: false
//   headers: Headers {}
//   ok: true
//   redirected: true
//   status: 200
//   statusText: "OK"
//   type: "basic"
//   url: "https://foo.com/redirected-url/"
// }

fetch('//foo.com/does-not-exist').then(console.log)
// Response {
//   body: (...)
//   bodyUsed: false
//   headers: Headers {}
//   ok: false
//   redirected: true
//   status: 404
//   statusText: "Not Found"
//   type: "basic"
//   url: "https://foo.com/does-not-exist/"
// }

fetch('//foo.com/throws-error').then(console.log)
// Response {
//   body: (...)
//   bodyUsed: false
//   headers: Headers {}
//   ok: false
//   redirected: true
//   status: 500
//   statusText: "Internal Server Error"
//   type: "basic"
//   url: "https://foo.com/throws-error/"
// }
```

## Streaming

`Request`/`Response` `body` (`ReadableStream`) methods:

- `text()`.
- `json()`.
- `formData()`.
- `arrayBuffer()`.
- `blob()`.
- `bodyUsed`: 布尔值, 表示 `ReadableStream` 是否已摄受 (`disturbed`).

```ts
fetch('https://fetch.spec.whatwg.org/')
  .then(response => response.body)
  .then((body) => {
    const reader = body.getReader()

    function processNextChunk({ value, done }) {
      if (done)
        return

      console.log(value)
      return reader.read().then(processNextChunk)
    }

    return reader.read().then(processNextChunk)
  })
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// ...

fetch('https://fetch.spec.whatwg.org/')
  .then(response => response.body)
  .then(async (body) => {
    const reader = body.getReader()

    while (true) {
      const { value, done } = await reader.read()

      if (done)
        break

      console.log(value)
    }
  })
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// ...
```

```ts
fetch('https://fetch.spec.whatwg.org/')
  .then(response => response.body)
  .then(async (body) => {
    const reader = body.getReader()
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          next() {
            return reader.read()
          },
        }
      },
    }

    for await (const chunk of asyncIterable)
      console.log(chunk)
  })
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// ...
```

```ts
async function* streamGenerator(stream) {
  const reader = stream.getReader()

  try {
    while (true) {
      const { value, done } = await reader.read()

      if (done)
        break

      yield value
    }
  } finally {
    reader.releaseLock()
  }
}

const decoder = new TextDecoder()

fetch('https://fetch.spec.whatwg.org/')
  .then(response => response.body)
  .then(async (body) => {
    for await (const chunk of streamGenerator(body))
      console.log(decoder.decode(chunk, { stream: true }))
  })
// <!doctype html><html lang="en"> ...
// whether a <a data-link-type="dfn" href="#concept-header" ...
// result to <var>rangeValue</var>. ...
// ...
```

```ts
fetch('https://fetch.spec.whatwg.org/')
  .then(response => response.body)
  .then((body) => {
    const reader = body.getReader()
    // 创建第二个流
    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { value, done } = await reader.read()

            if (done)
              break

            // 将主体流的块推到第二个流
            controller.enqueue(value)
          }
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })
  })
  .then(secondaryStream => new Response(secondaryStream))
  .then(response => response.text())
  .then(console.log)
// <!doctype html><html lang="en"><head><meta charset="utf-8"> ...
```

## Axios

- `client.request(config)`.
- `client.get(url[, config])`.
- `client.delete(url[, config])`.
- `client.head(url[, config])`.
- `client.options(url[, config])`.
- `client.post(url[, data[, config]])`.
- `client.put(url[, data[, config]])`.
- `client.patch(url[, data[, config]])`.
- `client.getUri([config])`.

```ts
const client = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
})

// Add a request interceptor
client.interceptors.request.use(
  (config) => {
    // Do something before request is sent.
    return config
  },
  (error) => {
    // Do something with request error.
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx trigger this function.
    // Do something with response data.
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx trigger this function.
    // Do something with response error.
    return Promise.reject(error)
  }
)
```

## AJAX

```ts
const XHR = (function () {
  const standard = {
    createXHR() {
      return new XMLHttpRequest()
    },
  }
  const newActionXObject = {
    createXHR() {
      return new ActionXObject('Msxml12.XMLHTTP')
    },
  }
  const oldActionXObject = {
    createXHR() {
      return new ActionXObject('Microsoft.XMLHTTP')
    },
  }

  // 根据兼容性返回对应的工厂对象
  // 此立即函数运行一次即可完成兼容性检查, 防止重复检查
  if (standard.createXHR()) {
    return standard
  } else {
    try {
      newActionXObject.createXHR()
      return newActionXObject
    } catch (o) {
      oldActionXObject.createXHR()
      return oldActionXObject
    }
  }
})()

const request = XHR.createXHR()

// 3rd argument : async mode
request.open('GET', 'example.txt', true)

request.onreadystatechange = function () {
  // do something
  /*
  switch(request.readyState) {
    case 0: initialize
    case 1: loading
    case 2: loaded
    case 3: transaction
    case 4: complete
  }
  */
  if (request.readyState === 4) {
    const para = document.createElement('p')
    const txt = document.createTextNode(request.responseText)
    para.appendChild(txt)
    document.getElementById('new').appendChild(para)
  }
}

request.send(null)
```

```ts
ajax({
  url: './TestXHR.aspx', // 请求地址
  type: 'POST', // 请求方式
  data: { name: 'super', age: 20 }, // 请求参数
  dataType: 'json',
  success(response, xml) {
    // 此处放成功后执行的代码
  },
  fail(status) {
    // 此处放失败后执行的代码
  },
})

function ajax(options) {
  options = options || {}
  options.type = (options.type || 'GET').toUpperCase()
  options.dataType = options.dataType || 'json'
  const params = formatParams(options.data)
  let xhr

  // 创建 - 非IE6 - 第一步
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    // IE6及其以下版本浏览器
    xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }

  // 接收 - 第三步
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const status = xhr.status
      if (status >= 200 && status < 300)
        options.success && options.success(xhr.responseText, xhr.responseXML)
      else
        options.fail && options.fail(status)
    }
  }

  // 连接 和 发送 - 第二步
  if (options.type === 'GET') {
    xhr.open('GET', `${options.url}?${params}`, true)
    xhr.send(null)
  } else if (options.type === 'POST') {
    xhr.open('POST', options.url, true)
    // 设置表单提交时的内容类型
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(params)
  }
}

// 格式化参数
function formatParams(data) {
  const arr = []

  for (const name in data)
    arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`)

  arr.push(`v=${Math.random()}`.replace('.', ''))
  return arr.join('&')
}
```

```ts
function getJSON(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()

    request.open('GET', url)

    request.onload = function () {
      try {
        if (this.status === 200)
          resolve(JSON.parse(this.response))
        else
          reject(new Error(`${this.status} ${this.statusText}`))
      } catch (e) {
        reject(e.message)
      }
    }

    request.onerror = function () {
      reject(new Error(`${this.status} ${this.statusText}`))
    }

    request.send()
  })
}

getJSON('data/sample.json')
  .then((ninjas) => {
    assert(ninjas !== null, 'Get data')
  })
  .catch(e => handleError(`Error: ${e}`))
```

### Data Format

| Format                           | Size (bytes) | Download (ms) | Parse (ms) |
| :------------------------------- | -----------: | ------------: | ---------: |
| Verbose XML                      |      582,960 |         999.4 |      343.1 |
| Verbose JSON-P                   |      487,913 |         598.2 |        0.0 |
| Simple XML                       |      437,960 |         475.1 |       83.1 |
| Verbose JSON                     |      487,895 |         527.7 |       26.7 |
| Simple JSON                      |      392,895 |         498.7 |       29.0 |
| Simple JSON-P                    |      392,913 |         454.0 |        3.1 |
| Array JSON                       |      292,895 |         305.4 |       18.6 |
| Array JSON-P                     |      292,912 |         316.0 |        3.4 |
| Custom Format (script insertion) |      222,912 |          66.3 |       11.7 |
| Custom Format (XHR)              |      222,892 |          63.1 |       14.5 |

### Cross Origin Request

```html
<!-- HTML -->
<meta http-equiv="Access-Control-Allow-Origin" content="*" />
```

```ts
Response.Headers.Add('Access-Control-Allow-Origin', '*')
```

```ts
$.ajax({
  url: 'http://map.oicqzone.com/gpsApi.php?lat=22.502412986242&lng=113.93832783228',
  type: 'GET',
  dataType: 'JSONP', // 处理 AJAX 跨域问题.
  success(data) {
    $('body').append(`Name: ${data}`)
  },
})
```

## RESTful

- Client/Server architecture.
- Stateless.
- Cacheable.
- Layer system.
- Code via need.
- Isomorphic interface.
- Design [reference](https://github.com/aisuhua/restful-api-design-references).

## Server-Sent Events

- Event source [API](https://developer.mozilla.org/docs/Web/API/EventSource).
- Server-sent events [API](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events).

```ts
const source = new EventSource('/path/to/stream-url')

source.onopen = function () {}

source.onerror = function () {}

source.addEventListener('foo', (event) => {
  processFoo(event.data)
})

source.addEventListener('ping', (event) => {
  processPing(JSON.parse(event.data).time)
})

source.onmessage = function (event) {
  log(event.id, event.data)
  if (event.id === 'CLOSE')
    source.close()
}
```
