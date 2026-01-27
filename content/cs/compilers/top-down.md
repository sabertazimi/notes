---
sidebar_position: 3
tags: [CS, Compiler, Syntax]
---

# Top-Down Parsing

:::tip

```mermaid
flowchart LR
    A["Tokens + Grammar"] -->|Syntax Analysis| B["AST"]
```

:::

- 从开始符号出发推导任意句子 t, 与给定句子 s 进行比较分析
- 利用分析树进行逐叶子匹配, 若匹配失败则进行回溯

```cpp
bool top_down_parsing(tokens[]) {
  i = 0;
  stack = [S];

  while (stack != []) {
    if (stack[top] is a terminal t) {
      t == tokens[i] ? pop(i++) : backtrack();
    } else if (stack[top] is a non_terminal T) {
      pop();
      push(T next expansion); // 自右向左压栈, e.g. pop(S), push(N_right), push(V), push(N_left)
    } else {
      throw new SyntaxError();
    }
  }

  return i >= tokens.length && is_empty(stack) ? true : false;
}
```

## 避免回溯

利用前看符号避免回溯

```cpp
Sentence -> Noun Verb Noun
Noun -> sheep
  | tiger
  | grass
  | water
Verb -> eat
  | drink
```

> tiger eat water: 向前看非终结符推导出的所有终结符中匹配 tiger 的终结符;
> 不向前看,则先推导 N, 再推导 n, 但 n 不一定匹配 tiger, 则需进行回溯;
> 向前看一个字符, 直接推导 N --> n, 同时直接找寻匹配 tiger 的终结符

```cpp
S -> N V N
N -> (sheep)tiger
V -> eat
N -> (sheep-tiger-grass)water
```

## 递归下降

Recursive descent (预测分析算法):

- 分治算法: 每个非终结符构造一个**分析函数**
- 前看符号: 用**前看符号**指导产生式规则的选择(expansion)

```cpp
parse_S(tokens[]) {
  parse_N(tokens[0]);
  parse_V(tokens[1]);
  parse_N(tokens[2]);
}

parse_N(token) {
  if (token == s|t|g|w) {
    return true;
  } else {
    throw new SyntaxError();
  }
}

parse_V(token) {
  if (token == e|d) {
    return true;
  } else {
    throw new SyntaxError();
  }
}
```

1. Use save pointer to implement roll back
2. Use logical OR expression to replace nested if-else structure:

```cpp
bool term(TOKEN tok) {
    return *next++ == tok;
}

bool E1(void) {
    return T();
}

bool E2(void) {
    return T()
        && term(PLUS)
        && E();
}

bool E(void) {
    // roll back pointer
    TOKEN *save = next;

    return (next = save, E1())
        || (next = save, E2());
}

bool T1(void) {
    return term(INT);
}

bool T2(void) {
    return term(INT)
        && term(TIMES)
        && T();
}

bool T3(void) {
    return term(OPEN)
        && E()
        && term(CLOSE);
}

bool T(void) {
    // roll back pointer
    TOKEN *save = next;

    return (next = save, T1())
        || (next = save, T2())
        || (next = save, T3());
}
```

```cpp
// X -> a
//  | XX
//  | aXXX
//  | aXXXXb
parse_X() {
  token = nextToken();

  switch (token) {
    case ...: // i: token == atom_char or parse_XX();
    case ...: // j: token == atom_char, token = nextToken(), parse_XXX();
    // k: token == atom_char, token = nextToken(),
    // parse_XXXX(), token=nextToken(), token == b
    case ...:
    default: throw new SyntaxError();
  }
}
```

## LL(1)

- 从左(L)向右读入程序(left to right scan)
- 最左(L)推导: 优先推导最左侧非终结符(leftmost derivation)
- 一个(1)前看符号(look ahead)
- 分治算法: 每个非终结符构造一个**first set** 和一个 **follow set**, 最后为每个规则构造一个 **select set**
- 分析表驱动(由 first sets/follow sets/select sets 推导分析表)

