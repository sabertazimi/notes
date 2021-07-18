# Awesome Notes

```bash
                                   _
  _      _____  ___  ___  _ __ ___   ___   _ __   ___ | |_ ___  ___
   \ /\ / / _ \/ __|/ _ \| '_ ` _ \ / _ \ | '_ \ / _ \| __/ _ \/ __|
  \ V  V /  __/\__ \ (_) | | | | | |  __/ | | | | (_) | ||  __/\__ \
   \_/\_/ \___||___/\___/|_| |_| |_|\___| |_| |_|\___/ \__\___||___/
```

[![Author](https://img.shields.io/badge/author-sabertaz-lightgrey?style=for-the-badge)](https://github.com/sabertazimi)
[![LICENSE](https://img.shields.io/github/license/sabertazimi/awesome-notes?style=for-the-badge)](https://raw.githubusercontent.com/sabertazimi/awesome-notes/master/LICENSE)

[![Code Lines](https://img.shields.io/tokei/lines/github/sabertazimi/awesome-notes?style=for-the-badge&logo=visualstudiocode)](https://github.com/sabertazimi/awesome-notes)
[![Continuous Integration](https://img.shields.io/github/workflow/status/sabertazimi/awesome-notes/Continuous%20Integration/master?style=for-the-badge&logo=github)](https://github.com/sabertazimi/awesome-notes/actions/workflows/ci.yml)

Personal Learning Notes - **Awesome Notes** for Myself

> [GitHub Version](https://sabertazimi.github.io/awesome-notes)
built on `GitBook.IO` v1.
> [GitBook Version](https://notes.tazimi.dev)
built on `GitBook.IO` v2.

## Sample

### C

Implement Generic Variable with Pointer

```c
void *lsearch(
  void *key,
  void *base,
  int n,
  int elemSize,
  int (*cmpFn)(void *, void *)
) {
    for (int i = 0;i < n;i++) {
        void * elemAddr = (char *)base + i * elemSize;
        if (cmpFn(key, elemAddr) == 0) {
            return elemAddr;
        }
    }

    return NULL;
}
```

### Git

#### Commit Message

```md
firstLine - <type>(<scope>): <subject>
  (emptyLine)
<body>
  (emptyLine)
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
APP.namespace('APP.utilities.array');

//形参: 导入全局变量
APP.utilities.array = (function (app, global) {
// start of var declare

// 依赖模式
var utilObj = APP.utilities.object,
    utilLang = APP.utilities.lang,
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

}(APP, this));
```

## License

MIT License Copyright (c) [sabertazimi](https://github.com/sabertazimi)

## Contact

[![Email](https://img.shields.io/badge/-Gmail-ea4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sabertazimi@gmail.com)
[![Twitter](https://img.shields.io/badge/-Twitter-1da1f2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/sabertazimi)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sabertazimi)
