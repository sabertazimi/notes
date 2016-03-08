# C Basic Notes

## 编程习惯

### 检查

#### 边界检查

-   空/满栈检查
-   参数合法性检查    e.g elemSize > 0 检查

#### 指针检查

-   alloctor失败，需添加NULL检查
    -   assert
    -   exit

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
-   不能引用void指针指向的内存单元

### Debugging Malloc

#### 处理void指针

Tips: 中途运用强制类型转换,使得void指针可以执行指针加减运算

```c
void *target = (char *)void_pointer + ...;
```

### 利用void指针实现泛型(generic)

#### 通用型 swap 函数

```c
void swap(void *vp1, void *vp2, int size) {
    char buffer[size];
    memcpy(buffer, vp1, size);
    memcpy(vp1, vp2, size);
    memcpy(vp2, buffer, size);
}
```

#### 通用型 lsearch 函数

##### 实现

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

##### int 实例

```c
int IntCmp(void *elem1, void *elem2) {
    int *ip1 = (int *)elem1;
    int *ip2 = (int *)elem2;
    return *ip1 - *ip2;
}
```

```c
int array[] = {4, 2, 3, 7, 11, 6},
    size = 6,
    target = 7;

// 应进行强制类型转换
int * found = (int *)lsearch(&target, array, 6, sizeof(int), IntCmp);

if (found == NULL) {
    printf("Not Found");
} else {
    printf("Found");
}
```

##### string 实例

```c
int StrCmp(void *vp1, void *vp2) {
    // 必须进行强制类型转换
    char *s1 = *(char **)vp1;
    char *s2 = *(char **)vp2;
    return strcmp(s1, s2);
}
```

```c
char *notes[] = {"Ab", "F#", "B", "Gb", "D"},
    *target = "Eb";
char ** found = lsearch(&target, notes, 5, sizeof(char *), StrCmp);
```

#### 泛型数据结构

##### 通用型栈

```c
typedef struct {
    void *elems;
    int elemSize;
    int logLen;
    int allocLen;
} stack;

void StackNew(stack *s, int elemSize);
void StackDispose(stack *s);
void StackPush(stack *s, void *elemAddr);
void StackPop(stack *s, void *elemAddr);
```

```c
void StackNew(stack *s, int elemSize) {
    // 参数合法性检查
    if (s->elemSize <= 0) {
        perror("ElemSize <= 0");
        return;
    }

    s->elemSize = elemSize;
    s->logLen = 0;
    s->allocLen = 4;
    s->elems = (int *)malloc(s->allocLen * elemSize);

    // NULL检查
    if (s->elems == NULL) {
        perror("No Mem");
        exit(0);
    }
}

void StackPush(stack *s, void *elemAddr) {
    // 满栈检查
    if (s->logLen == s->allocLen) {
        s->allocLen *= 2;
        s->elems = (int *)malloc(s->elems, s->allocLen * s->elemSize);
    }

    void *target = (char *)s->elems + s->logLen * s->elemSize;
    memcpy(target, elemAddr, s->elemSize);
    s->logLen++;
}

void StackPop(stack *s, void *elemAddr) {
    // 空栈检查
    if (s->logLen == 0) {
        perror("Empty Stack");
        return;
    }

    s->logLen--;
    void *source = (char *)s->elems + s->logLen * s->elemSize;
    memcpy(elemAddr, source, s->elemSize);
}
```

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
