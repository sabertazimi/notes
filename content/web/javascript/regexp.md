---
sidebar_position: 26
tags: [Web, JavaScript, ECMAScript, RegExp]
---

# Regular Expression

```ts
const re = /pattern/gi
```

## Flags

[Flags](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags):

- `g` (global): 全局匹配.
- `i` (ignoreCase): 大小写不敏感匹配.
- `m` (multiline): 多行匹配.
- `y` (sticky): 粘附模式, 修饰符号隐含了头部匹配的标志.
- `u` (unicode): Unicode 模式.
- `s` (dotAll): Allows `.` to match `newline` characters.

```ts
function codePointLength(text) {
  const result = text.match(/[\s\S]/gu)
  return result ? result.length : 0
}

const s = '𠮷𠮷'
const length = s.length // 4
codePointLength(s) // 2
```

## Character Classes

[Character classes](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes):

| Characters            | Meaning               |
| :-------------------- | :-------------------- |
| `.`                   | `[^\n\r\u2020\u2029]` |
| `\d`                  | `[0-9]`               |
| `\D`                  | `[^0-9]`              |
| `\w`                  | `[0-9a-zA-Z_]`        |
| `\W`                  | `[^0-9a-zA-Z_]`       |
| `\s`                  | `[\r\n\f\t\v]`        |
| `\S`                  | `[^\r\n\f\t\v]`       |
| `\b`                  | start/end of word     |
| `\B`                  | not start/end of word |
| `\p{UnicodeProperty}` | match unicode         |
| `\P{UnicodeProperty}` | not match unicode     |
| `^`                   | start of string       |
| `$`                   | end of string         |

## Quantifiers

[Quantifiers](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers):

| Quantifiers | Repeat Times |
| :---------- | :----------- |
| `*`         | 0+           |
| `+`         | 1+           |
| `?`         | 0 ~ 1        |
| `{n}`       | n            |
| `{n,}`      | n+           |
| `{n,m}`     | n ~ m        |

| Lazy Quantifiers | Repeat Times (As **Less** As Possible) |
| :--------------- | :------------------------------------- |
| `*?`             | 0+                                     |
| `+?`             | 1+                                     |
| `??`             | 0 ~ 1                                  |
| `{n,}?`          | n+                                     |
| `{n,m}?`         | n ~ m                                  |

## Group and Ranges

- [Groups](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges).
- 零宽断言: lookahead [assertion](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions).

| 分类     | 代码/语法      | 说明                                            |
| :------- | :------------- | :---------------------------------------------- |
| 捕获     | `(exp)`        | 匹配 exp,并捕获文本到自动命名的组里             |
|          | `(?<name>exp)` | 匹配 exp,并捕获文本到名称为 name 的组里         |
|          | `(?:exp)`      | 匹配 exp,不捕获匹配的文本, 也不给此分组分配组号 |
| 零宽断言 | `(?<=exp)`     | 匹配左侧是 exp 的位置                           |
|          | `(?<!exp)`     | 匹配左侧不是 exp 的位置                         |
|          | `(?=exp)`      | 匹配右侧是 exp 的位置                           |
|          | `(?!exp)`      | 匹配右侧不是 exp 的位置                         |
| 注释     | `(?#comment)`  | 用于提供注释让人阅读                            |

- `(?<=\d)th` -> `9th`.
- `(?<!\d)th` -> `health`.
- `six(?=\d)` -> `six6`.
- `hi(?!\d)` -> `high`.

```ts
const string = 'Favorite GitHub Repos: tc39/ecma262 v8/v8.dev'
const regex = /\b(?<owner>[a-z0-9]+)\/(?<repo>[a-z0-9.]+)\b/g

for (const match of string.matchAll(regex)) {
  console.log(`${match[0]} at ${match.index} with '${match.input}'`)
  console.log(`owner: ${match.groups.owner}`)
  console.log(`repo: ${match.groups.repo}`)
}
```

## Back Reference

- `$1 $2 $3`: 第 n 个子表达式匹配的结果字符.
- 位置编号 (左括号的顺序): `\1 \2 \3`: 第 n 个子表达式匹配的结果字符.
- Named capture group back reference: `\k<Name>`.
- 反向引用可以解决正则表达式回溯失控的问题 (ReDoS).

```ts
const regExp = /((<\/?\w+>.*)\2)/g
```

```ts
const text = 'ooo111ooo222ooo333ooo123'
const regExp = /(\d)\1\1/g
const result = text.match(regExp)
console.log(result) // [111, 222, 333]
```

:::danger[RegExp Static Property]

Most `RegExp.XXX`/`RegExp.$X` static property aren't standard.
Avoid use them in production:

- `RegExp.input ($_)`.
- `RegExp.lastMatch ($&)`.
- `RegExp.lastParen ($+)`.
- `RegExp.leftContext`.
- `RegExp.rightContext ($')`.
- `RegExp.$1-$9`.

:::

## APIs

