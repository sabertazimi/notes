---
sidebar_position: 10
tags: [Programming, Android, Broadcast]
---

# Broadcast

- Normal broadcasts : asynchronous
- Ordered broadcasts : synchronous

```java
intent intent = new Intent("com.example.broadcastTest.MY_BROADCAST");
sendBroadcast(intent);
```

## Register Receiver

In Activity

```java
//Custom BroadcastReceiver,Override onReceive methods
//intentFilter : action
//前为响应后的行为，后为响应何种广播
registerReceiver(networkChangeReceiver, intentFilter);

//in onDestroy
unregisterReceiver();
```

In AndroidManifest,xml

```html
<!-- custom receiver class -->
<receiver android:name=".MyBroadcastReceiver">
  <!-- receiver priority -->
  <intent-filter android:priority="100">
    <!-- custom broadcast -->
    <action android:name="com.example.broadcastTest.MY_BROADCAST" />
  </intent-filter>
</receiver>
```

## Ordered

```java
intent intent = new Intent("com.example.broadcastTest.MY_BROADCAST");
sendOrderedBroadcast(intent, null);
```

## Local

```java
// 获取实例
localBroadcastManager = LocalBroadcastManager.getInstance(this);
```

```java
localBroadcastManager.sendBroadcast(intent); // 发送本地广播
```

### Local Receiver

```java
localBroadcastManager.registerReceiver(CustomReceiver, intentFilter);
localBroadcastManager.unregisterReceiver(CustomReceiver);
```
