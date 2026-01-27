---
sidebar_position: 12
tags: [Web, Security, SQL, Injection, Vulnerability]
---

# SQL Injection

## Attack

User input `' OR 1=1--`:

```sql
SELECT *
  FROM users
 WHERE email = 'user@email.com'
   AND pass  = '' OR 1=1--' LIMIT 1
```

## Protection

- Don't allow multiple statements.
- Validate user input: **是否存在/数据类型/取值范围/缺省值/正则表达式/特殊字符**.
- Allowlist user input.
- Least privilege principle:
  allow `SELECT`/`INSERT`/`UPDATE`/`DELETE` on certain data,
  forbidden `CREATE`/`DROP`/`MODIFY`.
- Use mature object-relational mapping (ORM) library:
  built-in SQL injection protection feature,
  `users.findBy({ email: "billy@gmail.com" })`.
- Parameterized statements: use placeholders instead of variable interpolation.

```sql
-- Construct the SQL statement we want to run, specifying the parameter.
Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
Statement statement = connection.createStatement();
String sql = "SELECT * FROM users WHERE email = ? and encrypted_password = ?";
statement.executeQuery(sql, email, password);
```
