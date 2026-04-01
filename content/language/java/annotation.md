---
sidebar_position: 14
tags: [Language, Java, Annotation]
---

# Annotation

定义 `@Range` 注解用于字段值范围检查:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Range {
    int min() default 0;
    int max() default 255;
}
```

使用 `@Range` 注解:

```java
public class Person {
    @Range(min = 1, max = 20)
    public String name;

    @Range(min = 0, max = 150)
    public int age;
}
```

通过反射检查字段值是否满足 `@Range` 约束:

```java
public static void check(Object obj) throws IllegalAccessException {
    for (Field field : obj.getClass().getFields()) {
        Range range = field.getAnnotation(Range.class);

        if (range != null) {
            Object value = field.get(obj);

            if (value instanceof String s) {
                if (s.length() < range.min() || s.length() > range.max()) {
                    throw new IllegalArgumentException(
                        field.getName() + ": invalid length");
                }
            }

            if (value instanceof Integer i) {
                if (i < range.min() || i > range.max()) {
                    throw new IllegalArgumentException(
                        field.getName() + ": invalid value");
                }
            }
        }
    }
}
```