```cpp
bool ll1_parsing(tokens[]) {
  i = 0;
  stack = [S];

  while (stack != []) {
    if (stack[top] is a terminal t) {
      t == tokens[i] ? pop(i++) : throw new SyntaxError();
    } else if (stack[top] is a non_terminal T) {
      pop();
      // push(T correct expansion);
      // 自右向左压栈, e.g. pop(S), push(N_right), push(V), push(N_left)
      push(select_table[T][tokens[i]] 对应项(规则编号)所对应规则的右边式子);
    } else {
      throw new SyntaxError();
    }
  }

  return i >= tokens.length && is_empty(stack) ? true : false;
}
```

### nullable sets

- 存在规则: `X -> epsilon`.
- 或者: `X -> Y1Y2...Yn`, 且存在规则 `Y1 -> epsilon, ..., Yn -> epsilon`.
- 即 : `X -*> epsilon` (epsilon `<-` first(X)).

```cpp
nullable = {};

while (nullable is still changing) {
  foreach (production p: X -> beta) {
    if ((beta == epsilon) || (beta == Y1...Yn
      && Y1 <- nullable && ... && Yn <- nullable)) {
      nullable += X;
    }
  }
}
```

### first sets

first(X) = `{t | X -_> talpha}` U `{epsilon | X-_>epsilon}` :

- first(t) = `{t}`
- epsilon `<-` first(X): X -> epsilon or X -> A1...An, epsilon `<-` first(Ai)
- first(alpha) `<-` first(X): X -> A1..Analpha, epsilon `<-` first(Ai)

first sets 不动点算法:

```cpp
foreach (non_terminal N) {
  first(N) = {};
}

while (some sets is changing) {
  foreach (production p: N->beta1...beta_n) {
    foreach (beta_i from beta1 up to beta_n) {
      if (beta_i == a) {
      // e.g. N->abX: first(N) += {a}
        first(N) += {a};
        break;
      } else if (beta_i == M) {
        first(N) += first(M);
        if (M is not in nullable) {
          break;
        } // else continue this loop to add first(beta_next) into first(N)
      }
    }
  }
}
```

| NonTerminal | First Set      |
| :---------- | :------------- |
| S           | `{s, t, g, w}` |
| N           | `{s, t, g, w}` |
| V           | `{e, d}`       |

### follow sets

follow(X) = `{t | S -*> beta X t epsilon}`:

- for `X -> AB`:
  - `first(B) <- follow(A)`, `follow(X) <- follow(B)`.
  - if `B -*> epsilon`: `follow(X) <- follow(A)`.
- for `A -> alpha X beta`: `first(beta) - {epsilon} <- follow(X)`.
- `$ <- follow(S)`.

follow sets 不动点算法:

```cpp
foreach (non_terminal N) {
  follow(N) = {};
}

while (some sets is changing) {
  foreach (production p: N->beta1...beta_n) {

        // temp: follow(left) <- follow(right)
    temp = follow(N);

    foreach (beta_i from beta_n down to beta1) {
      if (beta_i == a) {
        temp = {a};
      } else if (beta_i == M) {
        follow(M) += temp
        temp = (M is not nullable) ? (first(M)) : (temp + first(M))
      }
    }
  }
}
```

### select sets

- 当 N -> Y1...Yn 右边 Y 全为 nullable 时, select(p) += follow(N)

select sets 不动点算法:

```cpp
foreach (production p) {
  select(p) = {}
}

calculate_select_set(production p: N->beta1...beta_n) {
  foreach (beta_i from beta1 up to beta_n) {
    if (beta_i == a) {
      select(p) += {a};
      break;
    } else if (beta_i == M) {
      select(p) += first(M);
      if (M is not in nullable) {
        break;
      }
    }
  }

  // all betas are in nullable (当前规则的所有右边符号都是可空集)
  // 故, select(p) 必须包括 follow(M) (当推导出右边符号都为空时, first(p) 即为 follow(M))
  if (i > n) {
    first(N) += follow(N);
  }
}
```

### 分析表

- 结合 nullable sets 准确求出 first sets
- 再利用 first sets 准确求出 follow sets
- 再利用 first sets, 并结合 follow sets(全空集修正) 准确求出 分析表:

