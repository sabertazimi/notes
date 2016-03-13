# Nodejs Basic Notes

## Npm Set Up

### Basic Steps

```shell
$ npm adduser
$ mkdir proj/
$ npm init --scope=<username>  // 修改 package.json 可再次运行此命令

$ npm install --save <modulename>     // 修改 package.json 可再次运行此命令(不接模块名为自动更新)
$ npm prune                    // 清除无用包
$ npm rm --save  // --save 删除文件的同时更新 package.json 文件

$ npm ls
$ npm outdated   // 去除过期包
```

### Test Steps

```json
// in package.json
"scripts": {
    "test": "node test.js"
},
```

```shell
$ npm test
```

### Publish Steps

```shell
$ npm publish
$ npm dist-tag add @<pkg>@<version> [<tag>]
$ npm dist-tag rm <pkg> <tag>
$ npm dist-tag ls [<pkg>]

```

## Basic Node Modules

### Process Object

```js
process.pid：当前进程的进程号。
process.version：Node的版本，比如v0.10.18。
process.platform：当前系统平台，比如Linux。
process.title：默认值为“node”，可以自定义该值。
process.argv：当前进程的命令行参数数组。
process.env：指向当前shell的环境变量，比如process.env.HOME。
process.execPath：运行当前进程的可执行文件的绝对路径。
process.stdout：指向标准输出。
process.stdin：指向标准输入。
process.stderr：指向标准错误。
```

### File Module

#### fs API

```js
var fs = require('fs');
var buf = fs.readFileSync('/path/to/file', [charSet]);
fs.readFile('/path/to/file', [charSet], function callback(err, dataBuf) {});
fs.readdir('/path/to/file', function callback(err, fileNameArr) {});
```

#### Buffer Object

```js
var str = buf.toString();
```

#### Path API

```js
var path = require('path');

console.log(path.extname("index.html"));   // .html

path.normalize(p)
path.join([path1], [path2], [...])
path.resolve([from ...], to)
path.relative(from, to)
path.dirname(p)
path.basename(p, [ext])
path.extname(p)
path.sep
path.delimiter
```

## Self-Defined Modules

### Export Modules

```js
module.exports = function (args) { /* ... */ }
```
