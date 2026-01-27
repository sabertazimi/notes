---
sidebar_position: 40
tags: [Language, Java, MyBatis, Internals]
---

# MyBatis

## Proxy and Interceptor

接口定义:

```java
public interface UserService {
    void addUser(String username);
    void removeUser(String username);
}

public class Invocation {

    /**
     * 目标对象
     */
    private Object target;
    /**
     * 执行的方法
     */
    private Method method;
    /**
     * 方法的参数
     */
    private Object[] args;

    public Invocation(Object target, Method method, Object[] args) {
        this.target = target;
        this.method = method;
        this.args = args;
    }

    /**
     * 执行目标对象的方法
     */
    public Object invoke() throws Exception{
       return method.invoke(target,args);
    }
}

public interface Interceptor {
    /**
     * 具体拦截处理, 目标对象封装到Invocation
     */
    Object intercept(Invocation invocation) throws Exception;

    /**
     *  插入目标类, 创建代理对象
     */
    Object plugin(Object target);
}
```

接口实现:

```java
public class UserServiceImpl implements UserService {
    @Override
    public void addUser(String username) {
        System.out.println("User " + username + " added.");
    }

    @Override
    public void removeUser(String username) {
        System.out.println("User " + username + " removed.");
    }
}

public class LogInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Exception{
        System.out.println("------业务代码执行之前-------------");
        Object result = invocation.process();
        System.out.println("------业务代码执行之后-------------");
        return result;
    }

    @Override
    public Object plugin(Object target){
        return UserServiceProxyHandler.wrap(target, this);
    }
}

public class CatInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Exception{
        System.out.println("------监控开启-------------");
        Object result = invocation.process();
        System.out.println("------监控结束-------------");
        return result;
    }

    @Override
    public Object plugin(Object target){
        return UserServiceProxyHandler.wrap(target, this);
    }
}
```

代理类实现:

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class UserServiceProxyHandler implements InvocationHandler {
    private final UserService userService;
    private final Interceptor interceptor;

    public UserServiceProxyHandler(UserService userService, Interceptor interceptor) {
        this.userService = userService;
        this.interceptor = interceptor;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Invocation invocation = new Invocation(userService, method, args);
        Object result = interceptor.intercept(invocation);
        return result;
    }

    public static Object wrap(Object target,Interceptor interceptor) {
        UserServiceProxyHandler targetProxy = new UserServiceProxyHandler(target, interceptor);
        return Proxy.newProxyInstance(target.getClass().getClassLoader(),target.getClass().getInterfaces(),targetProxy);
    }
}
```

责任链模式:

```java
import java.lang.reflect.Proxy;

public class Main {
    public static void main(String[] args) {
        UserService realUserService = new UserServiceImpl();

        LogInterceptor logInterceptor = new LogInterceptor();
        realUserService = (UserService)logInterceptor.plugin(realUserService);

        CatInterceptor catInterceptor = new CatInterceptor();
        realUserService = (UserService)catInterceptor.plugin(realUserService);

        // 使用代理实例
        realUserService.addUser("张三");
        realUserService.removeUser("张三");
    }
}
```
