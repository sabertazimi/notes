---
sidebar_position: 4
tags: [CS, Compiler, Syntax, LR0, SLR, LALR]
---

# Bottom-Up Parsing

:::tip

```mermaid
flowchart LR
    A["Tokens + Grammar"] -->|Syntax Analysis| B["AST"]
```

:::

```cpp
0: S -> E
1: E -> E + T
2: | T
3: T -> T * F
4: | F
5: F -> n
```

```cpp
2 + 3 * 4
=> F + 3 * 4
=> T + 3 * 4
=> E + 3 * 4
=> E + T * 4
=> E + T * F
=> E + T
=> E
=> S
```

> 最右推导(优先推导最右侧非终结符)逆过程

## LR(0)

移进-归约 (Reduce) 算法:

- 从左向右读入程序 (left to right scan), 逆向最右推导 (rightmost derivation), 不用前看符号.
- 添加伪开始符号: `S' -> . S$`, `$` 表示 tokens/file 结束符.
- 移进 : 读入记号 `push(token[i])`.
- 归约 (Reduce): `pop(right expansion)` `push(left expansion)`.

### 短语

Handles:

```cpp
S -*> αXω -> αβω
```

β 是 αβω 的一个短语 (Handle).

### 分析表

LR(0) 分析表构造算法: (原理同于 Hopcroft 算法)

- E -> A, A -> B, B -> C ... :
  Recursively, right hand side of C production will be reduced to E finally

```cpp
closure(production_set p) {
  while (p is still changing) {
    foreach (p's item i: A -> b . B ...) {
      p += {B -> . y...}
    }
  }
}

goto(production_set p, token x) {
  temp = {}

  foreach (p's item i: A -> b . x...) {
    temp += {A -> bx . ...}
  }

  return closure(temp)
}
```

```cpp
p0 = closure(S'' -> . S $)
(production_with_dot_)set = {p0}
Q = enqueue(p0)

while (Q is not empty) {
  p = dequeue(Q)

  foreach (x <- NonTerminal||Terminal) {
    q = goto(p, x)

    if (x <- Terminal) {
      ACTION[p, x] = q
    } else {
      GOTO[p, x] = q
    }

    if (q not <- set) {
      set += {q}
      enqueue(q)
    }
  }
}
```

### 驱动代码

LR(0) 驱动算法:

```cpp
stack[];
push($)
push(state1)

while (true) {
  token t = nextToken()
  state s = stack[top]

  if (ACTION[s, t] == shift_i) {
    push(t)
    push(state_i)
  } else if (ACTION[s, t] == reduce_j) {
    // X is the left side of production j: X->beta
    // beta is the right side of production j: X->beta

    // pop up right side
    pop(beta && bundle state variables)

    // current state after pop up all bundle state(of beta)
    state s = stack[top]

    // push left side
    push(X)

    // transfer state after reduce
    push(GOTO[s, X])
  } else {
    throw new SyntaxError();
  }
}
```

### 解决冲突

SLR, LR(1), LALR,
采取与 first/follow/select sets 以及 前看符号 类似策略:

- `production_with_dot_set` 中的 item 修改为 `X -> [beta1 . beta_n..., a]` 二元组
- closure(production_set p) 中闭包规则从 `X -> [a . Y beta,a]`
  修改为 `Y -> [.y, b]` b `<-` select(beta a)

## LALR-K

LALR(k)

## SLR

Simple LR: improves LR(k) shift/reduce heuristic

New reduce rule:

- state contains item X -> β.
- next_token `<-` follow(X)

- stack pair: `<input, state>`
- state i: if has item X -> α.aβ ,
  goto[i, a] = j then action[i, a] = shift j(shift then to state j)
- state i: if has item `X -> α.` , `a <- follow(X)`
  then `action[i, a] = reduce(X -> α)`
- state i: if has item S' -> S then action[i, $] = accept
- otherwise: action[i, a] = error
