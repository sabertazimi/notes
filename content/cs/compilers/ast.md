---
sidebar_position: 5
tags: [CS, Compiler, Syntax, AST]
---

# Abstract Syntax Tree

:::tip

```mermaid
flowchart LR
    A["Tokens + Grammar"] -->|Syntax Analysis| B["AST"]
```

:::

## 语法制导翻译

Syntax-directed translation,
在进行归约(reduce)的同时, 进行语义动作:

- 给每条产生规则附加一个语义动作

```bison
exp : exp '+' exp { $$ = $1 + $3; }
;
```

- 在分析栈中压入 symbol, value, state (原本只压入 symbol, state)

```cpp
push(right side symbol);
push(right side value);
push(next state);
```

## 抽象语法

- 表达语法结构的内部表示, 作为前端(词法语法分析)和后端(代码生成)的中间件:

```mermaid
flowchart LR
    A["tokens"] -->|语法分析器| B["抽象语法(树)"]
    B -->|代码生成器| C["目标代码"]
```

- 抽象语法无需考虑左/右递归, 左公因子提取, 分隔符等

```cpp
// 具体语法
E: E + T
 | T
 ;
T: T * F
 | F
 ;
F: n
 | (E)
 ;

// 抽象语法
E: n
 | E + E
 | E * E
```

## Data Structure

```cpp
E: n
 | E + E
 | E * E
```

```cpp
enum kind {
  E_INT,
  E_ADD,
  E_TIMES
};

struct exp {
  enum kind kind;
};

struct exp_int {
  enum kind kind;
  int value;
};

struct exp_add {
  enum kind kind;
  struct exp *left;
  struct exp *right;
};

struct exp_times {
  enum kind kind;
  struct exp *left;
  struct exp *right;
};

struct exp_int *new_exp_int(int value) {
  struct exp_int *p = (struct exp_int *)malloc(sizeof(struct exp_int));
  if (!p) throw new Error();
  p->kind = E_INT;
  p->value = value;
  return p;
}

struct exp_add *new_exp_add(exp *left, exp *right) {
  struct exp_add *p = (struct exp_add *)malloc(sizeof(struct exp_add));
  if (!p) throw new Error();
  p->kind = E_ADD;
  p->left = left;
  p->right = right;
  return p;
}

struct exp_times *new_exp_times(exp *left, exp *right) {
  struct exp_times *p = (struct exp_times *)malloc(sizeof(struct exp_times));
  if (!p) throw new Error();
  p->kind = E_TIMES;
  p->left = left;
  p->right = right;
  return p;
}
```

## Algorithms

```cpp
int nodes_num(exp *e) {
  switch (e->kind) {
    case E_INT:
      return 1;
    case E_ADD: // fall through
    case E_TIMES:
      return 1 + nodes_num(e->left) + nodes_num(e->right);
    default:
      throw new SyntaxError("compile bug");
  }
}
```

```cpp
int pretty_print(exp *e) {
  switch (e->kind) {
    case E_INT:
      printf("%d", e->value);
      return 1;
    case E_ADD:
      printf("(");
      pretty_print(e->left);
      printf(")");
      printf("+");
      printf("(");
      pretty_print(e->right);
      printf(")");
      return 1;
    case E_TIMES:
      printf("(");
      pretty_print(e->left);
      printf(")");
      printf("*");
      printf("(");
      pretty_print(e->right);
      printf(")");
      return 1;
    default:
      throw new SyntaxError();
      break;
  }
}
```

## Construction

利用语法制导翻译, 在语法动作(action)/语法归约(reduce)中加入生成语法树的代码(自底(叶子)向上(根)构造函数)

```cpp
E: E + E { $$ = new_exp_add($1, $3); }
 | E * E { $$ = new_exp_times($1, $3); }
 | n     { $$ = new_exp_int($1); }
 ;
```
