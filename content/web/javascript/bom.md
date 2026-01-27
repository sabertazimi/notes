---
sidebar_position: 31
tags: [Web, JavaScript, ECMAScript, DOM, BOM]
---

# BOM

## Window

```ts
const selfWindow = window.self
const topWindow = window.top
const parentWindow = window.parent
const grandParentWindow = window.parent.parent
```

```ts
if (confirm('Are you sure?'))
  alert('I\'m so glad you\'re sure!')
else
  alert('I\'m sorry to hear you\'re not sure.')

const result = prompt('What is your name? ', 'James')
if (result !== null)
  alert(`Welcome, ${result}`)

// 显示打印对话框
window.print()

// 显示查找对话框
window.find()

// 显式打印机
window.print()
```

弹窗有非常多的安全限制:

- 禁止隐藏状态栏与地址栏.
- 弹窗默认不能移动或缩放.
- 只允许用户操作下 (鼠标/键盘) 创建弹窗.
- 屏蔽弹窗.

```ts
const newWin = window.open(
  'https://www.new.com/',
  'newWindow',
  'height=400,width=400,top=10,left=10,resizable=yes'
)
newWin.resizeTo(500, 500)
newWin.moveTo(100, 100)
alert(newWin.opener === window) // true
newWin.close()
alert(newWin.closed) // true

let blocked = false
try {
  const newWin = window.open('https://www.new.com/', '_blank')
  if (newWin === null)
    blocked = true
} catch (ex) {
  blocked = true
}
if (blocked)
  alert('The popup was blocked!')
```

## Location

