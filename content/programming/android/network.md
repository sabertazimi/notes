---
sidebar_position: 22
tags: [Programming, Android, Network, HTTP, XML, JSON]
---

# NetWork

Networked Apps

1. Network latency(网络延迟)——UI thread separated from data loading thread
2. Battery drain(电池耗尽)
3. Intermittent service(中断服务)

## WebView

```html
<uses-permission android:name="android.permission.INTERNET" />
```

```java
webView.getSettings().setJavaScriptEnabled(true);

webView.setWebViewClient(new WebViewClient() {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        view.loadUrl(url); // 根据传入的参数再去加载新的网页
        return true; // 表示当前WebView可以处理打开新网页的请求,不用借助系统浏览器
    }
});

webView.loadUrl("http://www.github.com");
```

## XML

### Pull

```java
HttpClient httpClient = new DefaultHttpClient();

// 指定访问的服务器地址是电脑本机
HttpGet httpGet = new HttpGet("http://10.0.2.2/get_data.xml");
HttpResponse httpResponse = httpClient.execute(httpGet);

if (httpResponse.getStatusLine().getStatusCode() == 200) {
    // 请求和响应都成功了
    HttpEntity entity = httpResponse.getEntity();
    String response = EntityUtils.toString(entity,"utf-8");

    //XML Pull 方式解析
    XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
    XmlPullParser xmlPullParser = factory.newPullParser();
    xmlPullParser.setInput(new StringReader(xmlData));
    int eventType = xmlPullParser.getEventType();

    String id = "";
    String name = "";
    String version = "";

    while (eventType != XmlPullParser.END_DOCUMENT) {

        String nodeName = xmlPullParser.getName();

        switch (eventType) {
        // 开始解析某个结点
        case XmlPullParser.START_TAG: {
            if ("id".equals(nodeName)) {
                id = xmlPullParser.nextText();
            } else if ("name".equals(nodeName)) {
                name = xmlPullParser.nextText();
            } else if ("version".equals(nodeName)) {
               version = xmlPullParser.nextText();
            }
            break;
        }
        // 完成解析某个结点
        case XmlPullParser.END_TAG: {
            if ("app".equals(nodeName)) {
                Log.d("MainActivity", "id is " + id);
                Log.d("MainActivity", "name is " + name);
                Log.d("MainActivity", "version is " + version);
            }
            break;
        }
        default:
            break;
        }

        eventType = xmlPullParser.next();
    } // end of while
}  //  end of if
```

### SAX

```java
public class ContentHandler extends DefaultHandler {
    private String nodeName;
    private StringBuilder id;
    private StringBuilder name;
    private StringBuilder version;

    @Override
    public void startDocument() throws SAXException {
        id = new StringBuilder();
        name = new StringBuilder();
        version = new StringBuilder();
    }
    @Override
    public void startElement(String uri, String localName, String qName,
      Attributes attributes) throws SAXException {
        // 记录当前结点名
        nodeName = localName;
    }
    @Override
    public void characters(
      char[] ch,
      int start,
      int length) throws SAXException {
        // 根据当前的结点名判断将内容添加到哪一个StringBuilder对象中
        if ("id".equals(nodeName)) {
            id.append(ch, start, length);
        } else if ("name".equals(nodeName)) {
            name.append(ch, start, length);
        } else if ("version".equals(nodeName)) {
            version.append(ch, start, length);
        }
    }
    @Override
    public void endElement(
      String uri,
      String localName,
      String qName) throws SAXException {
        if ("app".equals(localName)) {
            Log.d("ContentHandler", "id is " + id.toString().trim());
            Log.d("ContentHandler", "name is " + name.toString().trim());
            Log.d("ContentHandler", "version is " + version.toString().trim());
            // 最后要将StringBuilder清空掉
            id.setLength(0);
            name.setLength(0);
            version.setLength(0);
        }
    }
    @Override
    public void endDocument() throws SAXException {
    }
}
```

