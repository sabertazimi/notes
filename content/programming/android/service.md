---
sidebar_position: 12
tags: [Programming, Android, Service]
---

# Service

```html
//in AndroidManifest.xml <service android:name=".MyService"> </service>
```

```java
stopSelf()
```

```java
public class MyService extends Service {
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    @Override
        public void onCreate() {
        super.onCreate();
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return super.onStartCommand(intent, flags, startId);
    }
    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}
```

## Handler

```java
//在主线程重写handleMessage,更新UI
new Handler() {
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case UPDATE_TEXT:
            // 在这里可以进行UI操作
            text.setText("Nice to meet you");
            break;
            default:
            break;
        }
    }
}

//在后台执行子线程
new Thread(new Runnable() {
    @Override
    public void run() {
        Message message = new Message();
        message.what = UPDATE_TEXT;
        handler.sendMessage(message); // 将Message对象发送出去
    }
}).start();
```

## Async Task

AsyncTask 中的几个方法才能完成对任务的定制。经常需要去重写的方法
有以下四个:

1. `onPreExecute()`
   这个方法会在后台任务开始执行之前调用,用于进行一些界面上的初始化操作,
   比如显示一个进度条对话框等。
2. `doInBackground(Params...)`
   这个方法中的所有代码都会在子线程中运行,我们应该在这里去处理所有的耗时任务。
   任务一旦完成就可以通过 return 语句来将任务的执行结果返回,如果 AsyncTask 的
   第三个泛型参数指定的是 Void,就可以不返回任务执行结果。注意,在这个方法中是不
   可以进行 UI 操作的,如果需要更新 UI 元素,比如说反馈当前任务的执行进度,
   可以调用 publishProgress(Progress...)方法来完成。
3. `onProgressUpdate(Progress...)`
   当在后台任务中调用了 publishProgress(Progress...)方法后,这个方法就会很快被调用,
   方法中携带的参数就是在后台任务中传递过来的。在这个方法中可以对 UI 进行操作,
   利用参数中的数值就可以对界面元素进行相应地更新。
4. `onPostExecute(Result)`
   当后台任务执行完毕并通过 return 语句进行返回时,这个方法就很快会被调用。
   返回的数据会作为参数传递到此方法中,可以利用返回的数据来进行一些 UI 操作,
   比如说提醒任务执行的结果,以及关闭掉进度条对话框等。

```java
class DownloadTask extends AsyncTask<Void, Integer, Boolean> {
    @Override
    protected void onPreExecute() {
        progressDialog.show(); // 显示进度对话框
    }
    @Override
    protected Boolean doInBackground(Void... params) {
        try {
            while (true) {
                int downloadPercent = doDownload(); // 这是一个虚构的方法
                publishProgress(downloadPercent);
            if (downloadPercent >= 100) {
                break;
                }
            }
        } catch (Exception e) {
            return false;
        }
    return true;
}
    @Override
    protected void onProgressUpdate(Integer... values) {
        // 在这里更新下载进度
        progressDialog.setMessage("Downloaded " + values[0] + "%");
    }
    @Override
    protected void onPostExecute(Boolean result) {
        progressDialog.dismiss(); // 关闭进度对话框
        // 在这里提示下载结果
        if (result) {
            Toast.makeText(context, "Download succeeded",
            Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(context, " Download failed",
            Toast.LENGTH_SHORT).show();
        }
    }
}
```

## IBinder

- In Custom Service class

```java
private DownloadBinder mBinder = new DownloadBinder();

class DownloadBinder extends Binder {
    public void startDownload() {
        Log.d("MyService", "startDownload executed");
    }
    public int getProgress() {
        Log.d("MyService", "getProgress executed");
        return 0;
    }
}

@Override
public IBinder onBind(Intent intent) {
    return mBinder;
}
```

- In Activity class

```java
case R.id.bind_service:
    Intent bindIntent = new Intent(this, MyService.class);
    bindService(bindIntent, connection, BIND_AUTO_CREATE); // 绑定服务
    break;
case R.id.unbind_service:
    unbindService(connection); // 解绑服务
    break;
default:
    break;

@Override
public void onServiceDisconnected(ComponentName name) {
    }
@Override
public void onServiceConnected(ComponentName name, IBinder service) {
    downloadBinder = (MyService.DownloadBinder) service;
    downloadBinder.startDownload();
    downloadBinder.getProgress();
}
```

## ForeGround

- In service onCreate

```java
Notification notification = new Notification(R.drawable.ic_launcher,
  "Notification comes", System. currentTimeMills());
Intent notificationIntent = new Intent(this, MainActivity.class);
PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
  notificationIntent, 0);
notification.setLatestEventInfo(this, "This is title", "This is content", pendingIntent);
startForeground(1, notification);
```

## Intent

```java
public class MyIntentService extends IntentService {
    public MyIntentService() {
        super("MyIntentService"); // 调用父类的有参构造函数
    }
    @Override
    protected void onHandleIntent(Intent intent) {
        // 打印当前线程的id
        Log.d("MyIntentService", "Thread id is " + Thread.currentThread().getId());
    }
    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d("MyIntentService", "onDestroy executed");
    }
}
```

## Alarm

结合 BroadcastReceiver 可以实现定时任务

```java
AlarmManager manager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
long triggerAtTime = SystemClock.elapsedRealtime() + 10 * 1000;
manager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtTime, pendingIntent);
```

- Service 延时发出广播
- BroadcastReceiver 接受广播后再次启动 Service

```java
public int onStartCommand(Intent intent, int flags, int startId) {
    new Thread(new Runnable() {
        @Override
        public void run() {
            Log.d("LongRunningService", "executed at " + new Date().toString());
        }
    }).start();

    AlarmManager manager = (AlarmManager) getSystemService(ALARM_SERVICE);
    int anHour = 60 * 60 * 1000; // 这是一小时的毫秒数
    long triggerAtTime = SystemClock.elapsedRealtime() + anHour;

    //关键：在服务里发送广播
    Intent i = new Intent(this, AlarmReceiver.class);
    PendingIntent pi = PendingIntent.getBroadcast(this, 0, i, 0);

    manager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtTime, pi);

    return super.onStartCommand(intent, flags, startId);
}
```
