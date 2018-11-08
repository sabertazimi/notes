# Awesome Notes

```bash
                                   _
  _      _____  ___  ___  _ __ ___   ___   _ __   ___ | |_ ___  ___
   \ /\ / / _ \/ __|/ _ \| '_ ` _ \ / _ \ | '_ \ / _ \| __/ _ \/ __|
  \ V  V /  __/\__ \ (_) | | | | | |  __/ | | | | (_) | ||  __/\__ \
   \_/\_/ \___||___/\___/|_| |_| |_|\___| |_| |_|\___/ \__\___||___/
```

[![Author](https://img.shields.io/badge/author-sabertazimi-lightgrey.svg)](https://github.com/sabertazimi)
[![Stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)](https://github.com/sabertazimi/Awesome-Notes)
[![MIT](https://img.shields.io/badge/license-mit-brightgreen.svg)](https://raw.githubusercontent.com/sabertazimi/Awesome-Notes/master/LICENSE)
![Progress](http://progressed.io/bar/24?title=learning)
[![Build Status](https://travis-ci.org/sabertazimi/awesome-notes.svg?branch=master)](https://travis-ci.org/sabertazimi/awesome-notes)

Personal Learning Notes - **Awesome Notes** for Myself

## Sample

### C

Implement Generic Variable with Pointer

```c
void *lsearch(
  void *key,
  void *base,
  int n,
  int elemSize,
  int (*cmpfn)(void *, void *)
) {
    for (int i = 0;i < n;i++) {
        void * elemAddr = (char *)base + i * elemSize;
        if (cmpfn(key, elemAddr) == 0) {
            return elemAddr;
        }
    }

    return NULL;
}
```

### Git

#### Commit Message

```html
firstline - <type>(<scope>): <subject>
  (emptyline)
<body>
  (emptyline)
<footer>
```

#### Pretty Logger

```bash
git log -p --stat --graph --pretty=format:"%h - %an, %ar : %s" --since=2.weeks path_name
```

### JavaScript

#### Type Check

```js
function typeOf(o) {
    var _toString = Object.prototype.toString,
        _type = {
            'undefined': 'undefined',
            'number': 'number',
            'boolean': 'boolean',
            'string': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regexp',
            '[object Error]': 'error'
        };

        return _type[typeof o] || _type[_toString.call(o)] || (o ? 'object' : 'null');
}
```

#### ES5 Module Best Practice

It's time to embrace ES Next/Harmony.

```js
// 命名空间模式
MYAPP.namespace('MYAPP.utilities.array');

//形参: 导入全局变量
MYAPP.utilities.array = (function (app, global) {
// start of var declare

// 依赖模式
var uobj = MYAPP.utilities.object,
    ulang = MYAPP.utilities.lang,
// 私有属性
    arrStr = "[object Array]",
    toStr = Object.prototype.toString;
// 私有方法
    inArray = function (haystack, needle) {
        for (var i = 0, max = haystack.length; i < max; i += 1) {
            if (haystack[i] === needle) {
                return i;
            }
        }
        return −1;
    },
    isArray = function (a) {
        return toStr.call(a) === arrayString;
    };

// end of var declare

// 初始化模式
初始化代码,只执行一次

// 揭示公共接口
return {
    isArray: isArray,
    indexOf: inArray
};

}(MYAPP, this));
```

## TODO List

- [ ] Daily Issues

## License

MIT License Copyright (c) 2017 [sabertazimi](https://github.com/sabertazimi)

## Contact

- [![Email](https://img.shields.io/badge/mailto-sabertazimi-brightgreen.svg?style=flat-square)](mailto:sabertazimi@gmail.com)
- [![GitHub](https://img.shields.io/badge/contact-github-000000.svg?style=flat-square)](https://github.com/sabertazimi)
- [![Twitter](https://img.shields.io/badge/contact-twitter-blue.svg?style=flat-square)](https://twitter.com/sabertazimi)