```java
HttpClient httpClient = new DefaultHttpClient();
// 指定访问的服务器地址是电脑本机
HttpGet httpGet = new HttpGet("http://10.0.2.2:8080/get_data.xml");
HttpResponse httpResponse = httpClient.execute(httpGet);

if (httpResponse.getStatusLine().getStatusCode() == 200) {
    // 请求和响应都成功了
    HttpEntity entity = httpResponse.getEntity();
    String response = EntityUtils.toString(entity, "utf-8");

    SAXParserFactory factory = SAXParserFactory.newInstance();
    XMLReader xmlReader = factory.newSAXParser().getXMLReader();
    ContentHandler handler = new ContentHandler();

    // 将ContentHandler的实例设置到XMLReader中
    xmlReader.setContentHandler(handler);
    // 开始执行解析
    xmlReader.parse(new InputSource(new StringReader(xmlData)));
```

## JSON

### Object

```java
HttpClient httpClient = new DefaultHttpClient();
// 指定访问的服务器地址是电脑本机
HttpGet httpGet = new HttpGet("http://10.0.2.2/get_data.json");
HttpResponse httpResponse = httpClient.execute(httpGet);

if (httpResponse.getStatusLine().getStatusCode() == 200) {
    // 请求和响应都成功了
    HttpEntity entity = httpResponse.getEntity();
    String response = EntityUtils.toString(entity, "utf-8");

    JSONArray jsonArray = new JSONArray(response);

    for (int i = 0; i < jsonArray.length(); i++) {
        JSONObject jsonObject = jsonArray.getJSONObject(i);
        String id = jsonObject.getString("id");
        String name = jsonObject.getString("name");
        String version = jsonObject.getString("version");
    }
}
```

### GSON

```java
HttpClient httpClient = new DefaultHttpClient();
// 指定访问的服务器地址是电脑本机
HttpGet httpGet = new HttpGet("http://10.0.2.2/get_data.json");
HttpResponse httpResponse = httpClient.execute(httpGet);

if (httpResponse.getStatusLine().getStatusCode() == 200) {
    // 请求和响应都成功了
    HttpEntity entity = httpResponse.getEntity();
    String response = EntityUtils.toString(entity, "utf-8");

    Gson gson = new Gson();
    List<App> appList = gson.fromJson(response, new TypeToken<List<App>>() {}.getType());

    for (App app : appList) {
        Log.d("MainActivity", "id is " + app.getId());
        Log.d("MainActivity", "name is " + app.getName());
        Log.d("MainActivity", "version is " + app.getVersion());
    }
}
```

## Best Practices

```java
public interface HttpCallbackListener {
void onFinish(String response);
void onError(Exception e);
}
```

```java
public class HttpUtil {
    public static void sendHttpRequest(final String address, final
      HttpCallbackListener listener) {
        new Thread(new Runnable() {
        @Override
        public void run() {
            HttpURLConnection connection = null;
            try {

            URL url = new URL(address);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(8000);
            connection.setDoInput(true);
            connection.setDoOutput(true);

            InputStream in = connection.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            if (listener != null) {
                // 回调 onFinish() 方法
                // 将 response 传入回调方法
                listener.onFinish(response.toString());
                }
            } catch (Exception e) {
                if (listener != null) {
                // 回调 onError() 方法
                listener.onError(e);
                }
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }  //  end of run
        }).start();  //  end of runnable
    }  //   end of sendHttpRequest
}  //  end of class
```

```java
//以后每当需要发起一条 HTTP 请求的时候就可以这样写:
String address = "http://www.github.com";
String response = HttpUtil.sendHttpRequest(address, new HttpCallbackListener() {
    @Override
    public void onFinish(String response) {
        // 在这里根据返回内容执行具体的逻辑
    }
    @Override
    public void onError(Exception e) {
        // 在这里对异常情况进行处理
    }
});
```
