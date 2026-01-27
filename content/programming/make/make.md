---
tags: [Programming, Make]
---

# Makefile

```bash
# -----------------------------------------------------------------------------
# CMake project wrapper Makefile ----------------------------------------------
# -----------------------------------------------------------------------------

SHELL := /bin/bash
RM    := rm -rf
MKDIR := mkdir -p

all: ./build/Makefile
    @ $(MAKE) -C build

./build/Makefile:
    @  ($(MKDIR) build > /dev/null)
    @  (cd build > /dev/null 2>&1 && cmake ..)

clean:
    @  ($(MKDIR) build > /dev/null)
    @  (cd build > /dev/null 2>&1 && cmake .. > /dev/null 2>&1)
    @- $(MAKE) --silent -C build clean || true
    @- $(RM) ./build/Makefile
    @- $(RM) ./build/src
    @- $(RM) ./build/test
    @- $(RM) ./build/CMake*
    @- $(RM) ./build/cmake.*
    @- $(RM) ./build/*.cmake
    @- $(RM) ./build/*.txt

ifeq ($(findstring clean,$(MAKECMDGOALS)),)
    $(MAKECMDGOALS): ./build/Makefile
    @ $(MAKE) -C build $(MAKECMDGOALS)
endif
```

## Macro

```makefile
foo := a.o b.o c.o
bar := $(foo:.o=.c)
first_second = Hello
a = first
b = second
all = $($a_$b)
```

这里的 `$a_$b` 组成了 `first_second`, 于是 `$(all)` 的值就是 `Hello`.

