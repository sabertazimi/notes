---
sidebar_position: 5
tags: [Programming, Vim]
---

# Command Mode

底行模式:

```bash
> :h ex-cmd-index
```

**黑魔法**列表:

- `:normal` 将 Ex 命令与 Normal 指令结合在一起的**黑魔法**
- `:args` 文件列表
- `:argdo {ExCommands}` 对存于文件列表的所有文件执行 Ex 命令
- `:global` 对 patterns 执行 EX 命令

| 命令                                            | 作用                        |
| :---------------------------------------------- | :-------------------------- |
| `:edit/:write`                                  | 读写文件                    |
| `:tabnew`                                       | 创建新标签页                |
| `:split`                                        | 分割窗口                    |
| `:prev/:next`                                   | 前/后标签页                 |
| `:bprev/:bnext`                                 | 前/后缓冲区列表             |
| `:copy`                                         | 命令对快速复制一行非常好用  |
| `:[range]delete [x]`                            | 删除范围内的行到寄存器 x 中 |
| `:[range]yank [x]`                              | 复制范围的行到寄存器 x 中   |
| `:[line]put [x]`                                | 在行后粘贴寄存器 x 中的内容 |
| `:[range]copy/t/co{address}`                    | 行拷贝到 `{address}` 行之下 |
| `:[range]move/m {address}`                      | 行移动到 `{address}` 行之下 |
| `:[range]join`                                  | 连接指定范围内的行          |
| `:[range]normal {commands}`                     | 每一行执行命令 `{commands}` |
| `:[range]substitute/{pattern}/{string}/[flags]` | `{pattern}` 替换 `{string}` |
| `:[range]global/{pattern}/[cmd]`                | 对指定范围内匹配            |
| `:shell`                                        | 打开内置 shell              |
| `:!{commands}`                                  | 执行外部命令                |
| `:args {argList}`                               | 文件列表                    |
| `:argdo {ExCommands}`                           | 对文件列表中的文件执行命令  |
| `:grep`                                         |                             |
| `:vimgrep`                                      |                             |
| `:make`                                         |                             |

```vim
cnoremap <expr> %% getcmdtype( ) == ':' ? expand('%:h').'/' : '%%'
```

## 补全

### 自动

`<C-d>`.

### 粘贴

`<C-r><C-w>`: 将光标所在单词粘贴至命令行.

### 历史记录

`q/` 或 `q`: 弹出历史记录窗口.

## Range

- `{start}, {end}`.
- number 表示行号, `.`表示当前行, `$`表示最后一行, `%`表示所有行.
- `/start_pattern/,/end_pattern/`

| 符号 | 地址                         |
| :--- | :--------------------------- |
| `1`  | 文件的第一行                 |
| `$`  | 文件的最后一行               |
| `0`  | 虚拟行, 位于文件第一行上方   |
| `.`  | 光标所在行                   |
| `'m` | 包含位置标记 m 的行          |
| `'<` | 高亮选区的起始行             |
| `'>` | 高亮选区的结束行             |
| `%`  | 整个文件 (`:1,$` 的简写形式) |

- `1`: 第 1 行.
- `%`: 所有行.
- `2,$`: 第 2 行 - 最后一行.
- `/<html>/,/<\/html>/`: 标签 html 所有行.

## Undo and Redo

- `<C-o>`: 撤销命令.
- `@`: 重复命令.

## Shell

| 命令                   | 作用                                               |
| :--------------------- | :------------------------------------------------- |
| `:shell`               | 启动一个 shell (输入 `exit` 返回 Vim)              |
| `:!{cmd}`              | 在 shell 中执行 `{cmd}`                            |
| `:read !{cmd}`         | 在 shell 中执行 `{cmd}`, 将标准输出插入到光标下方  |
| `:[range]write !{cmd}` | 在 shell 中执行 `{cmd}`, 以 `[range]` 为其标准输入 |
| `:[range]!{filter}`    | 使用外部程序 `{filter}` 过滤指定的 `[range]`       |

## Replace

- Abolish.vim: 超级 substitute 命令.
- `:[range]s[substitute]/{pattern}/{string}/[flags]`

### 原字符

| 原字符      | 作用                               |
| :---------- | :--------------------------------- |
| `\c`        | 忽略大小写                         |
| `\C`        | 大小写敏感                         |
| `\v`        | 开启 very magic 模式(可省略转义符) |
| `<` 与 `>`  | `\v` 模式下的单词定界符            |
| `%(` 与 `)` | 分组符                             |
| `\V`        | 开启原义模式(可省略转义符)         |
| `\w`        | 匹配单词类字符(alpha,number,`_`)   |
| `\W`        | 匹配非单词字符                     |
| `\x`        | 匹配十六进制数 `[0-9a-fA-F]`       |
| `\s`        | 匹配空白符/换行符                  |
| `\zs`       | 界定一个匹配的开始                 |
| `\ze`       | 界定一个匹配的结束                 |

### Flags

置于 patterns 末尾:

| Flags | 作用                                                      |
| :---- | :-------------------------------------------------------- |
| `/g`  | 全局                                                      |
| `/e`  | 光标至匹配词末尾                                          |
| `/c`  | 确认或拒绝每一处修改                                      |
| `/n`  | 会抑制正常的替换行为,只报告本次 substitute 命令匹配的个数 |
| `/e`  | 屏蔽错误提示                                              |
| `/&`  | 重复上次 flags                                            |

| /c 后选项 | 作用                              |
| :-------- | :-------------------------------- |
| y         | 替换此处匹配                      |
| n         | 忽略此处匹配                      |
| q         | 退出替换过程                      |
| l         | “last” —— 替换此处匹配后退出      |
| a         | “all” —— 替换此处与之后所有的匹配 |
| `<C-e>`   | 向上滚动屏幕                      |
| `<C-y>`   | 向下滚动屏幕                      |

### 特殊字符

| 符号             | 作用                                                      |
| :--------------- | :-------------------------------------------------------- |
| `\r`             | 插入一个换行符                                            |
| `\t`             | 插入一个制表符                                            |
| `\\`             | 插入一个反斜杠                                            |
| `\1`             | 插入第 1 个子匹配                                         |
| `\2`             | 插入第 2 个子匹配(以此类推,最多到`\9`)                    |
| `\0`             | 插入匹配模式的所有内容                                    |
| `&`              | 插入匹配模式的所有内容                                    |
| `~`              | 使用上一次调用 `:substitute` 时的 `{string}`              |
| `\={Vim script}` | 执行 `{Vim Script}` 表达式, 将返回结果作为替换 `{string}` |

## Global

- `:[range] global[!] /{pattern}/[ExCommands]`.
- `:g/{start}/ .,{finish} [cmd]`.

> ':g/re/d' 删除所有的匹配行
> ':v/re/d' 只保留匹配行
> 追加存储 TODO 项至 a 寄存器
> `:g/TODO/yank A` > `:reg a`

## Documentation

`:help`:

- `:help ^n`: `<C-n>` docs in normal mode.
- `:help i_^n`: `<C-n>` docs in insert mode.
- `:help c_^n`: `<C-n>` docs in commandLine mode.
- `:helpgrep command`: search docs includes `command`.
