---
sidebar_position: 2
tags: [CS, Database, Design, UML, ER]
---

# Design

## Database

- Massive
- Persistent
- Safe
- Multi-user
- Convenient
- Efficient
- Reliable

## UML

Unified Modeling Language: PlantUML

### Classes

for data modeling:

- add PK(primary key)
- drop methods

```cpp
-----------
| student |
|---------|
|sID   PK |
|sName    |
|GPA      |
|---------|
|<methods>|
-----------
```

### Associations

relationships between objects of 2 classes:

- one to one: `1..1 --- 1..1`.
- many to one: `* --- 1..1`
- one to many: `1..1 --- *`.
- many to many: `* --- *`.

```cpp
-----------                   ---------
| student |                   |college|
|---------|                   |       |
|sID   PK |x..y   Apply   m..n|       |
|sName    |-------------------|       |
|GPA      |                   |       |
|---------|                   |       |
|<methods>|                   |       |
-----------                   ---------
```

### Associations Classes

- classes store information of relationship edge between 2 data classes
- unnecessary if 0..1 or 1..1

```cpp
c1 * --- 1..1 c2
information of relationship edge can stored in c1
owing to every object of c1 only associated with 1 object of c2
```

### Subclasses

children classes

## Relational Algebra

### Operators

- select operator σ(sigma): `σ(sID < 100 ^ sAge > 20)Table_Name` set constraints
- project operator π(pi) : `π(sID, GPA)Table_Name` select certain columns
- cross-product operator x: Table1 x Table2,
  m tuples(rows) x n tuples(rows) => `m*n` tuples(rows)
- natural join operator ∞: σ(E1.A1 = E2.A1 ^ E1.A2 = E2.A2 ...) (E1 x E2)
- theta join operator ∞(condition): σ(condition) (E1 x E2), call condition as ϴ
- difference operator -: matching schemas => change rows/tuples
- union/intersection operator ∪ / ∩: matching schemas => change rows/tuples
- rename operator ρ: change schemas(attributes name),
  different schemas `<=>` same schemas (**union/intersection/self-join**)
- assign statement :=
- tree notation

```sql
π(sID, GPA) (σ(sID < 100 ^ GPA > 3.7) Student)
```

## Relational Design

### Decomposition

- start with mega-relations: including all attributes
- decompose into smaller relations(BCNF/4NF)

### Functional Dependencies

- A -> B => `1-1`/`n-1` mapping
- Key sets: closure of sets contains all attributes

Assuming relation `R(A, B, C, D, ..., G)` and closure of A, B `{A, B}`,
`A->C->D, B->E->F, F->G` => `{A, B}+ = {A, B, C, ..., G}`, then `{A, B}` is a key.
If no such closure exists, then treat all attributes as a key.

### BCNF

Boyce-codd normal form:

For each `A -> B` having `A` is super key && `B` isn't key,
`A -> B -> C` does not exist.
Here's the algorithm:

```cpp
/*
 * @brief fixed point algorithm just like most algorithms from compiler
 *
 * by decomposing to transform non-key dependent attributes to key dependent attributes
 */

compute FDs for R
compute key for R using its FDs

while (there is relation R' aren't in BCNF) {
    pick any R' with A -> B that violates BCNF (A is not its key)
    decompose R' into R1(A, B) and R2(A, rest)
    compute FDs for R1 and R2
    compute keys for R1 and R2 using their FDs
}
```

### Multi Valued Dependencies

- `A -> B && rest attributes` => `A ->> B`.
- `A ->> B` (1-n mapping), `A ->> C` (1-n mapping),
  no `B -> C`/`C ->> B`, `B * C` redundant tuples/rows.
- `A ->>B && A ->>C` => `A ->> B∩C`.
- `A ->>B && B ->>C` => `A ->> C-B`.

### 4NF

Fourth normal form:

If `A ->> B` then `A` is key && `B` isn't key,
here's the algorithm:

```cpp
/*
 * @brief fixed point algorithm just like most algorithms from compiler
 *
 * by decomposing to transform non-key dependent attributes to key dependent attributes
 */

compute FDs and MVDs for R
compute key for R using its FDs

while (there is relation R' aren't in 4NF) {
    pick any R' with A ->> B that violates 4NF(A is not its key)
    decompose R' into R1(A, B) and R2(A, rest)
    compute FDs and MVDs for R1 and R2
    compute keys for R1 and R2 using their FDs
}
```

### Normalized Design

- every row has the same number of columns
- every row has a unique key(PRIMARY KEY)
- everything in a row is all relevant to unique key
- everything in a row is all relevant to each other

:::note

- `(id, name, birth, major, grade)` normalized to `(id, name, birth)` + `(id, major, grade)`:
  `grade` is not relevant to `student id`.
- `(name, os, lang)` normalized to `(name, os)` + `(name, lang)`:
  `os` isn't relevant to `lang`.

:::