- AR: 函数库打包程序. 默认命令是 `ar`.
- AS: 汇编语言编译程序. 默认命令是 `as`.
- CC: C 语言编译程序. 默认命令是 `cc`.
- CXX: C++语言编译程序. 默认命令是 `g++`.
- CO: 从 RCS 文件中扩展文件程序. 默认命令是 `co`.
- CPP: C 程序的预处理器（输出是标准输出设备）. 默认命令是 `$(CC) –E`.
- FC: Fortran 和 RatFor 的编译器和预处理程序. 默认命令是 `f77`.
- GET: 从 SCCS 文件中扩展文件的程序. 默认命令是 `get`.
- LEX: Lex 方法分析器程序（针对于 C 或 RatFor）. 默认命令是 `lex`.
- PC: Pascal 语言编译程序. 默认命令是 `pc`.
- YACC: Yacc 文法分析器（针对于 C 程序）. 默认命令是 `yacc`.
- YACCR: Yacc 文法分析器（针对于 RatFor 程序）. 默认命令是 `yacc –r`.
- MAKEINFO: 转换 TexInfo 源文件（.texi）到 Info 文件程序. 默认命令是 `makeinfo`.
- TEX: 从 TeX 源文件创建 TeX DVI 文件的程序. 默认命令是 `tex`.
- TEXI2DVI: 从 TexInfo 源文件创建军 TeX DVI 文件的程序. 默认命令是 `texi2dvi`.
- WEAVE: 转换 Web 到 TeX 的程序. 默认命令是 `weave`.
- CWEAVE: 转换 C Web 到 TeX 的程序. 默认命令是 `cweave`.
- TANGLE: 转换 Web 到 Pascal 语言的程序. 默认命令是 `tangle`.
- CTANGLE: 转换 C Web 到 C. 默认命令是 `ctangle`.
- RM: 删除文件命令. 默认命令是 `rm –f`.
- ARFLAGS: 函数库打包程序 AR 命令的参数. 默认值是 `rv`.
- ASFLAGS: 汇编语言编译器参数. （当明显地调用 `.s`或 `.S`文件时）.
- CFLAGS: C 语言编译器参数.
- CXXFLAGS: C++语言编译器参数.
- COFLAGS: RCS 命令参数.
- CPPFLAGS: C 预处理器参数. (C 和 Fortran 编译器也会用到）.
- FFLAGS: Fortran 语言编译器参数.
- GFLAGS: SCCS `get` 程序参数.
- LDFLAGS: 链接器参数. (如: `ld`).
- LFLAGS: Lex 文法分析器参数.
- PFLAGS: Pascal 语言编译器参数.
- RFLAGS: RatFor 程序的 Fortran 编译器参数.
- YFLAGS: Yacc 文法分析器参数.

## Variable

- `$@`: 表示规则中的目标文件集. 在模式规则中, 如果有多个目标，那么 "$@"就是匹配于目标中模式定义的集合.
- `$%`: 仅当目标是函数库文件中，表示规则中的目标成员名.
  例如，如果一个目标是 `foo.a(bar.o)`，那么 `$%` 就是 `bar.o`，`$@` 就是 `foo.a`.
  如果目标不是函数库文件 (Unix 下是`[.a]`, Windows 下是 `[.lib]`), 那么其值为空.
- `$<`: 依赖目标中的第一个目标名字. 如果依赖目标是以模式（即 `%`）定义的,
  那么 `$<` 将是符合模式的一系列的文件集. 注意, 其是一个一个取出来的.
- `$?`: 所有比目标新的依赖目标的集合. 以空格分隔.
- `$^`: 所有的依赖目标的集合. 以空格分隔. 如果在依赖目标中有多个重复的，那个这个变量会去除重复的依赖目标，只保留一份.
- `$+`: 这个变量很像 `$^`，也是所有依赖目标的集合. 只是它不去除重复的依赖目标.
- `$(@D)`: 表示 `$@` 的目录部分 (不以斜杠作为结尾),
  如果 `$@` 值是 `dir/foo.o`，那么 `$(@D)` 就是 `dir`，
  而如果 `$@` 中没有包含斜杠的话，其值就是 `.` (当前目录).
- `$(@F)`: 表示 `$@` 的文件部分，如果 `$@` 值是 `dir/foo.o`, 那么 `$(@F)` 就是 `foo.o`,
  `$(@F)` 相当于函数 `$(notdir $@)`.
- `$(*D)`/`$(*F)`: 和上面所述的同理，也是取文件的目录部分和文件部分.
  对于上面的那个例子，`$(*D)` 返回 `dir`，而 `$(*F)` 返回 `foo`.
- `$(%D)`/`$(%F)`: 分别表示了函数包文件成员的目录部分和文件部分.
  这对于形同 `archive(member)` 形式的目标中的 `member` 中包含了不同的目录很有用.
- `$(<D)`/`$(<F)`: 分别表示依赖文件的目录部分和文件部分.
- `$(^D)`/`$(^F)`: 分别表示所有依赖文件的目录部分和文件部分 (无相同的).
- `$(+D)`/`$(+F)`: 分别表示所有依赖文件的目录部分和文件部分 (可以有相同的).
- `$(?D)`/`$(?F)`: 分别表示被更新的依赖文件的目录部分和文件部分.

## Implicit Rules

### C

`<n>.o` 的目标的依赖目标会自动推导为`<n>.c`,
并且其生成命令是 `$(CC) –c $(CPPFLAGS) $(CFLAGS)`.

### C++

`<n>.o` 的目标的依赖目标会自动推导为 `<n>.cc` 或是 `<n>.C`,
并且其生成命令是 `$(CXX) –c $(CPPFLAGS) $(CFLAGS)`
(建议使用 `.cc` 作为 C++源文件的后缀, 而不是 `.C`).

### ASM

`<n>.o` 的目标的依赖目标会自动推导为`<n>.s`，默认使用编译品 `as`，并且其生成命令是： `$(AS) $(ASFLAGS)`。
`<n>.s` 的目标的依赖目标会自动推导为`<n>.S`，默认使用 C 预编译器 `cpp`，并且其生成命令是： `$(AS) $(ASFLAGS)`。

### Object Linking

`<n>`目标依赖于`<n>.o`，通过运行 C 的编译器来运行链接程序生成（一般是 `ld`），其生成命令是：
`$(CC) $(LDFLAGS) <n>.o $(LOADLIBES) $(LDLIBS)`
这个规则对于只有一个源文件的工程有效，同时也对多个 Object 文件（由不同的源文件生成）的也有效。例如如下规则：

x : y.o z.o

并且 `x.c`、 `y.c`和 `z.c`都存在时，隐含规则将执行如下命令：

cc -c x.c -o x.o
cc -c y.c -o y.o
cc -c z.c -o z.o
cc x.o y.o z.o -o x
rm -f x.o
rm -f y.o
rm -f z.o

## Function

- filter
- shell
- subst
- wildcard

## Best Practices

```makefile
$(filter %.o,$(files)): %.o: %.c
$(filter %.elc,$(files)): %.elc: %.el
```

```makefile
$(CC) -c $(CFLAGS) $< -o $@
```

```makefile
(%.o) : %.c
$(CC) $(CFLAGS) $(CPPFLAGS) -c $< -o $*.o
$(AR) r $@ $*.o
$(RM) $*.o
```

```makefile
%.d: %.c
@set -e; rm -f $@; /
$(CC) -M $(CPPFLAGS) $< > $@.$$$$; /
sed 's,/($*/)/.o[ :]*,/1.o $@ : ,g' < $@.$$$$ > $@; /
$(RM) -f $@.$$$$
```
