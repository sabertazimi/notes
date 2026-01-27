---
sidebar_position: 8
tags: [Web, Node.js, Filesystem, File, Stream, Path, I/O]
---

# Filesystem

## File

- fs.createReadStream.
- fs.opendir.
- fs.readdir.
- fs.readFile.
- fs.readFileSync.
- fs.exists.

```ts
const fs = require('node:fs')

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, { encoding: 'utf8' }, (err, contents) => {
      if (err) {
        reject(err)
        return
      }

      resolve(contents)
    })
  })
}

readFile('example.txt')
  .then((contents) => {
    console.log(contents)
  })
  .catch((err) => {
    console.error(err.message)
  })
```

```ts
import { promises as fs } from 'node:fs'
import { basename, dirname, join } from 'node:path'

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = join(dir, d.name)

    if (d.isDirectory())
      yield* walk(entry)
    else if (d.isFile())
      yield entry
  }
}

async function run(arg = '.') {
  if ((await fs.lstat(arg)).isFile())
    return runTestFile(arg)

  for await (const file of walk(arg)) {
    if (
      !dirname(file).includes('node_modules')
      && (basename(file) === 'test.js' || file.endsWith('.test.js'))
    ) {
      console.log(file)
      await runTestFile(file)
    }
  }
}
```

```ts
import fs from 'node:fs/promises'
import path from 'node:path'

async function traverse(directory) {
  const files = await fs.readdir(directory)

  files.forEach(async (file) => {
    const filePath = path.join(directory, file)
    const fileStat = await fs.stat(filePath)

    if (fileStat.isFile()) {
      const content = await fs.readFile(filePath, 'utf-8')
      console.log(content)
    } else if (fileStat.isDirectory()) {
      await traverse(filePath)
    }
  })
}
```

```ts
module.exports = function ls(dirName, fileType, callback) {
  const fs = require('node:fs')
  const path = require('node:path')

  fs.readdir(dirName, (err, list) => {
    if (err)
      return callback(err)

    list = list.filter((file) => {
      return path.extname(file) === `.${fileType}`
    })

    callback(null, list)
  })
}
```

## Buffer

```ts
const str = buf.toString()
```

## Path

- path.resolve: 自动按系统处理路径
- path.extname: 返回文件类型

```ts
const path = require('node:path')

console.log(path.extname('index.html')) // .html

path.normalize(p)
path.join([path1], [path2], [pathN])
path.resolve(from, to)
path.relative(from, to)
path.dirname(p)
path.basename(p, [ext])
path.extname(p)
const separator = path.sep
const delimiter = path.delimiter
```

## Stream

```ts
import { createReadStream, createWriteStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

// Create transform streams with clean, focused logic
const upperCaseTransform = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
})

// Process files with robust error handling
async function processFile(inputFile, outputFile) {
  try {
    await pipeline(
      createReadStream(inputFile),
      upperCaseTransform,
      createWriteStream(outputFile)
    )
    console.log('File processed successfully')
  } catch (error) {
    console.error('Pipeline failed:', error)
    throw error
  }
}
```

```ts
// Create a Web Stream (compatible with browsers)
const webReadable = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello ')
    controller.enqueue('World!')
    controller.close()
  }
})

// Convert between Web Streams and Node.js streams
const nodeStream = Readable.fromWeb(webReadable)
const backToWeb = Readable.toWeb(nodeStream)
```

## EventEmitter

```ts
import { EventEmitter, once } from 'node:events'

class DataProcessor extends EventEmitter {
  async* processStream() {
    for (let i = 0; i < 10; i++) {
      this.emit('data', `chunk-${i}`)
      yield `processed-${i}`
      // Simulate async processing time
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    this.emit('end')
  }
}

// Consume events as an async iterator
const processor = new DataProcessor()
for await (const result of processor.processStream()) {
  console.log('Processed:', result)
}
```

## References

- Files read and write complete modern [guide](https://nodejsdesignpatterns.com/blog/reading-writing-files-nodejs).