```cpp
0: z -> d
1: | X Y Z
2: Y -> c
3: |
4: X -> Y
5: | a
```

nullable = `{X, Y}`

|        | X           | Y           | Z           |
| :----- | :---------- | :---------- | :---------- |
| first  | `{a, c}`    | `{c}`       | `{a, c, d}` |
| follow | `{a, c, d}` | `{a, c, d}` | `{}`        |

| production | 0     | 1           | 2     | 3           | 4           | 5     |
| :--------- | :---- | :---------- | :---- | :---------- | :---------- | :---- |
| select     | `{d}` | `{a, c, d}` | `{c}` | `{a, c, d}` | `{a, c, d}` | `{a}` |

| Non-Terminal | a      | c      | d      |
| :----------- | :----- | :----- | :----- |
| Z            | 1      | 1      | `0, 1` |
| Y            | 3      | `2, 3` | 3      |
| X            | `4, 5` | 4      | 4      |

> 数字为规则编号

### 解决冲突

分析表某项有多个编号时, 通过文法重写消除左递归, 使文法适应 L(最左推导):

- 改写成右递归文法
- 规定优先级与结合性
- 提取左公因式(Common Prefix)

```cpp
E -> T+E
    |T

E -> TX
X -> +E
    |epsilon
```

### 消除直接左递归

```cpp
S -> Salpha1
    |Salpha2
    ...
    |Salpha_n
    |beta1
    |beta2
    ...
    |beta_m

S -> beta1S'
    |beta2S'
    ...
    |beta_nS'
S'-> alpha1S'
    |alpha2S'
    ...
    |alpha_nS'
    |epsilon
```

### 消除间接左递归

- 把文法 G 的所有非终结符按任一顺序排列, e.g. A1, A2, …, An
- 消除 Ai 规则中的直接左递归: 把形如 Ai→Ajγ 的产生式
  改写成 Ai→δ1γ /δ2γ /…/δkγ(其中 Aj→δ1 /δ2 /…/δk 是关于的 Aj 全部规则)
- 去掉多余的规则(不可达规则)

