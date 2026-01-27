---
sidebar_position: 21
tags: [CS, Compiler, GC, Memory]
---

# Garbage Collection

## Mark and Sweep

- mark phase: traces reachable objects (mark_bit |= 1)

```haskell
let todo = {all roots}
while todo != nil do
    pick v <- todo
    todo -= {v}
    if mark(v) == 0 then
        mark(v) |= 1
        let v1, ..., vn be the pointers contained in v
        todo += {v1, ..., vn}
    fi
od
```

- sweep phase: collects garbage objects (mark_bit == 0)

```haskell
p = bottom of heap
while p < top of heap do
    if mark(p) == 1 then
        mark(p) = 0
    else
        add block p...(p + sizeof(p) - 1)  to freeList
    fi
    p += sizeof(p)
od
```

## Stop and Copy

Copy all reachable objects in old space to new space(reserved for GC):

- Copied objects
- Scanned objects: pointers have been restored
