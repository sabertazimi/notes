---
sidebar_position: 10
tags: [CS, Database, SQL]
---

# SQL

:::note

Data-intensive applications may not use `DBMS` or query language at all,
e.g. Hadoop, all operations on data stores in files.

:::

## CRUD

增删查改:

```sql
-- 插入
INSERT INTO table_name (column_name) VALUES (sql_value);

-- 删除
DELETE FROM table_name WHERE column_name = sql_value;

-- 查询
SELECT * FROM table_name WHERE column_name = sql_value;

-- 更新
UPDATE table_name SET column1 = value1 WHERE column2 = value2;
```

## Table

```sql
-- 添加列
ALTER TABLE table_name ADD COLUMN column_name;

-- 删除列
ALTER TABLE table_name DROP COLUMN column_name;

-- 修改列
ALTER TABLE table_name MODIFY COLUMN column_name;

-- 重命名列
ALTER TABLE table_name RENAME COLUMN column_name TO new_column_name;

-- 重命名表
ALTER TABLE table_name RENAME TO new_table_name;
```

## Where

- `=`
- `<>`
- `>`
- `>=`
- `<`
- `<=`
- `NOT`
- `AND`
- `OR`
- `IN (collection)`
- `BETWEEN value1 AND value2`
- `LIKE '%王_'`
- `REGEXP 'regexp'`
- `IS NULL`
- `IS NOT NULL`

## Order

排序:

```sql
ORDER BY column_name [ASC|DESC]
```

## Group

分组:

```sql
GROUP BY column_name [HAVING condition]
```

## Aggregation

聚合函数:

```sql
AVG(column_name)

COUNT(column_name)

MAX(column_name)

MIN(column_name)

SUM(column_name)
```

## Limit

限制数量:

```sql
LIMIT [offset,] length
```

## Distinct

去重:

```sql
DISTINCT column_name
```

## Set

并集:

```sql
query UNION query
```

交集:

```sql
query INTERSECT query
```

差集:

```sql
query EXCEPT query
```

## Join

表关联:

```sql
-- 内连接
INNER JOIN table_name ON condition

-- 左连接
LEFT JOIN table_name ON condition

-- 右连接
RIGHT JOIN table_name ON condition

-- 外连接
OUTER JOIN table_name ON condition
```

## Index

索引:

```sql
CREATE [UNIQUE|FULLTEXT|SPATIAL] INDEX index ON table_name (column1, column2, ...);

DROP INDEX index ON table_name;

SHOW INDEX FROM table_name;

ALTER TABLE table_name ADD INDEX index (column1, column2, ...);
```

## Export and Import

```bash
mysqldump -u <user> -p<password> <database> > sync.sql
mysql -u <user> -p<password> <database> < sync.sql
```

## View

视图:

- Logical layer: hiding data from users
- Modularity and reuse of query

```sql
CREATE VIEW view AS query;

DROP VIEW view;

ALTER VIEW view AS query;
```

```sql
DROP VIEW IF EXISTS Standings;
DROP VIEW IF EXISTS Count;
DROP VIEW IF EXISTS Wins;
DROP TABLE IF EXISTS Matches;
DROP TABLE IF EXISTS Players;

-- Players Table
CREATE TABLE Players (
  id SERIAL primary key,
  name varchar(255)
);

-- Matches Table
CREATE TABLE Matches (
  id SERIAL primary key,
  player int references Players(id),
  opponent int references Players(id),
  result int
);

-- Wins View shows number of wins for each Player
CREATE VIEW Wins AS
  SELECT Players.id, COUNT(Matches.opponent) AS n
  FROM Players
  LEFT JOIN (SELECT * FROM Matches WHERE result>0) as Matches
  ON Players.id = Matches.player
  GROUP BY Players.id;

-- Count View shows number of matches for each Player
CREATE VIEW Count AS
  SELECT Players.id, Count(Matches.opponent) AS n
  FROM Players
  LEFT JOIN Matches
  ON Players.id = Matches.player
  GROUP BY Players.id;

-- Standings View shows number of wins and matches for each Player
CREATE VIEW Standings AS
  SELECT Players.id,Players.name,Wins.n as wins,Count.n as matches
  FROM Players,Count,Wins
  WHERE Players.id = Wins.id and Wins.id = Count.id;
```

Owing to views are logical layer, it's senseless to modify data on views:

```sql
CREATE TRIGGER TriggerName
INSTEAD OF DELETE/UPDATE OF/INSERT ON ViewName
[ referencing-variables ]
[ FOR EACH ROW ]
WHEN ( Condition )
[ BEGIN ]
Action
[ END ];
```

- `SELECT` (no `DISTINCT`) on single table `T`
- No `GROUP BY/HAVING` or aggregation
- Attributes can't be `NULL` or default values
- Sub-queries can't refer to table `T`

## MySQL

### Container

Setup in [Docker](https://github.com/dromara/RuoYi-Vue-Plus/blob/5.X/script/docker/docker-compose.yml):

```yml
services:
  mysql:
    image: mysql:8.0.33
    container_name: mysql
    restart: unless-stopped
    environment:
      # 时区上海
      TZ: Asia/Shanghai
      # root 密码
      MYSQL_ROOT_PASSWORD: 123456
      # 初始化数据库
      MYSQL_DATABASE: ry-vue
    ports:
      - '3306:3306'
    volumes:
      # 配置挂载
      - ./docker/mysql/conf:/etc/mysql/conf.d/
      - ./docker/mysql/conf/ry.cnf:/etc/mysql/conf.d/ry.cnf:ro
      # 数据挂载
      - ./docker/mysql/data:/var/lib/mysql/
      # 日志挂载
      - ./docker/mysql/logs:/var/log/mysql
      # 数据库初始化
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
      # 数据库脚本
      - ./docker/mysql/sql:/opt/mysql/sql
    privileged: true
    command:
      # 将mysql8.0默认密码策略 修改为 原先 策略 (mysql8.0对其默认策略做了更改 会导致密码无法匹配)
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
```

[允许外部连接](https://cloud.tencent.com/developer/article/2356690):

```bash
mysql -uroot -proot
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;
FLUSH PRIVILEGES;
chmod 644 /etc/mysql/conf.d/mysql.cnf
mysql -h 127.0.0.1 -P 3306 -uroot -proot
```

### Infrastructure

![MySQL Server Layer](./figures/mysql-server-layer.png 'MySQL Server Layer')

![MySQL Infrastructure](./figures/mysql-infrastructure.jpg 'MySQL Infrastructure')
