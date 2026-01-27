---
sidebar_position: 18
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Pub-Sub

- 发布-订阅模式是借助第三方来实现调度, 发布者和订阅者之间互不感知.
- 观察者模式中主体和观察者是互相感知.
- 符合开放封闭原则.
- 存在依赖追踪困难可能, 导致调试困难.

:::tip[Pub-Sub Use Case]

- Event listener and handler.
- Event Bus in Vue.
- Event Emitter in Node.
- 异步编程.

:::

```ts
class PubSub {
  constructor() {
    // Broadcast channel
    this.topics = {}
    // Topic identifier
    this.subUid = -1
  }

  publish(topic, args) {
    if (!this.topics[topic])
      return false

    const subscribers = this.topics[topic]
    let len = subscribers ? subscribers.length : 0

    while (len--) subscribers[len].func(topic, args)

    return this
  }

  subscribe(topic, func) {
    if (!this.topics[topic])
      this.topics[topic] = []

    const token = (++this.subUid).toString()
    this.topics[topic].push({
      token,
      func,
    })
    return token
  }

  unsubscribe(token) {
    for (const m in this.topics) {
      if (this.topics[m]) {
        for (let i = 0, j = this.topics[m].length; i < j; i++) {
          if (this.topics[m][i].token === token) {
            this.topics[m].splice(i, 1)
            return token
          }
        }
      }
    }

    return this
  }
}

const pubsub = new PubSub()
const token = pubsub.subscribe('/addFavorite', (topic, args) => {
  console.log('test', topic, args)
})
pubsub.publish('/addFavorite', ['test'])
pubsub.unsubscribe(token)
```

`jQuery` event system:

```ts
// Equivalent to subscribe(topicName, callback)
$(document).on('topicName', () => {
  // ..perform some behavior
})

// Equivalent to publish(topicName)
$(document).trigger('topicName')

// Equivalent to unsubscribe(topicName)
$(document).off('topicName')
```

Event emitter:

```ts
class MicroEvent {
  bind(event, callback) {
    this._events = this._events || {}
    this._events[event] = this._events[event] || []
    this._events[event].push(callback)
  }

  unbind(event, callback) {
    this._events = this._events || {}

    if (event in this._events === false)
      return

    this._events[event].splice(this._events[event].indexOf(callback), 1)
  }

  trigger(event, ...args) {
    this._events = this._events || {}

    if (event in this._events === false)
      return

    for (let i = 0; i < this._events[event].length; i++)
      this._events[event][i].apply(this, args)
  }
}
```

`AJAX` callback:

- 当请求返回, 并且实际的数据可用的时候, 会生成一个通知.
- 如何使用这些事件（或者返回的数据）, 都是由订阅者自己决定的.
- 可以有多个不同的订阅者, 以不同的方式使用返回的数据.
- `AJAX` 层: 唯一的责任 - 请求和返回数据, 接着将数据发送给所有想要使用数据的地方.

```ts
;(function ($) {
  // Pre-compile template and "cache" it using closure
  const resultTemplate = _.template($('#resultTemplate').html())

  // Subscribe to the new search tags topic
  $.subscribe('/search/tags', (tags) => {
    $('#searchResults').html(`Searched for: ${tags}`)
  })

  // Subscribe to the new results topic
  $.subscribe('/search/resultSet', (results) => {
    $('#searchResults').append(resultTemplate(results))
  })

  // Submit a search query and publish tags on the /search/tags topic
  $('#flickrSearch').submit(function (e) {
    e.preventDefault()
    const tags = $(this).find('#query').val()

    if (!tags)
      return

    $.publish('/search/tags', [$.trim(tags)])
  })

  // Subscribe to new tags being published and perform
  // a search query using them. Once data has returned
  // publish this data for the rest of the application
  // to consume

  $.subscribe('/search/tags', (tags) => {
    // Ajax Request
    $.getJSON(
      'http://api.flickr.com/services/feeds/',
      {
        tags,
        tagMode: 'any',
        format: 'json',
      },

      (data) => {
        if (!data.items.length)
          return

        $.publish('/search/resultSet', data.items)
      }
    )
  })
})()
```
