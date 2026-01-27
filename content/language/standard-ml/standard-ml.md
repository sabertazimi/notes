---
tags: [Language, Standard ML, Functional Programming]
---

# Standard ML

## Functions

```haskell
syntax: fun name (arg1: type1, .., argN: typeN) = body
type: name = type1 * ... * typeN -> body_type
lazy evaluation
```

## Tuples

```haskell
(* tuples *)
syntax: e = (e1, ..., en)
type: e1 * ... * en (can become fun's arguments list)
evaluation: #1 e, #2 e, ..., #n e
```

## Lists

```haskell
(* lists *)
syntax: l = [e1, ..., en]
type: [] = elem_type list; hd(head) l = elem_type, tl(tail) x = elem_type list
evaluation: cons = e :: l; null [] = false;

> 6 :: [1, 3, 5]
```

## Let Expressions

```haskell
syntax: let
            b1 b2 ... bn
        in
            body
        end
type: whole let type = body_type
evaluation: whole let result = body_result
```

## Options

- NONE : type = 'a option
- SOME e: type = `e_type` option
- isSome: type = 'a option -> bool
- valOf : type = 'a option -> 'a

## Boolean Operations

- e1 andalso e2: keyword
- e1 orelse e2 : keyword
- not e1 : bool -> bool
- `=`(equal) `<>`(not equal) `>` `<` `>=` `<=`: require two same type elem

## Closure

### Lexical Scope vs Dynamic Scope

- Lexical scope: function where defined.
- Dynamic scope: function where called.

### Compose and Pipeline

```haskell
fun sqrt_of_abs = Math.sqrt o Real.fromInt o abs

infix !>
fun x !> f = f x

fun sqrt_of_abs i = i !> abs !> Real.fromInt !> Math.sqrt
```

### Curry and UnCurry

```haskell
fun carry f x y = f (x, y)
fun unCarry f (x, y) = f x y

fun range (i, j) = if i > j then [] else i :: range(i+1, j)
fun countUp = curry range 1

val arr = countUp 7 (* maps to [1, 2, ..., 7] *)
```
