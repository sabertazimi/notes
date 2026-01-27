---
sidebar_position: 20
tags: [CS, Compiler, CodeGen, Stack, Register]
---

# Code Generation

为数据分配计算资源:

- 数据: 全局变量, 局部变量, 动态分配变量
- 资源: 寄存器(register), 数据区(.data, .bss), 代码区(.code), 栈区(runtime stack), 堆区(user heap)

> 当前局部变量应该放在寄存器还是内存区?

为代码选择计算指令(等价性):

- 代码: 表达式/语句/函数代码
- 指令: 算术/比较/跳转/调用/返回指令

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

## 递归下降

### 栈计算机

Mem + Stack + ALU

> JVM(Java Virtual Machine)

```cpp
s: push NUM
 | load x
 | store x
 | add
 | sub
 | times
 | div
 ;
```

```cpp
gen_prog(dec_t d, stm_t s) {
  gen_dec(d);
  gen_stm(s);
}

gen_dec(T id; D) {
  // stack_code(".int id")
  gen_type(T);
  emit(" id");

  gen_dec(D);
}

gen_type(type_t t) {
  switch(t-kind) {
    case INT:// fall through
    case BOOL:
      emit(".int");
      break;
  }
}

gen_stm(stm_t s) {
  switch (s->kind) {
    STM_ASSIGN:
      gen_exp(s->exp);
      emit("store s->id");
      break;
    STM_PRINTI:
      gen_exp(s->exp);
      emit("printi");
      break;
    STM_PRINTB:
      gen_exp(s->exp);
      emit("printb");
      break;
  }
}

gen_exp(exp_t e) {
  switch (e->kind) {
    case EXP_INT:
      emit("push e->value");// n
      break;
    case EXP_ID:
      emit("load e->value");// id
      break;
    case EXP_BOOL:
      emit("push e->value");// 1/0
      break;
    case EXP_ADD:
      gen_exp(e->left);
      gen_exp(e->right);
      emit("add");
      break;
    case EXP_AND:
      gen_exp(e->left);
      gen_exp(e->right);
      emit("and");
      break;
  }
}
```

### 寄存器计算机

Mem + Reg + ALU

> MIPS ISA

```cpp
// src -> dist
s: mov_n n, r
 | mov r1, r2
 | load [x], r
 | store r, [x]
 | add r1, r2, r3
 | sub r1, r2, r3
 | times r1, r2, r3
 | div r1, r2, r3
```

```cpp
void gen_prog(dec_t d, stm_t s) {
  gen_dec(d);
  gen_stm(s);
}

void gen_dec(T id; D) {
  // reg_code(".int id")
  // 为变量分配寄存器
  gen_type(T);
  emit(" id");

  gen_dec(D);
}

void gen_type(type_t t) {
  switch(t-kind) {
    case INT:// fall through
    case BOOL:
      emit(".int");
      break;
  }
}

void gen_stm(stm_t s) {
  switch (s->kind) {
    STM_ASSIGN:
      r = gen_exp(s->exp);
      emit("mov r, e->id");
      break;
    STM_PRINTI:
      r = gen_exp(s->exp);
      emit("printi r");
      break;
    STM_PRINTB:
      r = gen_exp(s->exp);
      emit("printb r");
      break;
  }
}

reg_t gen_exp(exp_t e) {
  switch (e->kind) {
    case EXP_INT:
      r = random_reg();
      emit("mov_n e->value, r");// n
      return r;
    case EXP_ID:
      r = random_reg();
      emit("mov e->value, r");// id
      return r;
    case EXP_BOOL:
      r = random_reg();
      emit("mov_n e->value, r");// 1/0
      return r;
    case EXP_ADD:
      r1 = gen_exp(e->left);
      r2 = gen_exp(e->right);
      r = random_reg();
      emit("add r1, r2, r");
      return r;
    case EXP_AND:
      r1 = gen_exp(e->left);
      r2 = gen_exp(e->right);
      r = random_reg();
      emit("and r1, r2, r");
      return r;
  }
}
```