RegExp [functions](https://exploringjs.com/impatient-js/ch_regexps.html#methods-for-working-with-regular-expressions):

- String:
  - `split`.
  - `match`.
  - `search`.
  - `replace`.
- RegExp:
  - `test`.
  - `exec`.

### Test

```ts
;/[a-z|0-9]/i.test(str)
```

```ts
const ignoreList = [
  // # All
  '^npm-debug\\.log$', // Error log for npm
  '^\\..*\\.swp$', // Swap file for vim state

  // # macOS
  '^\\.DS_Store$', // Stores custom folder attributes
  '^\\.AppleDouble$', // Stores additional file resources
  '^\\.LSOverride$', // Contains the absolute path to the app to be used
  '^Icon\\r$', // Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
  '^\\._.*', // Thumbnail
  '^\\.Spotlight-V100(?:$|\\/)', // Directory that might appear on external disk
  '\\.Trashes', // File that might appear on external disk
  '^__MACOSX$', // Resource fork

  // # Linux
  '~$', // Backup file

  // # Windows
  '^Thumbs\\.db$', // Image file cache
  '^ehthumbs\\.db$', // Folder config file
  '^Desktop\\.ini$', // Stores custom folder attributes
  '@eaDir$', // "hidden" folder where the server stores thumbnails
]

export const junkRegex = new RegExp(ignoreList.join('|'))

export function isJunk(filename) {
  return junkRegex.test(filename)
}
```

### Exec

[`exec()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec):

- Search starts at substring specified by `lastIndex` property.

```ts
const input = 'A string with 3 numbers in it... 42 and 88.'
const number = /\b\d+\b/g

for (
  let match = number.exec(input);
  match !== null;
  match = number.exec(input)
)
  console.log('Found', match[0], 'at', match.index)

// Found 3 at 14
// Found 42 at 33
// Found 88 at 40
```

### Replace

```ts
str.replace(regExp, str / func)
```

第二个参数若为函数式参数, `replace` 方法会向它传递一系列参数:

- 第一个参数: 匹配结果字符串.
- 第 n 个参数: 子表达式匹配结果字符串.
- 倒数第二个参数: 匹配文本在源字符串中的下标位置.
- 最后一个参数: 源字符串自身.

```ts
function upper(all, letter) {
  return letter.toUpperCase()
}

assert(
  'border-bottom-width'.replace(/-(\w)/g, upper) === 'borderBottomWidth',
  'Camel cased a hyphenated string.'
)
```

```ts
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
console.log('1999-12-31'.replace(RE_DATE, '$<month>/$<day>/$<year>'))
// 12/31/1999

const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
console.log(
  '1999-12-31'.replace(
    RE_DATE,
    (g0, y, m, d, offset, input, { year, month, day }) =>
      `${month}/${day}/${year}`
  )
)
// 12/31/1999
```

:::tip[Replace Performance]

- 使用 2 个子表达式修剪字符串, 字符串总长度影响性能.
- 使用循环修剪字符串 (分别用 正/负循环 修剪 首/尾空白符), 空白字符长度影响性能.

```ts
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '')
  }
}
```

```ts
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    const str = this.replace(/^\s+/, '')
    let end = str.length - 1
    const ws = /\s/

    while (ws.test(str.charAt(end)))
      end--

    return str.slice(0, end + 1)
  }
}
```

:::

## Patterns

- `/abc/`: Characters sequence.
- `/[abc]/`: Characters set.
- `/[^abc]/`: Non characters set.
- `/[0-9]/`: Characters range.
- `/x+/`: 1+ (Greedy).
- `/x+?/`: 1+ (Lazy).
- `/x*/`: 0+.
- `/x?/`: 0/1.
- `/x{2,4}/`: 2 ~ 4.
- `/(abc)/`: Captured group.
- `/a|b|c/`: Or patterns.
- `/\d/`: Digit character.
- `/\w/`: Alphanumeric character ("word character").
- `/\s/`: Whitespace character.
- `/./`: Character except `newlines`.
- `/\b/`: Word boundary.
- `/^/`: Start of input.
- `/$/`: End of input.
- `非X捕获组` + `特征字符` + `非Y捕获组`:

```ts
// URLSearchParams [key, value]
const pattern = /([^&=]+)=([^&]*)/g
```

### Alphabets

`/^[\u4e00-\u9fa5a-zA-Z]+$/i`

### Numbers

`/^[1-9]*$/i`

### Whitespace

`/[(^\s+)(\s+$)]/g`

### Markdown Table

`/(?<=\|\w+) /g`: second place to insert `|`.

## Best Practices

- 不使用 new RegExp(),使用正则表达式字面量
- 将正则表达式赋值给变量, 防止正则表达式重复创建
- 以简单(唯一性)字元开始, 如 `^/$ x \u363A [a-z] \b`, 避免以分组表达式开始:
  e.g. `\s\s*` 优于 `\s{1,}`.
- 减少表达式的重叠匹配.
- 减少分支表达式,并将最常用的分支放在最前面.
- 无需反向引用时, 使用非捕获组:
  e.g. `(?:...)` 优于 `(...)`.
