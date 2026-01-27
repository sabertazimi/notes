---
sidebar_position: 11
tags: [Programming, Android, Storage, File, Database, Preference]
---

# Storage

## Files

`/data/data/<packageName>/files/`

Write

```java
String data = "Data to save";
FileOutputStream out = null;
BufferedWriter writer = null;
try {
    out = openFileOutput("data", Context.MODE_PRIVATE);
    writer = new BufferedWriter(new OutputStreamWriter(out));
    writer.write(data);
} catch (IOException e) {
    e.printStackTrace();
} finally {
    try {
        if (writer != null) {
            writer.close();
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

Read

```java
FileInputStream in = null;
BufferedReader reader = null;
StringBuilder content = new StringBuilder();
try {
    in = openFileInput("data");
    reader = new BufferedReader(new InputStreamReader(in));
    String line = "";
    while ((line = reader.readLine()) != null) {
        content.append(line);
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

return content.toString();
```

## Shared Preferences

`/data/data/<packageName>/shared_preferences/`

Write

```java
//get Editor
SharedPreferences.Editor editor = getSharedPreferences("data", MODE_PRIVATE).edit();
//store date
editor.putString("name", "Tom");
editor.putInt("age", 28);
editor.putBoolean("married", false);
//commit
editor.commit();
```

```java
editor.clear();
```

clear pref file content

Read

```java
SharedPreferences pref = getSharedPreferences("data", MODE_PRIVATE);
//second argument - default value if target key don't exists
String name = pref.getString("name", "");
int age = pref.getInt("age", 0);
boolean married = pref.getBoolean("married", false);
```

## SQLite

`/data/data/<package name>/databases/`

```java
@Override
onCreate()
@Override
public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
    switch (oldVersion) {
        case 1:
            db.execSQL(CREATE_CATEGORY);
        case 2:
            db.execSQL("alter table Book add column category_id integer");
        default:
    }
}
```

Custom 实现创建、升级数据库的逻辑
构建出 SQLiteOpenHelper 的实例后,再调用`getReadableDatabase()`或`getWritableDatabase()`方法创建数据库

### Create Table

```sql
create table Book (
    id integer primary key autoIncrement,
    author text,
    price real,
    pages integer,
    name text
    )
```

### Operators

- 创建一个新的数据库并返回一个 SQLiteDatabase 对象

```java
Context.createDatabase(String name,int version ,int mode,CursorFactory factory);
```

- 删除数据库

```java
this.deleteDatabase("myDatabase.db");
```

- 打开数据库

```java
SQLiteDatabase my_DataBase =
this.openOrCreateDatabase("myDateBase.db",MODE_PRIVATE , null);
my_DataBase.close();
```

- 非查询 SQL 指令

```java
//创建一个名为"test"并带两个参数的表
my_DataBase.execSQL("CREATE TABLE test (_id INTEGER PRIMARY KEY,
someNumber INTEGER);");
//在数据库中插入一个元组
my_DataBase.execSQL("INSERT INTO test (_id,someNumber) values(1,8);");

SQLiteDatabase db = dbHelper.getWritableDatabase();

//INSERT
ContentValues values = new ContentValues();
// 开始组装第一条数据
values.put("name", "The Da Vinci Code");
values.put("author", "Dan Brown");
values.put("pages", 454);
values.put("price", 16.96);
db.insert("Book", null, values); // 插入第一条数据
values.clear();
// 开始组装第二条数据
values.put("name", "The Lost Symbol");
values.put("author", "Dan Brown");
values.put("pages", 510);
values.put("price", 19.95);
db.insert("Book", null, values); // 插入第二条数据

//update
ContentValues values = new ContentValues();
values.put("price", 10.99);
db.update("Book", values, "name = ?", new String[] { "The DaVinci Code"  });

//delete
db.delete("Book", "pages > ?", new String[] { "500"  });

//删除表
my_DataBase.execSQL("DROP TABLE test");
```

- 查询 SQL 指令-游标 Cursors
  - `query()`

| 方法参数      | 对应 SQL 部分             | 描述                            |
| :------------ | :------------------------ | :------------------------------ |
| table         | from tableName            | 指定查询的表名                  |
| columns       | select column1, column2   | 指定查询的列名                  |
| selection     | where column = value      | 指定 where 的约束条件           |
| selectionArgs | -                         | 为 where 中的占位符提供具体的值 |
| groupBy       | group by column           | 指定需要 group by 的列          |
| having        | having column = value     | 对 group by 后的结果进一步约束  |
| orderBy       | order by column1, column2 | 指定查询结果的排序方式          |

```java
SQLiteDatabase db = dbHelper.getWritableDatabase();
// 查询Book表中所有的数据
Cursor cursor = db.query("Book", null, null, null, null, null, null);
// 遍历Cursor对象,取出数据
//cursor.moveToFirst()
//cursor.moveToNext()
String name = cursor.getString(cursor.getColumnIndex("name"));
String author = cursor.getString(cursor.getColumnIndex("author"));
int pages = cursor.getInt(cursor.getColumnIndex("pages"));
double price = cursor.getDouble(cursor.getColumnIndex("price"));
```

```java
//为了创建一个Cursor(游标),必须执行一个查询,要么通过SQL使用rawQuery()方法
//或是更精心设计的方法,像query()方法
Cursor cur = my_DataBase.rawQuery("SELECT * FORM test", null);

if(cur!=null) {//游标不为空
    //返回给定名称的列的基于0开始的index,如果该属性列不存在则返回-1
    //通过它们的index来检索属性值
    int numColumn=cur.getColumnIndex("someNumber");

    if(cur.moveToFirst()) {
        //cur.moveToFirst()让游标指向第一行,如果游标指向第一行,则返回true
        do {
        int num=cur.getInt(numColumn);//获得当前行该属性的值
        /*Cursor提供了不同的方法来回索不同的数据类型
        例如getInt(int index)/getString(int index)等等*/
        /*做一些事情*/
        } while (cur.moveToNext());
        /*游标移动到下一行,如果游标已经通过了结果集中的最后,
        即没有行可以移动时,则返回false*/
        //其他可能移动的是 previous() 和first()方法
    }
}
```

### Transactions

- SQLiteDatabase 的`beginTransaction()`方法
- 调用`setTransactionSuccessful()`表示事务已经执行成功
- finally 代码块中调用`endTransaction()`来结束事务

## Content Provider

### Read

```java
Uri uri = Uri.parse("content://com.example.app.provider/table1");
getContentResolver().query/insert/delete/update();
```

- ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME
- ContactsContract.CommonDataKinds.Phone.NUMBER

### Provide

With ContentProvider:

```java
public class MyProvider extends ContentProvider {
    @Override
    public boolean onCreate() {
        return false;
    }
    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
      String[] selectionArgs, String sortOrder) {
        return null;
    }
    @Override
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }
    @Override
    public int update(Uri uri, ContentValues values, String selection,
      String[] selectionArgs) {
        return 0;
    }
    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return 0;
    }
    @Override
    public String getType(Uri uri) {
        return null;
    }
}
```

```java
UriMatcher.addURI(uri, customNumber)/.match(uri)
```

- 为传入 URI 指定自定义常量作为代号
