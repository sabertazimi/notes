---
sidebar_position: 12
tags: [Programming, Vim, Toolchain]
---

# Toolchain

## Configuration

Install [awesome `vimrc`](https://github.com/amix/vimrc):

```bash
git clone --depth=1 https://github.com/amix/vimrc ~/.vim_runtime
sh ~/.vim_runtime/install_awesome_vimrc.sh
```

Custom configuration (`~/.vim_runtime/my_configs.vim`):

```vim
:set number
:setlocal spell!

let g:copilot_filetypes = {
    \ 'gitcommit': v:true,
    \ 'markdown': v:true,
    \ 'toml': v:true,
    \ 'yaml': v:true
    \ }
```

## Color Scheme

Vim color scheme configuration:

- `:colorscheme {theme}` - 切换颜色主题
- `:AirlineTheme {theme}` - 切换 Airline 主题
- `:find` - 内置模糊文件搜索

```vim
set nocompatible
set number

syntax on
filetype plugin indent on

set shiftwidth=4
set softtabstop=4

set spell spelllang=en_us
scriptencoding utf-8

set mouse=a
set mousehide

set ignorecase
set smartcase

" :find filepath
" :tabnew filepath
" :tabp :tabn
" :b partOfFilepath
" :ls
set path+=**
set wildmenu
set wildmode=list:longest,full

" NERDtree like setup for netrw
let g:netrw_banner = 0
let g:netrw_liststyle = 3
let g:netrw_browse_split = 4
let g:netrw_altv = 1
let g:netrw_winsize = 25
" let g:netrw_list_hide=netrw_gitignore#Hide()
" let g:netrw_list_hide=',\(^\|\s\s\)\zs\.\S\+'
augroup ProjectDrawer
autocmd!
autocmd VimEnter * :Vexplore
augroup END

" ctags setup
command! MakeTags !ctags -R .

" colorschemes config
colorscheme Monokai

" airline config
" set laststatus=2
let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#left_sep = ' '
let g:airline#extensions#tabline#left_alt_sep = '|'

" CtrlP config
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'
let g:ctrlp_working_path_mode = 'ra'
let g:ctrlp_user_command = 'find %s -type f'
```

## Easy Motion

| Motion Command                      | Description                           |
| ----------------------------------- | ------------------------------------- |
| `<leader><leader> w`                | Start of word forwards                |
| `<leader><leader> b`                | Start of word backwards               |
| `<leader><leader> j`                | Start of line forwards                |
| `<leader><leader> k`                | Start of line backwards               |
| `<leader><leader> s <char>`         | Search character                      |
| `<leader><leader> f <char>`         | Find character forwards               |
| `<leader><leader> F <char>`         | Find character backwards              |
| `<leader><leader> t <char>`         | Til character forwards                |
| `<leader><leader> T <char>`         | Til character backwards               |
| `<leader><leader> l`                | Matches begin & end of word forwards  |
| `<leader><leader> h`                | Matches begin & end of word backwards |
| `<leader><leader> e`                | End of word forwards                  |
| `<leader><leader> ge`               | End of word backwards                 |
| `<leader><leader> / <char>... <CR>` | Search n-character                    |
| `<leader><leader><leader> bdt`      | Til character                         |
| `<leader><leader><leader> bdw`      | Start of word                         |
| `<leader><leader><leader> bde`      | End of word                           |
| `<leader><leader><leader> bdjk`     | Start of line                         |
| `<leader><leader><leader> j`        | Jump to anywhere motion               |

## Quick Fix

| 命令      | 作用                         |
| :-------- | :--------------------------- |
| `:cnext`  | 跳转到下一项                 |
| `:cprev`  | 跳转到上一项                 |
| `:cfirst` | 跳转到第一项                 |
| `:clast`  | 跳转到最后一项               |
| `:cnfile` | 跳转到下一个文件中的第一项   |
| `:cpfile` | 跳转到上一个文件中的最后一项 |
| `:cc N`   | 跳转到第 n 项                |
| `:copen`  | 打开 Quick Fix 窗口          |
| `:cclose` | 关闭 Quick Fix 窗口          |

## `ctags`

Generate tags:

```vim
command! MakeTags !ctags -R .
```

Navigation commands:

| 命令               | 作用                                                    |
| :----------------- | :------------------------------------------------------ |
| `<C-]>`            | 跳转到匹配当前光标所在关键字的第一处标签                |
| `g<C-]>`           | 跳转至匹配当前光标所在的关键字                          |
| `:tag {keyword}`   | 跳转到匹配 `{keyword}` 的第一处标签                     |
| `:tjump {keyword}` | 提示用户从匹配 `{keyword}` 的多处标签中指定一处进行跳转 |
| `:pop` 或 `<C-t>`  | 反向遍历标签历史                                        |
| `:tag`             | 正向遍历标签历史                                        |
| `:tnext`           | 跳转到下一处匹配的标签                                  |
| `:tprev`           | 跳转到上一处匹配的标签                                  |
| `:tfirst`          | 跳转到第一处匹配的标签                                  |
| `:tlast`           | 跳转到最后一处匹配的标签                                |
| `:tselect`         | 提示用户从标签匹配列表中选择一项进行跳转                |

## Completion

在 `insert` 模式下:

| 命令         | 补全类型         |
| :----------- | :--------------- |
| `<C-n>`      | 普通关键字       |
| `<C-x><C-n>` | 当前缓冲区关键字 |
| `<C-x><C-i>` | 包含文件关键字   |
| `<C-x><C-]>` | tag 关键字       |
| `<C-x><C-k>` | 字典查找         |
| `<C-x><C-l>` | 整行补全         |
| `<C-x><C-f>` | 文件名补全       |
| `<C-x><C-o>` | 全能（Omni）补全 |

弹出式菜单操作:

| 按键操作            | 作用                                  |
| :------------------ | :------------------------------------ |
| `<C-n>`             | 使用来自补全列表的下一个匹配项        |
| `<C-p>`             | 使用来自补全列表的上一个匹配项        |
| `<Down>`            | 选择来自补全列表的下一个匹配项        |
| `<Up>`              | 选择来自补全列表的上一个匹配项        |
| `<C-y>`             | 确认使用当前选中的匹配项              |
| `<C-e>`             | 还原最早输入的文本(从自动补全中 exit) |
| `<C-h>` (与 `<BS>`) | 从当前匹配项中删除一个字符            |
| `<C-l>`             | 从当前匹配项中增加一个字符            |
| `{char}`            | 中止自动补全并插入字符 `{char}`       |

## Git

Vim fugitive commands:

| Command   | Description                          |
| :-------- | :----------------------------------- |
| `Gblame`  | View git blame (press `o` on commit) |
| `Glog`    | View git log (`[q`/`]q`/`[Q`/`]Q`)   |
| `Gdiff`   | View git diff                        |
| `Gcommit` | Git commit                           |
| `Gstatus` | Git status                           |
| `Gpull`   | Git pull                             |
| `Gpush`   | Git push                             |
