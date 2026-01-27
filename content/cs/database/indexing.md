---
sidebar_position: 5
tags: [CS, Database, Indexing]
---

# Indexing

- primary mechanism to improve performance of database
- persist data structures stored in database (hash tables/B trees/B+ trees)
- trade off: `scale of database` and `workload(query/update rate)`
  as input of physical design advisors

```sql
CREATE INDEX IndexName on T(A)
CREATE INDEX IndexName on T(A1, A2, ..., An)
CREATE UNIQUE INDEX IndexName on T(A)
DROP INDEX IndexName
```
