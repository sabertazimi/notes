---
sidebar_position: 2
tags: [Programming, Android, Lifecycle, Activity, Fragment]
---

# Lifecycle

## Activity

### Base

查看当前界面属于哪个 Activity，自定义 Activity 继承 BaseActivity

```java
public class BaseActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("BaseActivity", getClass().getSimpleName());
    }
}
```

### Collector

在所有 Activity 的 onCreate 方法调用静态的 addActivity 方法，onDestroy 方法调用静态的 removeActivity 方法。

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

### Start

为每个 Activity 添加静态的 actionStart 方法，供其他 Activity 启用此 Activity

```java
public static void actionStart(Context context, String data1, String data2) {
    Intent intent = new Intent(context, thisActivity.class);
    intent.putExtra("param1", data1);
    intent.putExtra("param2", data2);
    context.startActivity(intent);
}
```

## Fragment

android.app.Fragment

### XML

```html
<fragment
  android:id="@+id/right_fragment"
  android:name="com.example.fragmentTest.RightFragment"
  android:layout_width="0dp"
  android:layout_height="match_parent"
  android:layout_weight="1"
></fragment>
```

### Create

```java
@Override
public View onCreateView(
  LayoutInflater inflater,
  ViewGroup container,
  Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.left_fragment, container, false);
    return view;
}
```

### Add

```java
AnotherRightFragment fragment = new AnotherRightFragment();
FragmentTransaction transaction = getFragmentManager.beginTransaction();

//容器的 id 和待添加的碎片实例
transaction.replace(R.id.right_layout, fragment);
//模拟返回栈
transaction.addToBackStack(null);
transaction.commit();
```

## Transfer Information

### In Activity

`getFragmentManager().findFragmentById(R.id.right_fragment);`

### In Fragment

`MainActivity activity = (MainActivity) getActivity();`

## Runtime Loop

- `onAttach()`
  当碎片和活动建立关联的时候调用。
- `onCreateView()`
  为碎片创建视图(加载布局)时调用。
- `onActivityCreated()`
  确保与碎片相关联的活动一定已经创建完毕的时候调用。
- `onDestroyView()`
  当与碎片关联的视图被移除的时候调用。
- `onDetach()`
  当碎片和活动解除关联的时候调用。