```cpp
#include <iostream>
#include <string>
#include <fstream>

using namespace std;

struct WF {
    string left; //定义产生式的左部
    string right; //定义产生式的右部
};

/*
 * count: number of non-terminal symbols
 */
void Removing(WF *p,char *q,int n,int count) {

    int count1 = n;
    int flag = 0;

  // 判断第一个非终结符是否存在直接左递归 if(p[i].left[0]==q[0])
    for (int i = 0; i < n; i++) {
        if (p[i].left[0] == p[i].right[0]) {
            flag++;
        }
    }

  // 如果存在直接左递归则消除直接左递归
    if (flag != 0)
    {
        for (int i = 0; i < n; i++) {
            if (p[i].left[0] == q[0]) {
                if (p[i].left[0] == p[i].right[0]) {
                  string str;
                    str = p[i].right.substr(1,int (p[i].right.length())); // 取右部第二位开始的字串赋给str

                    // E->E+T => E'->+TE'
                    string temp = p[i].left;
                    string temp1 = "'";
                    p[i].left = temp+temp1;
                    p[i].right = str+p[i].left;
                } else {
                    // E->T => E->TE'
                    string temp=p[i].left;
                    string temp1="'";
                    temp=temp+temp1;
                    p[i].right=p[i].right+temp;
                }
            }
        }

        string str="'";
        p[count1].left=p[0].left[0]+str;
        p[count1].right="ε";
    }

  // 对每一个非终结符迭代
    for ( int i = 0; i <= count; i++) {

      // 对每一个小于 i 的非终结符
        for (int j = 0; j < i; j++) {

          // 对每一个产生式
            for (int g = 0; g < n; g++) {

              // i 非终结符与第 g 产生式左边第一个字母相等
                if (q[i] == p[g].left[0]) {

          // g 产生式右边产生式第一个符号与第 j 个非终结符相等
                    if (p[g].right[0] == q[j]) {
                        for (int h = 0; h < n*n; h++) {
                            if (p[h].left[0] == q[j]
                              && int (p[h].left.length()) == 1) {
                                string str;
                                str = p[g].right.substr(
                                  1,
                                  int (p[g].right.length ()));
                                p[++count1].left = p[g].left;
                                p[count1].right = p[h].right + str;
                            }
                        }

                        p[g].left="";
                        p[g].right="";
                    }
                }
            }
        }
    }

  // 去除间接递归产生式
    for(int i = 0; i <= count; i++) {
        flag = 0;

        for (int j = 0; j < n*n; j++) {
            if (p[j].left[0] == q[i]) {
                if(p[j].left[0] == p[j].right[0]) {
                    flag++;
                }
            }
        }

        if (flag != 0) {
            for (int j = 0; j <= n*n; j++) {
                if (p[j].left[0] == q[i]) {
                    if (p[j].left[0] == p[j].right[0]) {
                        string str;
                        str = p[j].right.substr(1,int (p[j].right.length()));
                        string temp = p[j].left;
                        string temp1 = "'";
                        p[j].left = temp + temp1;
                        p[j].right = str + p[j].left;
                    } else {
                        string temp = p[j].left;
                        string temp1 = "'";
                        temp = temp + temp1;
                        p[j].right = p[j].right + temp;
                    }
                }
            }

            string str = "'";
            p[++count1].left = q[i] + str;
            p[count1].right = "ε";
        }
    }
}

int Delete(WF *p,int n) {
    return 0;
}

int main() {
    ofstream OutFile("result.txt");

    int i,
      j,
      flag = 0,
      count = 1,
      n;

    cout<<"请输入文法产生式个数n："<<endl;
    cin>>n;
    WF *p=new WF[50];
    cout<<"请输入文法的个产生式："<<endl;

  // input productions
    for (i = 0; i < n; i++) {
        cin>>p[i].left;
        cout<<"->"<<endl;
        cin>>p[i].right;
        cout<<endl;
    }
    cout<<endl;
    OutFile<<"即输入的文法产生式为："<<endl;

    // cout<<"即输入的文法产生式为："<<endl;
    for (i = 0; i < n; i++) {
        // cout<<p[i].left<<"-->"<<p[i].right<<endl;
        OutFile<<p[i].left<<"-->"<<p[i].right<<endl;
    }
    OutFile<<"*********************"<<endl;

    // cout<<"*********************"<<endl;
    char q[20];    // 对产生式的非终结符排序并存取在字符数组q
    q[0] = p[0].left[0]; // 把产生式的第一个非终结符存入q中

  // 对非终结符排序并存取
    for (i = 1; i < n; i++) {
        flag = 0;
        for (j = 0; j < i; j++) {
      // 根据j<i循环避免重复非终结符因此由标志位判断
            if(p[i].left==p[j].left) {
              flag++;
            }
        }

        if(flag==0) {
          // 没有重复加入q数组中
            q[count++]=p[i].left[0];
        }
    }
    count--;

  // 调用消除递归子函数
    Removing(p,q,n,count);
    // 删除无用产生式
    Delete(p,n);

    OutFile<<"消除递归后的文法产生式为："<<endl;
    // cout<<"消除递归后的文法产生式为："<<endl;
    for (i = 0; i <= count; i++) {
        for (int j = 0; j <= n*n; j++) {
            if ((p[j].left[0] == q[i]) && int (p[j].left.length ()) == 1) {
                OutFile<<p[j].left<<"-->"<<p[j].right<<endl;
        // cout<<p[j].left<<"-->"<<p[j].right<<endl;
            } else {
              continue;
            }
        }

        for (j = 0; j <= n*n; j++) {
            if((p[j].left[0] == q[i]) && int (p[j].left.length ()) == 2) {
                OutFile<<p[j].left<<"-->"<<p [j].right<<endl;
            // cout<<p[j].left<<"-->"<<p[j].right<<endl;
            } else {
              continue;
            }
        }
    }
    return 0;
}
```

### 非 LL(1) 文法

- ambiguous grammar
- left recursive grammar
- not left factored grammar(未提取展开式的公因子)
