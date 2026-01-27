---
sidebar_position: 50
tags: [CS, Compiler, Example, Parser, Interpreter]
---

# Examples

## Parser

```cpp
// 返回下一个Token(只测试该Token，不向前移动Token List的offset指针)
Token Peek(void);
```

```cpp
// 消费下一个Token
Token Next(void);
```

```cpp
// void Expect(expectedToken)
if (Peek() != expectedToken) {
    Error("expect %s, but got %s\n", expectedToken, Peek());
}
```

```cpp
// void Try(expectedToken)
if (Peek() == expectedToken) {
    Next(); // 消费之
    return true;
}

return false;
```

## Interpreter

```cpp
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

#define MAX_TOKENS 100
#define MAX_TOKEN_LEN 64

enum type_tag {
    IDENTIFIER,
    QUALIFIER,
    TYPE,
};

struct token {
    char type;
    char string[MAX_TOKEN_LEN];
};

int top = -1;
struct token stack[MAX_TOKENS];
struct token ts;

#define pop stack[top--]
#define push(s) stack[++top] = s

enum type_tag classify_string(void) {
    char *s = ts.string;

    if (!strcmp(s, "const")) {
        strcpy(s, "read-only ");
        return QUALIFIER;
    }

    if (!strcmp(s, "volatile")) return QUALIFIER;
    if (!strcmp(s, "void")) return TYPE;
    if (!strcmp(s, "char")) return TYPE;
    if (!strcmp(s, "signed")) return TYPE;
    if (!strcmp(s, "unsigned")) return TYPE;
    if (!strcmp(s, "short")) return TYPE;
    if (!strcmp(s, "int")) return TYPE;
    if (!strcmp(s, "long")) return TYPE;
    if (!strcmp(s, "float")) return TYPE;
    if (!strcmp(s, "double")) return TYPE;
    if (!strcmp(s, "struct")) return TYPE;
    if (!strcmp(s, "union")) return TYPE;
    if (!strcmp(s, "enum")) return TYPE;

    return IDENTIFIER;
}

void get_token(void) {
    char *p = ts.string;

    /* 略过空白字符 */
    while ((*p = getchar()) == ' ');

    if (isalnum(*p)) {
        /* 读入得标识符以ａ－Ｚ，０－９开头 */
        while (isalnum(*++p = getchar()));
        ungetc(*p, stdin);
        *p = '\0';
        ts.type = classify_string();
        return;
    }

    if (*p == '*') {
        strcpy(ts.string, "pointer to");
        ts.type = '*';
        return;
    }

    ts.string[1] = '\0';
    ts.type = *p;
    return;
}

void read_to_first_identifier(void) {
    get_token();

  // read til identifier
    while (ts.type != IDENTIFIER) {
        push(ts);
        get_token();
    }

    printf("%s is ", ts.string);
    get_token();
}

void deal_with_arrays(void) {
    while (ts.type == '[') {
        printf("array ");
        get_token();

    /* 数字或']' */
        if (isdigit(ts.string[0])) {
            printf("0..%d ", atoi(ts.string) - 1);
            get_token();
        }

        get_token();
        printf("of ");
    }
}

void deal_with_pointers(void) {
    while (stack[top].type == '*')
    {
        printf("%s ", pop.string);
    }
}

void deal_with_function_args(void) {
    while (ts.type != ')') {
        get_token();
    }

    get_token();
    printf("function returning ");
}

void deal_with_declarator(void) {
    /* 处理标识符之后可能存在的数组/函数 */

    switch (ts.type) {
      case '[':
          deal_with_arrays();
          break;
      case '(':
          deal_with_function_args();
          break;
    }

    deal_with_pointers();

    /* 处理在读入到标识符之前压入到堆栈中的符号 */
    while (top >= 0) {
        if (stack[top].type == '(') {
            pop;
            get_token();  //读取')'之后的符号
            deal_with_declarator();
        } else {
            printf("%s", pop.string);
        }
    }
}

int main(void) {
    /* 将标记压入堆栈中, 直到遇见标识符 */
    read_to_first_identifier();
    deal_with_declarator();
    printf("\n");

    system("pause");
    return 0;
}
```

## References

- Cool: [Classroom Object-Oriented Language](http://web.stanford.edu/class/cs143/materials/cool-manual.pdf)
