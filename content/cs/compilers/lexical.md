---
sidebar_position: 2
tags: [CS, Compiler, Lexical, Tokenizer, DFA, NFA]
---

# Lexical Analysis

:::tip

```mermaid
flowchart LR
    A["Source Code"] -->|Lexical Analysis| B["Tokens"]
```

:::

## Tokenizer

- Maximal match
- Higher priority match

### 转移图

```cpp
token nextToken(void) {
  char c = getChar();
  switch(c) {
    case '<':
      c = getChar();
      switch (c) {
        case '=':
          return LE;
        case '>':
          return NE;
        default:
          rollback();
          return LT;
      }

    case '=':
      return EQ;
    case '>':
      c = getChar();
      switch (c) {
        case '=':
          return GE;
        case '<':
          return NE;
        default:
          rollback();
          return GT;
      }
  }
}
```

### 关键字处理

- 根据 完美哈希算法(无冲突哈希函数) , 建立所有关键字对应的关键字完美哈希表
- 读入有效标识符(字符串型)后, 查询关键字哈希表, 检查当前标识符是否为关键字

```cpp
#define KEYWORD_MAX_LEN 10

hash_one(char *str, int len) {
    unsigned int keyValue = 0;

    for (int i = 0; i < len; i++) {
        keyValue += str[i] * ((int)pow(33, len - i));
    }

    keyValue = (keyValue * 3 + 7) % KEYWORD_MAX_LEN;
  return keyValue;
}
```

```cpp
#define KEYWORD_HASH_SEED 131

hash_two(char *str, int len) {
  unsigned int keyValue = 0,
           hash = 0;

    for (int i = 0; i < len; i++) {
        hash = hash * KEYWORD_HASH_SEED + str[i];
    }

    keyValue = hash & 0x7fffffff;
    return keyValue;
}
```

## 有限状态自动机

### 确定

Deterministic Finite Automaton (DFA):

- Only a transition for a state with a input
- No epsilon moves

M = (AlphaSet/InputSet, StateSet, currentState, FiniteStateSet, transferFunction)

```cpp
A = {a, b}, SS = {0, 1, 2}, cS = 0, FS = {2},
transferFunction = {
  (cS0, a) -> cS1, (cS0, b) -> cS0,
  (cS1, a) -> cS2, (cS1, b) -> cS1,
  (cS2, a) -> cS2, (cS2, b) -> cS2,
}
```

#### 状态转移表

| 状态\字符 | a   | b   |
| :-------- | :-- | :-- |
| 0         | 1   | 0   |
| 1         | 2   | 1   |
| 2         | 2   | 2   |

### 非确定

Nondeterministic Finite Automaton (NFA):

transferFunction 中的次态不确定/不唯一(为一个开集合):

- Multiple transitions for a state with a input
- can epsilon moves

> (cS0, a) -> `{cS1, cS2}`

## 自动词法分析器

```mermaid
flowchart LR
    A["RegExp"] -->|Thompson 算法| B["NFA"]
    B -->|子集构造算法| C["DFA"]
    C -->|Hopcroft 最小化算法| D["词法分析器代码"]
```

### Thompson

RegExp --> NFA:

- 直接构造基本 RegExp
- 递归构造复合 RegExp
- epsilon : `i --epsilon--> f`
- RegExp : `i --NFA(RegExp)--> f`
- 选择 : `i --NFA(RegExp1)--> f`, `i --NFA(RegExp2)--> f`
- 连接 : `i --NFA(RegExp1)--> m --NFA(RegExp2)--> f`
- 闭包 : `i --epsilon--> m --epsilon--> f`, `m --RegExp--> m`

### 子集构造

NFA --> DFA:

由 Thompson 算法生成的 NFA, 当且仅当输入为 epsilon 时, 次态不唯一

- 将所有可达到次态作为一个集合 s, 视为单一次态 s
- delta(Sigma) + epsilon-closure(深度/广度优先遍历找寻可达到次态边界)

```cpp
DFA subset_construction(NFA nfa) {
  s0 = eps_closure(n0);

  StateSet += s0;
  enqueue(s0);

  while (work_queue != []) {
    dequeue(s);

    foreach (ch in InputSet) {
      next_state = eps_closure(delta(s, ch));
      Fn[s, ch] = next_state;  // DFA 中的转移函数

      if (next_state not in StateSet) {
        StateSet += next_state;
        enqueue(next_state);
      }
    }
  }

  return DFA(StateSet, Fn);
}
```

### Hopcroft

最小化 DFA(数字逻辑中的最简状态表), 合并等价状态(等价类)

```cpp
split(StateSet S) {
  foreach (char ch) {
    if (ch can split S) {
      split S into S1, ..., Sk;
    }
  }
}

hopcroft(DFA) {
  split all nodes into InitStateSet and FiniteStateSet (Two State Sets);

  while (set is still changes) {
    split(S);
  }
}
```

### DFA

### 有向图

### 转移表

- 行: 现态
- 列: 输入
- 值: 次态/ERROR/-1

驱动代码: table 用于实现 switch/case, stack 用于实现最长匹配

```cpp
next_token() {
  state = 0;
  stack = [];

  while (state != ERROR) {
    c = getChar();

    if (state is ACCEPT/FINITE) {
      clear(stack);
    }

    push(state);
    state = table[state][c];
  }

  while (state is not ACCEPT/FINITE) {
    state = pop();
    rollback();
  }
}
```
