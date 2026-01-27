---
sidebar_position: 56
tags: [Web, JavaScript, ECMAScript, Storage]
---

# Storage

- Cookie for session state.
- DOM storage for Web Component state.
- Web Storage for simple UI options (dark mode, sidebar size, etc.).
- IndexedDB for large binary objects and data dumps.
- Cache API for offline and quick file access.
- JavaScript variables for everything else.

## Cookie

- `name=value`..
- `expires=expiration_time`.
- `path=domain_path`.
- `domain=domain_name`.
- `secure`.

```bash
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.foo.com
Other-header: other-header-value
```

```bash
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; domain=.foo.com; path=/; secure
Other-header: other-header-value
```

```ts
class CookieUtil {
  static get(name) {
    const cookieName = `${encodeURIComponent(name)}=`
    const cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = null

    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart)

      if (cookieEnd === -1)
        cookieEnd = document.cookie.length

      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      )
    }

    return cookieValue
  }

  static set(name, value, { expires, path, domain, secure }) {
    let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (expires instanceof Date)
      cookieText += `; expires=${expires.toGMTString()}`

    if (path)
      cookieText += `; path=${path}`

    if (domain)
      cookieText += `; domain=${domain}`

    if (secure)
      cookieText += '; secure'

    document.cookie = cookieText
  }

  static unset(name, { path, domain, secure }) {
    CookieUtil.set(name, '', new Date(0), path, domain, secure)
  }
}
```

## Local Storage

- 协同 Cookie.
- 对于复杂对象的读取与存储,
  需要借助 `JSON.parse` 与 `JSON.stringify`.
- [`Storage` object](https://developer.mozilla.org/docs/Web/API/Storage):
  - `Storage.length`.
  - `Storage.key()`.
  - `Storage.getItem()`.
  - `Storage.setItem()`.
  - `Storage.removeItem()`.
  - `Storage.clear()`.
- `storage` event: 每当 `Storage` 对象发生变化时, 都会在文档上触发 `storage` 事件.
  - `event.domain`: 存储变化对应的域.
  - `event.key`: 被设置或删除的键.
  - `event.newValue`: 键被设置的新值, 若键被删除则为 null.
  - `event.oldValue`: 键变化之前的值.

```ts
if (!localStorage.getItem('bgColor'))
  populateStorage()
else
  setStyles()

function populateStorage() {
  localStorage.setItem('bgColor', document.getElementById('bgColor').value)
  localStorage.setItem('font', document.getElementById('font').value)
  localStorage.setItem('image', document.getElementById('image').value)

  setStyles()
}

function setStyles() {
  const currentColor = localStorage.getItem('bgColor')
  const currentFont = localStorage.getItem('font')
  const currentImage = localStorage.getItem('image')

  document.getElementById('bgColor').value = currentColor
  document.getElementById('font').value = currentFont
  document.getElementById('image').value = currentImage

  htmlElem.style.backgroundColor = `#${currentColor}`
  pElem.style.fontFamily = currentFont
  imgElem.setAttribute('src', currentImage)
}
```

## IndexDB

```ts
class IndexedDB {
  constructor(dbName, dbVersion, dbUpgrade) {
    return new Promise((resolve, reject) => {
      this.db = null

      if (!('indexedDB' in window))
        reject(new Error('Not supported'))

      const dbOpen = indexedDB.open(dbName, dbVersion)

      if (dbUpgrade) {
        dbOpen.onupgradeneeded = (e) => {
          dbUpgrade(dbOpen.result, e.oldVersion, e.newVersion)
        }
      }

      dbOpen.onsuccess = () => {
        this.db = dbOpen.result
        resolve(this)
      }

      dbOpen.onerror = (e) => {
        reject(new Error(`IndexedDB error: ${e.target.errorCode}`))
      }
    })
  }

  get(storeName, name) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(name)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  set(storeName, name, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)

      store.put(value, name)

      transaction.oncomplete = () => {
        resolve(true)
      }

      transaction.onerror = () => {
        reject(transaction.error)
      }
    })
  }
}

export class State {
  static dbName = 'stateDB'
  static dbVersion = 1
  static storeName = 'state'
  static DB = null
  static target = new EventTarget()

  constructor(observed, updateCallback) {
    this.updateCallback = updateCallback
    this.observed = new Set(observed)

    // subscribe `set` event with `updateCallback`
    State.target.addEventListener('set', (e) => {
      if (this.updateCallback && this.observed.has(e.detail.name))
        this.updateCallback(e.detail.name, e.detail.value)
    })
  }

  async dbConnect() {
    State.DB
      = State.DB
        || (await new IndexedDB(
          State.dbName,
          State.dbVersion,
          (db, oldVersion, newVersion) => {
          // upgrade database
            switch (oldVersion) {
              case 0: {
                db.createObjectStore(State.storeName)
                break
              }
              default:
                throw new Error('Unsupported version!')
            }
          }
        ))

    return State.DB
  }

  async get(name) {
    this.observedSet.add(name)
    const db = await this.dbConnect()
    return await db.get(State.storeName, name)
  }

  async set(name, value) {
    this.observed.add(name)
    const db = await this.dbConnect()
    await db.set(State.storeName, name, value)

    // publish event to subscriber
    const event = new CustomEvent('set', { detail: { name, value } })
    State.target.dispatchEvent(event)
  }
}
```

```ts
const store = db.transaction('users').objectStore('users')
const index = store.createIndex('username', 'username', { unique: true })
const range = IDBKeyRange.bound('007', 'ace')

const request = store.openCursor(range, 'next')
const request = index.openCursor(range, 'next')

request.onsuccess = function (event) {
  const cursor = event.target.result

  if (cursor) {
    // 永远要检查
    console.log(`Key: ${cursor.key}, Value: ${JSON.stringify(cursor.value)}`)
    cursor.continue() // 移动到下一条记录
  } else {
    console.log('Done!')
  }
}
```

## File

```ts
function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsText(file)
  })
}

function readFileBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsArrayBuffer(file)
  })
}

const fileInput = document.querySelector('fileInput')

for (const file of fileInput.files) {
  const text = await readFileText(file)
  const buffer = await readFileBuffer(file)
}
```
