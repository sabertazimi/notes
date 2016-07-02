# Awesome Notes

[![Author](https://img.shields.io/badge/author-sabertazimi-lightgrey.svg)](https://github.com/sabertazimi)
[![Stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)](https://github.com/sabertazimi/Awesome-Notes)
[![MIT](https://img.shields.io/badge/license-mit-brightgreen.svg)](https://raw.githubusercontent.com/sabertazimi/Awesome-Notes/master/LICENSE)
![Progress](http://progressed.io/bar/24?title=learning)

Personal Learning Notes - **Awesome Notes** for Myself

## Directories

- [Algorithms](https://github.com/sabertazimi/Awesome-Notes/tree/master/algorithms)
  - [LeetCode](https://github.com/sabertazimi/Awesome-Notes/tree/master/algorithms/LeetCode-OJ)
- [Android](https://github.com/sabertazimi/Awesome-Notes/tree/master/android)
- [Assembly](https://github.com/sabertazimi/Awesome-Notes/tree/master/assembly)
- [C](https://github.com/sabertazimi/Awesome-Notes/tree/master/c)
- [Code Guide](https://github.com/sabertazimi/Awesome-Notes/tree/master/codeGuide)
- [Computer Science](https://github.com/sabertazimi/Awesome-Notes/tree/master/computerScience)
- [DataBase](https://github.com/sabertazimi/Awesome-Notes/tree/master/dataBase)
- [Git](https://github.com/sabertazimi/Awesome-Notes/tree/master/git)
- [Haskell](https://github.com/sabertazimi/Awesome-Notes/tree/master/haskell)
- [Java](https://github.com/sabertazimi/Awesome-Notes/tree/master/java)
- [Linux](https://github.com/sabertazimi/Awesome-Notes/tree/master/linux)
  - [Set Up](https://github.com/sabertazimi/Awesome-Notes/tree/master/linux/setUp)
  - [Vim](https://github.com/sabertazimi/Awesome-Notes/tree/master/linux/vim)
- [Matlab](https://github.com/sabertazimi/Awesome-Notes/tree/master/matlab)
- [Nodejs](https://github.com/sabertazimi/Awesome-Notes/tree/master/nodejs)
- [Python](https://github.com/sabertazimi/Awesome-Notes/tree/master/python)
- [SoftwareTesting](https://github.com/sabertazimi/Awesome-Notes/tree/master/softwareTesting)
- [Web](https://github.com/sabertazimi/Awesome-Notes/tree/master/web)
  - [HTML](https://github.com/sabertazimi/Awesome-Notes/tree/master/Web/HTML)
  - [CSS](https://github.com/sabertazimi/Awesome-Notes/tree/master/Web/CSS)
  - [JavaScript](https://github.com/sabertazimi/Awesome-Notes/tree/master/Web/JavaScript)
  - [Frameworks](https://github.com/sabertazimi/Awesome-Notes/tree/master/Web/Frameworks)

## Sample

### C

Implement Generic Variable with Pointer

```c
void *lsearch(void *key, void *base, int n, int elemSize, int (*cmpfn)(void *, void *)) {
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
$ git log -p --stat --graph --pretty=format:"%h - %an, %ar : %s" --since=2.weeks path_name
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

#### Module Best Practice

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

- [ ] Daily Issue

## License

MIT License Copyright (c) 2016 [sabertazimi](https://github.com/sabertazimi)

## Contact

E-mail: sabertazimi@gmail.com