| 属性     | 描述                                       |
| :------- | :----------------------------------------- |
| hash     | 设置或返回从井号 (#) 开始的 URL (锚)       |
| host     | 设置或返回主机名和当前 URL 的端口号        |
| hostname | 设置或返回当前 URL 的主机名                |
| href     | 设置或返回完整的 URL                       |
| pathname | 设置或返回当前 URL 的路径部分              |
| port     | 设置或返回当前 URL 的端口号                |
| protocol | 设置或返回当前 URL 的协议                  |
| search   | 设置或返回从问号 (?) 开始的 URL (查询部分) |
| username | 设置或返回域名前指定的用户名               |
| password | 设置或返回域名前指定的密码                 |
| origin   | 返回 URL 的源地址                          |

```ts
function getQueryStringArgs(location) {
  // 取得没有开头问号的查询字符串
  const qs = location.search.length > 0 ? location.search.substring(1) : ''
  // 保存数据的对象
  const args = {}

  // 把每个参数添加到 args 对象
  for (const item of qs.split('&').map(kv => kv.split('='))) {
    const name = decodeURIComponent(item[0])
    const value = decodeURIComponent(item[1])

    if (name.length)
      args[name] = value
  }

  return args
}
```

```ts
window.location.assign('https://www.new.com')
window.location = 'https://www.new.com'
window.location.href = 'https://www.new.com'
window.location.replace('https://www.new.com') // No new history
window.location.reload() // 重新加载, 可能是从缓存加载
window.location.reload(true) // 重新加载, 从服务器加载
```

```ts
window.addEventListener(
  'hashchange',
  (event) => {
    // event.oldURL
    // event.nweURL
    if (window.location.hash === '#someCoolFeature')
      someCoolFeature()
  },
  false
)
```

## Navigator

`navigator` 对象包含以下接口定义的属性和方法:

- NavigatorID.
- NavigatorLanguage.
- NavigatorOnLine.
- NavigatorContentUtils.
- NavigatorStorage.
- NavigatorStorageUtils.
- NavigatorConcurrentHardware.
- NavigatorPlugins.
- NavigatorUserMedia.

| Property/Method           |                                                   |
| ------------------------- | ------------------------------------------------- |
| battery                   | BatteryManager (Battery Status API)               |
| clipboard                 | Clipboard API                                     |
| connection                | NetworkInformation (Network Information API)      |
| cookieEnabled             | Boolean, 是否启用了 cookie                        |
| credentials               | CredentialsContainer (Credentials Management API) |
| deviceMemory              | 单位为 GB 的设备内存容量                          |
| doNotTrack                | 用户的`不跟踪` (`do-not-track`) 设置              |
| geolocation               | Geolocation (Geolocation API)                     |
| hardwareConcurrency       | 设备的处理器核心数量                              |
| language                  | 浏览器的主语言                                    |
| languages                 | 浏览器偏好的语言数组                              |
| locks                     | LockManager (Web Locks API)                       |
| mediaCapabilities         | MediaCapabilities (Media Capabilities API)        |
| mediaDevices              | 可用的媒体设备                                    |
| maxTouchPoints            | 设备触摸屏支持的最大触点数                        |
| onLine                    | Boolean, 表示浏览器是否联网                       |
| pdfViewerEnabled          | Boolean, 是否启用了 PDF 功能                      |
| permissions               | Permissions (Permissions API)                     |
| serviceWorker             | ServiceWorkerContainer                            |
| storage                   | StorageManager (Storage API)                      |
| userAgent                 | 浏览器的用户代理字符串 (**默认只读**)             |
| vendor                    | 浏览器的厂商名称                                  |
| webdriver                 | 浏览器当前是否被自动化程序控制                    |
| xr                        | XRSystem (WebXR Device API)                       |
| registerProtocolHandler() | 将一个网站注册为特定协议的处理程序                |
| sendBeacon()              | 异步传输一些小数据                                |
| share()                   | 当前平台的原生共享机制                            |
| vibrate()                 | 触发设备振动                                      |

### Online

```ts
const connectionStateChange = () => console.log(navigator.onLine)
window.addEventListener('online', connectionStateChange)
window.addEventListener('offline', connectionStateChange)
// 设备联网时:
// true
// 设备断网时:
// false
```

### Connection

```ts
const downlink = navigator.connection.downlink
const downlinkMax = navigator.connection.downlinkMax
const rtt = navigator.connection.rtt
const type = navigator.connection.type // wifi/bluetooth/cellular/ethernet/mixed/unknown/none.
const networkType = navigator.connection.effectiveType // 2G - 5G.
const saveData = navigator.connection.saveData // Boolean: Reduced data mode.

navigator.connection.addEventListener('change', changeHandler)
```

### Protocol

```ts
navigator.registerProtocolHandler(
  'mailto',
  'http://www.somemailclient.com?cmd=%s',
  'Some Mail Client'
)
```

### Battery

```ts
navigator.getBattery().then((battery) => {
  // 添加充电状态变化时的处理程序
  const chargingChangeHandler = () => console.log(battery.charging)
  battery.addEventListener('chargingchange', chargingChangeHandler)
  // 添加充电时间变化时的处理程序
  const chargingTimeChangeHandler = () => console.log(battery.chargingTime)
  battery.addEventListener('chargingtimechange', chargingTimeChangeHandler)
  // 添加放电时间变化时的处理程序
  const dischargingTimeChangeHandler = () =>
    console.log(battery.dischargingTime)
  battery.addEventListener(
    'dischargingtimechange',
    dischargingTimeChangeHandler
  )
  // 添加电量百分比变化时的处理程序
  const levelChangeHandler = () => console.log(battery.level * 100)
  battery.addEventListener('levelchange', levelChangeHandler)
})
```

### Storage

```ts
navigator.storage.estimate().then((estimate) => {
  console.log(((estimate.usage / estimate.quota) * 100).toFixed(2))
})
```

### Geolocation

```ts
if (window.navigator.geolocation) {
  // getCurrentPosition第三个参数为可选参数
  navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
    // 指示浏览器获取高精度的位置, 默认为false
    enableHighAccuracy: true,
    // 指定获取地理位置的超时时间, 默认不限时, 单位为毫秒
    timeout: 5000,
    // 最长有效期, 在重复获取地理位置时, 此参数指定多久再次获取位置.
    maximumAge: 3000,
  })
} else {
  alert('Your browser does not support Geolocation!')
}
```

locationError 为获取位置信息失败的回调函数, 可以根据错误类型提示信息:

```ts
function locationError(error) {
  switch (error.code) {
    case error.TIMEOUT:
      showError('A timeout occurred! Please try again!')
      break
    case error.POSITION_UNAVAILABLE:
      showError('We can\'t detect your location. Sorry!')
      break
    case error.PERMISSION_DENIED:
      showError('Please allow geolocation access for this to work.')
      break
    case error.UNKNOWN_ERROR:
      showError('An unknown error occurred!')
      break
    default:
      throw new Error('Unsupported error!')
  }
}
```

locationSuccess 为获取位置信息成功的回调函数,
返回的数据中包含经纬度等信息:

- `position.timestamp`.
- `position.coords`:
  - `latitude`: 维度.
  - `longitude`: 经度.
  - `accuracy`.
  - `altitude`: 海拔高度.
  - `altitudeAccuracy`.

结合 Google Map API 即可在地图中显示当前用户的位置信息:

```ts
function locationSuccess(position) {
  const coords = position.coords
  const latlng = new google.maps.LatLng(
    // 维度
    coords.latitude,
    // 精度
    coords.longitude
  )
  const myOptions = {
    // 地图放大倍数
    zoom: 12,
    // 地图中心设为指定坐标点
    center: latlng,
    // 地图类型
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }

  // 创建地图并输出到页面
  const myMap = new google.maps.Map(document.getElementById('map'), myOptions)

  // 创建标记
  const marker = new google.maps.Marker({
    // 标注指定的经纬度坐标点
    position: latlng,
    // 指定用于标注的地图
    map: myMap,
  })

  // 创建标注窗口
  const infoWindow = new google.maps.InfoWindow({
    content: `您在这里<br/>纬度: ${coords.latitude}<br/>经度: ${coords.longitude}`,
  })

  // 打开标注窗口
  infoWindow.open(myMap, marker)
}
```

```ts
navigator.geolocation.watchPosition(
  locationSuccess,
  locationError,
  positionOption
)
```

### User Agent

`navigator.userAgent` 特别复杂:

- 历史兼容问题: Netscape -> IE -> Firefox -> Safari -> Chrome -> Edge.
- 每一个新的浏览器厂商必须保证旧网站的检测脚本能正常识别自家浏览器,
  从而正常打开网页, 导致 `navigator.userAgent` 不断变长.
- User-Agent detection [parser](https://github.com/faisalman/ua-parser-js).

```ts
console.log(navigator.userAgent)
// 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)
// Chrome/101.0.4922.0 Safari/537.36 Edg/101.0.1198.0'
```

```ts
class BrowserDetector {
  constructor() {
    // 测试条件编译
    // IE6~10 支持

    this.isIE_Gte6Lte10 = /* @cc_on!@ */ false
    // 测试 documentMode
    // IE7~11 支持
    this.isIE_Gte7Lte11 = !!document.documentMode
    // 测试 StyleMedia 构造函数
    // Edge 20 及以上版本支持
    this.isEdge_Gte20 = !!window.StyleMedia
    // 测试 Firefox 专有扩展安装 API
    // 所有版本的 Firefox 都支持
    this.isFirefox_Gte1 = typeof InstallTrigger !== 'undefined'
    // 测试 chrome 对象及其 webstore 属性
    // Opera 的某些版本有 window.chrome, 但没有 window.chrome.webstore
    // 所有版本的 Chrome 都支持
    this.isChrome_Gte1 = !!window.chrome && !!window.chrome.webstore
    // Safari 早期版本会给构造函数的标签符追加 "Constructor"字样, 如:
    // window.Element.toString(); // [object ElementConstructor]
    // Safari 3~9.1 支持
    this.isSafari_Gte3Lte9_1 = /constructor/i.test(window.Element)
    // 推送通知 API 暴露在 window 对象上
    // 使用 IIFE 默认参数值以避免对 undefined 调用 toString()
    // Safari 7.1 及以上版本支持
    this.isSafari_Gte7_1 = (({ pushNotification = {} } = {}) =>
      pushNotification.toString() === '[object SafariRemoteNotification]')(
      window.safari
    )
    // 测试 addons 属性
    // Opera 20 及以上版本支持
    this.isOpera_Gte20 = !!window.opr && !!window.opr.addons
  }

  isIE() {
    return this.isIE_Gte6Lte10 || this.isIE_Gte7Lte11
  }

  isEdge() {
    return this.isEdge_Gte20 && !this.isIE()
  }

  isFirefox() {
    return this.isFirefox_Gte1
  }

  isChrome() {
    return this.isChrome_Gte1
  }

  isSafari() {
    return this.isSafari_Gte3Lte9_1 || this.isSafari_Gte7_1
  }

  isOpera() {
    return this.isOpera_Gte20
  }
}
```

:::caution[Feature Detection]

**不依赖 User-Agent 推断浏览器版本**, 容易推断错误,
建议使用 [feature detection](https://developer.mozilla.org/docs/Learn_web_development/Extensions/Testing/Feature_detection):

```ts
// 检测浏览器是否支持 Netscape 式的插件
const hasNSPlugins = !!(navigator.plugins && navigator.plugins.length)
// 检测浏览器是否具有 DOM Level 1 能力
const hasDOM1 = !!(
  document.getElementById
  && document.createElement
  && document.getElementsByTagName
)

// 特性检测
if (document.getElementById) {
  element = document.getElementById(id)
}
```

:::

Detect [Safari and iOS versions](https://evilmartians.com/chronicles/how-to-detect-safari-and-ios-versions-with-ease):

```ts
// Desktop Safari, all mobile WebKit browsers on iOS and webview iOS
function isWebkit() {
  return 'GestureEvent' in window
}

// All mobile webkit browsers and webview iOS
function isMobileWebKit() {
  return 'ongesturechange' in window
}

// Desktop Safari
function isDesktopWebKit() {
  return (
    typeof window !== 'undefined'
    && 'safari' in window
    && 'pushNotification' in window.safari
  )
}

// Use `CSS.supports` in Javascript or `@supports` in CSS to check if the feature is available.
const supportsManagedMediaSource = 'ManagedMediaSource' in window

// true on iOS 17.0+ (Safari 17.0+)
const isAtLeastIOS17 = CSS.supports('contain-intrinsic-size', '100px')

// Combine to isolate 17.0
function isOnlyIOS170() {
  return isAtLeastIOS17 && !supportsManagedMediaSource
}

if (isMobileWebKit()) {
  if (isOnlyIOS170()) {
    // Running iOS 17.0 exactly
  } else if (isAtLeastIOS17) {
    // Safe to use iOS 17+ features
  } else {
    // Fallback for older iOS versions
  }
}
```

## Screen

浏览器窗口外面的客户端显示器的信息:

| Property    |                                          |
| ----------- | ---------------------------------------- |
| availHeight | 屏幕像素高度减去系统组件高度 (只读)      |
| availWidth  | 屏幕像素宽度减去系统组件宽度 (只读)      |
| colorDepth  | 表示屏幕颜色的位数: 多数系统是 32 (只读) |
| height      | 屏幕像素高度                             |
| width       | 屏幕像素宽度                             |
| pixelDepth  | 屏幕的位深 (只读)                        |
| orientation | Screen Orientation API 中屏幕的朝向      |

```ts
const screen = window.screen

console.log(screen.colorDepth) // 24
console.log(screen.pixelDepth) // 24

// 垂直看
console.log(screen.orientation.type) // portrait-primary
console.log(screen.orientation.angle) // 0
// 向左转
console.log(screen.orientation.type) // landscape-primary
console.log(screen.orientation.angle) // 90
// 向右转
console.log(screen.orientation.type) // landscape-secondary
console.log(screen.orientation.angle) // 270
```

全屏 [API](https://developer.mozilla.org/docs/Web/API/Fullscreen_API):

```ts
function toggleFullscreen() {
  const elem = document.querySelector('video')

  if (document.fullscreenElement) {
    document
      .exitFullscreen()
      .then(() => console.log('Document Exited from Full screen mode'))
      .catch(err => console.error(err))
  } else {
    elem
      .requestFullscreen()
      .then(() => {})
      .catch((err) => {
        alert(
          `Error occurred while switch into fullscreen mode: ${err.message} (${err.name})`
        )
      })
  }
}

document.onclick = function (event) {
  if (document.fullscreenElement) {
    document
      .exitFullscreen()
      .then(() => console.log('Document Exited from Full screen mode'))
      .catch(err => console.error(err))
  } else {
    document.documentElement
      .requestFullscreen({ navigationUI: 'show' })
      .then(() => {})
      .catch((err) => {
        alert(
          `Error occurred while switch into fullscreen mode: ${err.message} (${err.name})`
        )
      })
  }
}
```

## History

### Navigation

```ts
const history = window.history

// 后退一页
history.go(-1)
// 前进一页
history.go(1)
// 前进两页
history.go(2)
// 导航到最近的 new.com 页面
history.go('new.com')
// 导航到最近的 example.net 页面
history.go('example.net')
// 后退一页
history.back()
// 前进一页
history.forward()

if (history.length === 1)
  console.log('这是用户窗口中的第一个页面')

if (history.scrollRestoration)
  history.scrollRestoration = 'manual'
```

### State

```ts
const history = window.history

const stateObject = { foo: 'bar' }
history.pushState(stateObject, 'My title', 'baz.html')

history.replaceState({ newFoo: 'newBar' }, 'New title') // No new history state.

window.addEventListener('popstate', (event) => {
  const state = event.state

  if (state) {
    // 第一个页面加载时状态是 null
    processState(state)
  }
})
```
