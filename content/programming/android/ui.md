---
sidebar_position: 3
tags: [Programming, Android, UI, Layout, Component]
---

# UI

:::tip

N activities can respond to a particular intent:

Android will pop(弹出) up a little dialogue list(对话框) to
user showing application icon defining the intent

当有多个活动可相应某个特定意图时，系统将会弹出对话框提示用户选择一个应用的活动或者设定默认值 (default)

e.g. web browsers

```html
<intent-filter>
  <action android:name="android.intent.action.MAIN" />
  <category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
```

:::

## Layout

- `android:layout_weight` 自适配布局
- `android:SingleLine` 单行显示模式
- `android:ellipsize="end"` 文字过多时缩略方式

LayoutInflater 作用是将 layout 的 xml 布局文件实例化为 View 类对象。

```java
View view = LayoutInflater.from(context).inflate(R.layout.title, this/null);
```

### Table

- `<TableLayout android:stretchColumns="1">` 拉伸第 2 列
- `android:layout_span="2"` 占 2 列

## Component

View(ViewGroup): e.g. button、textbox(文本框)、checkbox(复选框)

### AlertDialog

```java
//builder pattern
AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(context);

dialogBuilder.setTitle("Warning");
dialogBuilder.setMessage("You are forced to be offline. Please try to login again.");
dialogBuilder.setCancelable(false);
dialogBuilder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which) {
        ActivityCollector.finishAll(); // 销毁所有活动
        Intent intent = new Intent(context, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent); // 重新启动LoginActivity
    }
});

AlertDialog alertDialog = dialogBuilder.create();

// 需要设置AlertDialog的类型,保证在广播接收器中可以正常弹出
alertDialog.getWindow().setType(WindowManager.LayoutParams.TYPE_SYSTEM_ALERT);

alertDialog.show();
```

### List View

```java
ArrayAdapter<String> adapter = new ArrayAdapter<String>(
    MainActivity.this, android.R.layout.simple_list_item_1, data
);
listView.setAdapter(adapter);
```

#### Custom Layout

- Custom class
- Custom Sub Xml(单项)
- Custom ArrayAdapter
  - 重写构造函数
  - 重写 getView 方法
    - 重用 convertView 提升性能
    - ViewHolder 提升性能

```java

//内部类，其中字段与自定义class的字段一致
class ViewHolder {
    ImageView fruitImage;
    TextView fruitName;
}
public FruitAdapter(
  Context context,
  int textViewResourceId,
  List<Fruit> objects) {
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

#### Listener

```java
listView.setOnItemClickListener(new OnItemClickListener() {
    @Override
    public void onItemClick(
      AdapterView<?> parent,
      View view,
      int position,
      long id) {
        Fruit fruit = fruitList.get(position);
        Toast.makeText(MainActivity.this, fruit.getName(), Toast.LENGTH_SHORT).show();
    }
});

adapter.notifyDataSetChanged();           // 当有新消息时,刷新ListView中的显示
msgListView.setSelection(msgList.size()); // 将ListView定位到最后一行
```

### Customization

custom XML

title.xml

```html
<LinearLayout
  xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="wrap_content"
  android:background="@drawable/title_bg"
>
  <button
    android:id="@+id/title_back"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_gravity="center"
    android:layout_margin="5dip"
    android:background="@drawable/back_bg"
    android:text="Back"
    android:textColor="#fff"
  />
  <TextView
    android:id="@+id/title_text"
    android:layout_width="0dip"
    android:layout_height="wrap_content"
    android:layout_gravity="center"
    android:layout_weight="1"
    android:gravity="center"
    android:text="Title Text"
    android:textColor="#fff"
    android:textSize="24sp"
  />
  <button
    android:id="@+id/title_edit"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_gravity="center"
    android:layout_margin="5dip"
    android:background="@drawable/edit_bg"
    android:text="Edit"
    android:textColor="#fff"
  />
</LinearLayout>
```

custom class

```java
public class TitleLayout extends LinearLayout {
    public TitleLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
        LayoutInflater.from(context).inflate(R.layout.title, this);

        //Register button click Listener
        titleBack.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                ((Activity) getContext()).finish();
            }
        });
        titleEdit.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getContext(), "You clicked Edit button", Toast.LENGTH_SHORT).show();
            }
        });

        //other awesome things
        //like material design ripple effect
        //animations and music
    }

}
```

## Drawable

修改特定组件的背景颜色

```java
Resources myColor = getBaseContext().getResources();
// getBaseContext()获得基础Context
// getResources()获得资源
Drawable color_M = myColor.getDrawable(R.color. lightGreen);
// 由资源 myColor来获得Drawable
// R.color.lightGreen是颜色值的ID引用
text.setBackgroundDrawable(color_M);
//设置背景
```
