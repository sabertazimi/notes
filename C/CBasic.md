# C Basic Notes

## 类型转换

### 机器码转换

-   有符号类型转换: 进行符号扩展
-   无符号类型转换: 进行零扩展

## Awesome Pointer(Tips and Best Practice)

### Error Prone Pointers(易错点)

```c
int i = 37;
float f = *(float *)&i;

float f = 7.0;
short s = *(short *)&f;
```

-   悬挂指针
-   未初始化
-   改写未知区域
    -   下标越界
    -   内存上溢 e.g `gets(string);`
-   指针相关运算符优先级与结合性
-   返回局部变量的地址
-   重复释放内存空间
-   内存泄漏   e.g 未释放空间/未释放部分深度空间(多维数组)

### Debugging Malloc

#### Tools

Valgrind - [GitHub Repo](https://github.com/svn2github/valgrind)

## Useful Functions

### Strings

#### strdup

string duplicate - `char *strdup(string)` 封装allocator细节

### Exceptions

perror(string) - 用来将上一个函数发生错误的原因输出到标准设备(stderr)

### Process and Threads

#### fork/execve

- fork(): 创建当前进程的拷贝
- execve(): 用另一程序的代码代替当前进程的代码
    - `int execve(char *filename, char *argv[], char *envp[])`

```c
void fork_exec(char *path, char *argv[]) {
    pid_t pid = fork();

    if (0 != pid) {
        printf("Parent: created a child %d\n", pid);
    } else {
        printf("Child: exec-ing new program now\n");
        execv(path, argv);
    }

    printf("This line printed by parent only!\n");
}
```

#### Other

- getpid()
- wait(int *child_status)/waitpid(pid)
- exit()
