---
sidebar_position: 20
tags: [Programming, Android, Media, Notification]
---

# Media

## Notification

```java
NotificationManager manager = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);

Notification notification = new Notification(R.drawable.ic_launcher, "This is
  ticker text", System.currentTimeMills());

Intent intent = new Intent(this, NotificationActivity.class);
PendingIntent pi = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);

notification.setLatestEventInfo(this, "This is content title", "This is
  content text", pi);

manager.notify(1, notification);
//在被启动Activity manager.cancel(1);
```

## SMS

## Audio

## Music
