---
sidebar_position: 1
tags: [Programming, Android, Toolchain]
---

# Toolchain

## Dalvik virtual machine

1. register-based machine
   基于寄存器(不写入内存)
2. minimizing instruction dispatch and memory accesses
   最小化指令分配和内存访问
3. giving more efficient instruction stream(a lot more semantic content)
   提供更加高效的指令流

## Building Blocks

1. Activity(Managed by activity stack)
2. Service(Running in the background;with no UI)
3. Broadcast Receiver(Can invoke(调用) activity;with no UI)
4. Content Provider(accessing and managing application data)

## Android Studio

### Code generator

- Constructor
- getter/setter
- ViewHolder
- Parcelable Implementation
- GsonFormat : 根据 JSONObject 生成相应类

## API Conventions

### Manager Service

- PreferenceManager.getDefaultSharedPreferences
- LocalBroadcastManager.getInstance
