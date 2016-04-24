<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Nodejs Basic Notes](#nodejs-basic-notes)
	- [Npm Set Up](#npm-set-up)
		- [Basic Steps](#basic-steps)
		- [Test Steps](#test-steps)
		- [Publish Steps](#publish-steps)
		- [Tab Completion](#tab-completion)
	- [Basic Node Modules](#basic-node-modules)
		- [Process Object](#process-object)
	- [File Module](#file-module)
		- [fs API](#fs-api)
		- [Buffer Object](#buffer-object)
		- [Path API](#path-api)
	- [Self-Defined Modules](#self-defined-modules)
		- [Export Modules](#export-modules)
	- [Http Module](#http-module)
		- [Resquest Object](#resquest-object)
			- [属性](#属性)
		- [Response Object](#response-object)
			- [类型](#类型)
			- [事件](#事件)
			- [方法](#方法)
		- [Http Get](#http-get)
		- [Http Server](#http-server)
	- [Net Module](#net-module)
		- [Socket Object](#socket-object)
		- [Basic Methods](#basic-methods)
	- [URL Module](#url-module)
		- [Basic Method](#basic-method)
	- [Async](#async)
	- [Awesome Package](#awesome-package)
		- [Http](#http)
		- [Stream](#stream)
		- [Format](#format)

<!-- /TOC -->

# Nodejs Basic Notes

-   Main                        ./index.js, ./server.js, or ./yourentryfile.js in the root
-   Supporting files in         ./lib/
-   Static HTTP files in        ./public/
-   Views or templates in       ./views/
-   Command-line executables in ./bin/
-   Tests in                    ./test/ (or ./spec/ if you’re a Jasmine cool-aid drinker)
-   npm scripts in              ./scripts/
-   Config in                   ./config/
-   Documentation in            ./doc/
-   Examples in                 ./examples/
-   Performance analysis in     ./benchmarks/
-   Native C/C++ source in      ./source/

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

### Tab Completion

```shell
npm completion >> ~/.bashrc (or ~/.zshrc)
source ~/.zshrc
```

## Basic Node Modules

> exports和module.exports的区别

exports 是 module.exports 的引用, 改变 exports 值无法改变 module.exports 值

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

## File Module

### fs API

-   fs.createReadStream
-   fs.readdir
-   fs.readFile
-   fs.readFileSync
-   fs.exsits

```js
var fs = require('fs');
var buf = fs.readFileSync('/path/to/file', [charSet]);
fs.readFile('/path/to/file', [charSet], function callback(err, dataBuf) {});
fs.readdir('/path/to/file', function callback(err, fileNameArr) {});

fs.createReadStream();

src.pipe(dst1).pipe(dst2).pipe(dst3);  //  连接多个 stream
```

### Buffer Object

```js
var str = buf.toString();
```

### Path API

-   path.resolve: 自动按系统处理路径
-   path.extname: 返回文件类型

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

编写具有回调函数参数的模块

-   定义模块

```js
function foo(x, y, callback) {
    try {
        if (param not valid ) {
            throw new Error（）;
        } else {
            callback(null, param);
        }
    } catch (error) {
        callback(error, param);
    }
}
```

-   使用模块

```js
foo(a, b, function (err, param) {
    if(err) {

    } else {

    }
})；
```

### Export Modules

```js
module.exports = function (args) { /* ... */ }
```

## Http Module

### Resquest Object

#### 属性

```js
request.method  // POST GET
```

### Response Object

#### 类型

```c
typedef Stream response
```

#### 事件

-   监听事件

```js
response.on('data', function (data) {});
response.on('error', function (error) {});
response.on('end', function () {
    // 结束阶段
    stream.end();
});
```

-   发出事件

```js
response.end();  //  传输结束
```

#### 方法

```js
response.setEncoding('utf8');  // 自动将 data 事件中 Buffer 对象转换成 String

//  content-type: text/plain
//                application/json
response.writeHead(200, { 'Content-Type': ''});
```

### Http Get

```js
http.get(url, function callback(response) { });
```

```js
http.get(url, function (response) {
    var pipeData = '';

    response.setEncoding('utf8');
    response.on('data', function (data) {
        pipeData += data;
    });
    response.on('end', function () {
        console.log(pipeData.length);
        console.log(pipeData);
    });
});
```

### Http Server

```js
var server = http.createServer(function (request, response) {
    // 处理请求的逻辑...
});
server.listen(8000);
```

## Net Module

### Socket Object

```js
socket.write(data);
socket.end(data);
socket.end();
```

### Basic Methods

```js
var serverInstance = net.createServer(function callback (socket) {});

serverInstance.listen(portNumber);   // 开始监听特定端口
```

## URL Module

### Basic Method

```js
url.parse(request.url, true);
```

## Security Module

### crypto

-   hash/hmac/cipher/decipher algorithms
-   validate
-   signature

## Async

对回调进行计数是处理 Node 中异步的基础 - 自定义 Semaphore 变量: 每完成一个异步处理, Semaphore++

## Awesome Package

-   Mout Like  Underscore/Lo-Dash, stuff that should probably be included in JavaScript
-   Express    Web-application framework
-   Q          Promises
-   Qconf      Application config
-   Credential Safe password hashing
-   Hogan      Mustache for Express
-   Superagent Communicate with APIs
-   Socket.io  Realtime communications (WebSocket)
-   Async      Asynchronous functional utilities
-   Bunyan     Logging
-   Tape       Testing
-   Cuid       Better than GUID/UUID for web applications

### Http

-   bl
-   concat-stream
-   async

### Stream

-   through2-map

### Format

-   [Moment.js Awesome Library](https://github.com/moment/moment)
-   strftime

### Server

-   [Parse Server](https://github.com/ParsePlatform/parse-server)

```shell
$ npm install -g parse-server mongodb-runner
$ mongodb-runner start
$ parse-server --appId APPLICATION_ID --masterKey MASTER_KEY
```
-   [JSON Server](https://github.com/typicode/json-server)

```shell
$ npm install -g json-server
```

### Storage

#### Cookie/Session

-   npm install -S cookie-parser
-   npm install -S express-session

#### DataBase

-   npm install mongoose -S
-   [npm install mongojs -S](https://github.com/mafintosh/mongojs)
-   [npm install indexeddbshim](https://github.com/axemclion/IndexedDBShim)

#### Security

##### Encrypt(加密)

-   npm install --save passport-local-mongoose passport-local passport

### Parser

#### XML

-   node-xml

#### JSON

-   npm install --save normalizr`

### MD5

-   [npm install blueimp-md5](https://github.com/blueimp/JavaScript-MD5)

### Base64

-   [npm install base64](https://github.com/dankogai/js-base64)

### Package

-   [npm-shrinkwrap](https://github.com/uber/npm-shrinkwrap)

### Minimalize

-   [`npm install --save purify-css`](https://github.com/purifycss/purifycss)

### Test

-   [npm install testem -g](https://github.com/testem/testem)
-   [Multi-Version Nodejs](https://github.com/victorbjelkholm/autochecker)

### Log

-   [npm install log4js](https://github.com/nomiddlename/log4js-node)
-   `npm install -S morgan`
-   [npm install -S stacktrace-js](https://github.com/stacktracejs/stacktrace.js)

### Search

-   [Full Text Search Engine](https://github.com/olivernn/lunr.js)

```js
var logger = require('morgan');
app.use(logger('combined, {stream: accessLogStream}));
```

### Linter

-   [npm install standard -g](https://github.com/feross/standard)

```json
"standard": {
  "ignore": [
    "**/out/",
    "/lib/select2/",
    "/lib/ckeditor/",
    "tmp.js"
  ]
}

"scripts": {
    "test": "standard --verbose && node my-tests.js"
}
```

### Template Engine

-   `npm install -S hbs` - express plugin for handlebars

### Boilerplate

-   [Basic - HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate)
-   [Font-End - React Redux Universal Hot Example](https://github.com/erikras/react-redux-universal-hot-example)
-   [Font-End - React Starter Kit](https://github.com/kriasoft/react-starter-kit)
-   [Back-End - Nodejs Hackathon Starter](https://github.com/sahat/hackathon-starter)
-   [Full Stack - Google Web Start Kit](https://github.com/google/web-starter-kit)
-   [Plugins - jQuery Boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate)
-   [Desktop - Electron React Boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
-   [Mobile - React Native Boilerplate](https://github.com/bartonhammond/snowflake)

#### Other

-   [npm install antd-init -g](https://github.com/ant-design/antd-init)

```shell
antd-init
npm run dev
npm run build
```
-   [npm install tooling -g](https://github.com/egoist/tooling)

### Fonts

-   [npm install --save fontmin](https://github.com/ecomfe/fontmin)
-   [npm install fonts.css --save](https://github.com/zenozeng/fonts.css)

### Images

-   https://github.com/svg/svgo
-   https://github.com/kevva/to-ico
-   [A fast DVI to SVG converter](https://github.com/mgieseki/dvisvgm)


### Other

-   prompt
-   trigonometry

## Spider

-   async.js
-   cheerio: dom
-   iconv-lite: 转码库

-   http请求获取页面
-   正则表达式匹配信息
-   数据持久化数据库
-   数据可视化
