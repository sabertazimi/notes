---
sidebar_position: 10
tags: [CS, Compiler, Semantic, TypeChecking, SymbolTable]
---

# Semantic Analysis

:::tip

```mermaid
flowchart LR
    A["AST + Semantic of Language"] -->|Semantic Analysis| B["Intermediate"]
```

:::

e.g. 变量/函数必须先声明再使用; 每个表达式必须有合适类型(左值/右值); 函数调用与函数定义保持一致(函数签名)

- 声明检查(identifiers declaration)
- 定义检查:
  - class 仅可定义一次
  - method 在同一 class 中仅可定义一次
- 类型检查(types)
- 作用域检查
- 继承关系(inheritance relationships)
- 上下文**相关**分析(检查抽象语法树上下文相关的属性)

```cpp
P: D S
 ;

D: T id ';' D
 |
 ;

T: int
 | bool
 ;

S: id = E
 | printi (E)
 | printb (E)
 ;

E: n
 | id
 | true
 | false
 | E + E
 | E && E
 ;
```

## 类型系统

### Type Checking

`├ e: T` means e 可计算为类型为 T 的值

### Type Environments

- Object(identifier) = Type
- `O` Type environments 是一个函数, 将 object identifiers 映射成 types
- `O ├ e: T` 表示在 O 函数作用下, 可证明 e 的类型为 T

```cpp
// input x
// output T
O[T/x](x) = T

O[T/x](y) = O(y)
```

```cpp
[Var]
O(x) = T
----------
O ├ x: T

[Let without Init]
O[T0/x] ├ e1: T1
--------------------
O ├ let x: T0 in e1: T1
```

### Typing Methods

- Method(ClassName, functionName) = (Type1, ..., Type_n, Type_n+1)
- Type_n+1 为返回值的类型, 即方法自身的类型

```cpp
[Dispatch]
O,M ├ e0: T0
O,M ├ e1: T1
...
O,M ├ en: Tn
M(T0, func) = (T1', ..., Tn', Tn+1')
Ti <= Ti'
----------
O,M ├ e0.func(e1, ..., en): Tn+1'
```

## 符号表

用来存储程序中变量的相关信息:

- 类型: 字典结构 (key, type)
- 作用域:
  - 进入作用域, 插入元素(插入哈希表首, 屏蔽外部同名变量); 离开作用域, 删除元素
  - 进入作用域, 压入新符号表; 离开作用域, 弹出栈顶符号表
- 访问控制权
- 命名空间: 变量, 标签, 形参, 标号 各自拥有一类符号表

可将符号表实现为:

- 哈希表: 查找时间复杂度 O(1);
- 红黑树: 查找时间复杂度 O(lg N);

```cpp
#ifndef XX_SEMANTIC_TABLE_H
#define XX_SEMANTIC_TABLE_H

typedef enum type type_t;
typedef char * key_t;    // typedef int hash_t; typedef hash_t key_t;
typedef struct value {
  type_t type;
  scope_t scope;
} value_t;

typedef ... table_t;// 符号表数据结构

table_t new_table(void);
int table_insert(table_t table, key_t id, value_t info);
value_t table_search(table_t table, key_t id);

#endif
```

## 类型检查

- table: 字典结构 (key, type) (Hash Table/Red Black Tree)
- type environment(Object, Methods, Class)
  is passed from parent to child(down the tree)
- types are passed from child to parent(up the tree)

```cpp
TypeCheck(Environment/OMC, e1+e2) = {
    T1 = TypeCheck(OMC, e1);
    T2 = TypeCheck(OMC, e2);
    Check T1 == T2 == Int;
    return Int;
}

TypeCheck(OMC, let x: T <- e0 in e1) = {
    T0 = TypeCheck(OMC, e0);
    T1 = TypeCheck(OMC.add(O(x)=T), e1);
    Check subtype(T0, T1);  // T0 <= T1
    return T1;
}
```

```cpp
enum type {INT, BOOL};
table_t table;// symbol table

// dec_t, stm_t, exp_t: AST 中的结点

enum type check_prog(dec_t d, stm_t s) {
  // 生成符号表
  table = check_dec(d);
  // 根据符号表检查语句
  return check_stm(s);
}

// 生成符号表
table_t check_dec(dec_t d){
  foreach(T id <- d) {
    table_insert(table, id, T);
  }
}

enum type check_stm(table_t table, stm_t s) {
  switch (s->kind) {
    case STM_ASSIGN:
      t1 = table_search(table, id);
      t2 = check_exp(table, s->exp);
      if (t1 != t2) {
        throw new SemanticError("type mismatch");
      } else {
        return t1;
      }
    case STM_PRINTI:
      t = check_exp(s->exp);
      if (t != INT) {
        throw new SemanticError("type mismatch");
      } else {
        return INT;
      }
    case STM_PRINTB:
      t = check_exp(s->exp);
      if (t != BOOL) {
        throw new SemanticError("type mismatch");
      } else {
        return BOOL;
      }
  }
}

enum type check_exp(exp_t e) {
  switch (e->kind) {
    case EXP_INT:
      return INT;
    case EXP_ID:
      t = table_search(table, id);// 查询符号表, 得到变量类型
      if (id not exist) {
        throw new SemanticError("id not found");
      } else {
        return t;
      }
    case EXP_TRUE:
      return BOOL;
    case EXP_FALSE:
      return BOOL;
    case EXP_ADD:
      enum type t1 = check_exp_type(e->left);
      enum type t2 = check_exp_type(e->right);
      if (t1 != INT || t2 != INT) {
        throw new SemanticError();
        break;
      } else {
        return INT;
      }
    case EXP_AND:
      enum type t1 = check_exp_type(e->left);
      enum type t2 = check_exp_type(e->right);
      if (t1 != BOOL || t2 != BOOL) {
        throw new SemanticError();
        break;
      } else {
        return BOOL;
      }
    default:
      throw new SemanticError();
      break;
  }
}
```
