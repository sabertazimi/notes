---
sidebar_position: 21
tags: [Programming, Android, Device, Map, Sensor]
---

# Device

## Map

```java
public class MainActivity extends Activity {

  public static final int SHOW_LOCATION = 0;

  private TextView positionTextView;

  private LocationManager locationManager;

  private String provider;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    positionTextView = (TextView) findViewById(R.id.position_text_view);
    locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    // 获取所有可用的位置提供器
    List<String> providerList = locationManager.getProviders(true);
    if (providerList.contains(LocationManager.GPS_PROVIDER)) {
      provider = LocationManager.GPS_PROVIDER;
    } else if (providerList.contains(LocationManager.NETWORK_PROVIDER)) {
      provider = LocationManager.NETWORK_PROVIDER;
    } else {
      // 当没有可用的位置提供器时，弹出Toast提示用户
      Toast.makeText(this, "No location provider to use",
          Toast.LENGTH_SHORT).show();
      return;
    }
    Location location = locationManager.getLastKnownLocation(provider);
    if (location != null) {
      // 显示当前设备的位置信息
      showLocation(location);
    }
    locationManager.requestLocationUpdates(provider, 5000, 1,
        locationListener);
  }

  protected void onDestroy() {
    super.onDestroy();
    if (locationManager != null) {
      // 关闭程序时将监听器移除
      locationManager.removeUpdates(locationListener);
    }
  }

  LocationListener locationListener = new LocationListener() {

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

    @Override
    public void onProviderEnabled(String provider) {
    }

    @Override
    public void onProviderDisabled(String provider) {
    }

    @Override
    public void onLocationChanged(Location location) {
      // 更新当前设备的位置信息
      showLocation(location);
    }
  };

  private void showLocation(final Location location) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          // 组装反向地理编码的接口地址
          StringBuilder url = new StringBuilder();
          url.append("https://maps.googleapis.com/maps/api/geocode/json?latlng=");
          url.append(location.getLatitude()).append(",")
              .append(location.getLongitude());
          url.append("&sensor=false");
          HttpClient httpClient = new DefaultHttpClient();
          HttpGet httpGet = new HttpGet(url.toString());
          // 在请求消息头中指定语言，保证服务器会返回中文数据
          httpGet.addHeader("Accept-Language", "zh-CN");
          HttpResponse httpResponse = httpClient.execute(httpGet);
          if (httpResponse.getStatusLine().getStatusCode() == 200) {
            HttpEntity entity = httpResponse.getEntity();
            String response = EntityUtils.toString(entity, "utf-8");
            JSONObject jsonObject = new JSONObject(response);
            // 获取results节点下的位置信息
            JSONArray resultArray = jsonObject.getJSONArray("results");
            if (resultArray.length() > 0) {
              JSONObject subObject = resultArray.getJSONObject(0);
              // 取出格式化后的位置信息
              String address = subObject.getString("formatted_address");
              Message message = new Message();
              message.what = SHOW_LOCATION;
              message.obj = address;
              handler.sendMessage(message);
            }
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }).start();
  }

  private Handler handler = new Handler() {

    public void handleMessage(Message msg) {
      switch (msg.what) {
      case SHOW_LOCATION:
        String currentPosition = (String) msg.obj;
        positionTextView.setText(currentPosition);
        break;
      default:
        break;
      }
    }

  };

}

```

## Sensor

```java
SensorManager sensorManager = (SensorManager)getSystemService(Context.SENSOR_SERVICE);
```

```java
SensorEventListener listener = new SensorEventListener() {
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
    @Override
    public void onSensorChanged(SensorEvent event) {
    }
};
```

```java
sensorManager.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL);
sensorManager.unregisterListener(listener);
```

### Light

```java
Sensor sensor = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);
```

### Accelerometer

```java
Sensor sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
```

### Orientation

```java
Sensor sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
```
