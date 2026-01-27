---
sidebar_position: 6
tags: [CS, Database, ACID, Transaction, Integrity, Trigger]
---

# Transactions

- A sequence of one or more SQL operations treated as a unit
- Target: concurrency and failures recovery

## Standard

- all or nothing(atomicity)
- transaction begins automatically on first SQL statement
- on "commit": old transaction ends, new one begins
- on session termination: current transaction ends
- "AutoCommit" turns each statement into transaction

## ACID

- Atomicity(Logging)
- Consistency
- Isolation: guarantee serializability(Locking)
- Durability(Logging)

### Isolation Level

weaker isolation level: read uncommitted < read committed < repeatable read < serializable

- increased concurrency + decreased overhead = increased performance
- weaker consistency guarantees
- some system default: repeatable read

```sql
SET TRANSACTION READ ONLY;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

## Integrity Constraints

```sql
CREATE TABLE TableName (
    ... PRIMARY KEY,
    ... UNIQUE,
    ... CHECK (Condition),
    ... references TableName(ForeignKey),
    ... references TableName(ForeignKey) ON DELETE/UPDATE RESTRICT/SET NULL/CASCADE,
    ... ,
    PRIMARY KEY (Attr1, Attr2, ...),
    UNIQUE (Attr1, Attr2, ...),
    CHECK (Condition),
    FOREIGN KEY (Attr1, Attr2, ...) references
      TableName(Bttr1, Bttr2, ...) [ ON ... (default RESTRICT) ]
);

CREATE ASSERTION AssertionName
CHECK (Condition);
```

## Triggers

DBMS level constraints:

```sql
CREATE TRIGGER TriggerName
BEFORE|AFTER|INSTEAD OF Events(INSERT/UPDATE OF/DELETE ON TableName)
[ referencing-variables ]
[ FOR EACH ROW ]
WHEN ( Condition )
[ BEGIN ]
Action
[ END ];

CREATE TRIGGER Cascade
After DELETE ON S
REFERENCING OLD ROW AS O
FOR EACH ROW
DELETE FROM R WHERE A = O.B (R.A = S.B)

CREATE TRIGGER Cascade
After DELETE ON S
REFERENCING OLD TABLE AS OT
DELETE FROM R WHERE A IN (SELECT B FROM BT)
```
