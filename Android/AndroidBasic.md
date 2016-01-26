
# Android Framework

## Dalvik virtual machine
1. register-based machine
基于寄存器(不写入内存)
2. minimizeing instruction diapath and memory accesses
最小化指令分配黑内存访问
3. giving more efficient instruction stream(a lot more semantic content)
提供更加高效的指令流

## Basic Building Blocks
1. Activity(Managed by activity stack)
2. Service(Running in the background;with no UI)
3. Broadcast Receiver(Can invoke(调用) activity;with no UI)
4. Content Provider(accessing and managing application data)

---

# Android Studio

## Plugins
### Code generator
- Constructor
- getter/setter
- ViewHolder
- Parcelable Implemention

# Activity

## BaseActivity

查看当前界面属于哪个Activity，自定义Activity继承BaseActivity

```java
public class BaseActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("BaseActivity", getClass().getSimpleName());
    }
}
```

## Activity Collector
在所有Activity的onCreate方法调用静态的addActivity方法，onDestroy方法调用静态的removeActivity方法。

- `ActivityCollector.addActivity(this);`
- `ActivityCollector.removeActivity(this);`

```java
public class ActivityCollector {

    public static List<Activity> activities = new ArrayList<Activity>();

    public static void addActivity(Activity activity) {
        activities.add(activity);

    }

    public static void removeActivity(Activity activity) {
        activities.remove(activity);

    }

    public static void finishAll() {
        for (Activity activity : activities) {
            if (!activity.isFinishing()) {
                activity.finish();
            }
        }
    }
}
```

## StartActivity

为每个Activity添加静态的actionStart方法，供其他Activity启用此Activity

```java
public static void actionStart(Context context, String data1, String data2) {
    Intent intent = new Intent(context, thisActivity.class);
    intent.putExtra("param1", data1);
    intent.putExtra("param2", data2);
    context.startActivity(intent);
}
```

---

    
# UI Design

> N activities can respond to a particular intent:
Android will pop(弹出) up a little dialogue list(对话框) to user showing application icon defining the intent

当有多个活动可相应某个特定意图时，系统将会弹出对话框提示用户选择一个应用的活动或者设定默认值(default)

e.g web browsers

```html
<intent-filter>
<action android:name="android.intent.action.MAIN" />
<category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
```

## Layout
### Basic
- `android:layout_weight`
自适配布局
### TableLayout
- `<TableLayout android:stretchColumns="1">` 拉伸第2列
- `android:layout_span="2"` 占2列

### Custom Layout

LayoutInflater作用是将layout的xml布局文件实例化为View类对象。
```java
View view = LayoutInflater.from(context).inflate(R.layout.title, this/null);
```

## Component
View(ViewGroup): e.g button、textbox(文本框)、checkbox(复选框)

### ListView

```java
ArrayAdapter<String> adapter = new ArrayAdapter<String>(
    MainActivity.this, android.R.layout.simple_list_item_1, data
);
listView.setAdapter(adapter);
```
#### Custom ListView Layout

- Custom class
- Custom Sub Xml(单项)
- Custom ArrayAdapter
  - 重写构造函数
  - 重写getView方法 
    - 重用convertView提升性能
    - ViewHolder提升性能
```java

//内部类，其中字段与自定义class的字段一致
class ViewHolder {
    ImageView fruitImage;
    TextView fruitName;
}
public FruitAdapter(Context context, int textViewResourceId, List<Fruit> objects) {
    super(context, textViewResourceId, objects);
    resourceId = textViewResourceId;
}

@Override
public View getView(int position, View convertView, ViewGroup parent) {

    Fruit fruit = getItem(position); // 获取当前项的Fruit实例
    View view;
    ViewHolder viewHolder;

    //大幅提升性能
    if (convertView == null) {
        view = LayoutInflater.from(getContext()).inflate(resourceId, null);

        viewHolder = new ViewHolder();
        viewHolder.fruitImage = (ImageView) view.findViewById(R.id.fruit_image);
        viewHolder.fruitName = (TextView) view.findViewById(R.id.fruit_name);
        view.setTag(viewHolder); // 将ViewHolder存储在View中

    } else {
        view = convertView;
        viewHolder = (ViewHolder) view.getTag(); // 重新获取ViewHolder
    }
    
    ImageView fruitImage = (ImageView) view.findViewById(R.id.fruit_image);
    TextView fruitName = (TextView) view.findViewById(R.id.fruit_name);
    fruitImage.setImageResource(fruit.getImageId());
    fruitName.setText(fruit.getName());
    return view;
}

```

#### Custom ListView Listener

```java
listView.setOnItemClickListener(new OnItemClickListener() {
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        Fruit fruit = fruitList.get(position);
        Toast.makeText(MainActivity.this, fruit.getName(), Toast.LENGTH_SHORT).show();
    }
});
```

## Drawable
1. 修改特定组件的背景颜色
```java
Resources myColor=getBaseContext().getResources();
//getBaseContext()获得基础Context
//getResources()获得资源
Drawable color_M=myColor.getDrawable(R.color. lightgreen );
//由资源 myColor来获得Drawable
R.color.lightgreen是颜色值的ID引用
text.setBackgroundDrawable(color_M);
//设置背景
```

---

# NetWork                     
Networked Apps
1. Network latency(网络延迟)——UI thread seperated from data loading thread
2. Battery drain(电池耗尽)
3. Intermittent service(中断服务)

---

# DataBase

## Basic Operator

1. 创建一个新的数据库并返回一个 SQLiteDatabase 对象
```java
Context.createDatabase(String name,int version ,int mode,CursorFactory factory);
```
2. 删除数据库
```java
this.deleteDatabase("myDatabase.db");
```
3. 打开数据库
```java
SQLiteDatabase my_DataBase = 
this.openOrCreateDatabase("myDateBase.db",MODE_PRIVATE , null);
my_DataBase.close();
```
4. 非查询SQL指令
```java
//创建一个名为"test"并带两个参数的表
my_DataBase.execSQL("CREATE TABLE test (_id INTEGER PRIMARY KEY,
someNumber INTERGER);");
//在数据库中插入一个元组
my_DataBase.execSQL("INSERT INTO test (_id,someNumber) values(1,8);");
//删除表
my_DataBase.execSQL("DROP TABLE test");
```
5. 查询SQL指令-游标Cursors
```java
//为了创建一个Cursor(游标),必须执行一个查询,要么通过SQL使用rawQuery()方法
//或是更精心设计的方法,像query()方法
Cursor cur=my_DataBase.rawQuery("SELECT * FORM test", null);

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

---

