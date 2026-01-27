---
sidebar_position: 50
tags: [Web, DevOps, Security, Best Practice]
---

# Best Practices

## Principles

安全三要素:

- 机密性 (Confidentiality).
- 完整性 (Integrity).
- 可用性 (Availability).

安全原则:

- 白名单原则:
  - 防火墙白名单: 默认只开放 `80` 与 `443` 端口.
  - XSS 防御白名单: 富文本编辑器只允许 `<a>` 与 `<img>` 标签.
- 最小权限原则.
- 纵深防御原则:
  - Web 应用安全.
  - 网络环境安全.
  - 数据库安全.
  - OS 系统安全.
- 数据与代码分离原则:
  - 缓冲区溢出漏洞: 混淆代码与数据边界, 导致安全问题发生.
  - 注入漏洞: 混合应用代码与用户数据, 导致 SQL/XSS/CSRF/XML 漏洞发生.
- 不可预测性原则:
  - 有效地对抗基于篡改与伪造的攻击.
  - 随机栈基址防御缓冲区溢出攻击.
  - 加密哈希 Token 防御 CSRF 攻击.

STRIDE 威胁分析模型:

| Threat                 | Definition                  | Security   |
| ---------------------- | --------------------------- | ---------- |
| Spoofing               | 伪装 (他人身份)             | 认证       |
| Tampering              | 篡改 (数据或代码)           | 完整性     |
| Repudiation            | 抵赖 (做过的事情)           | 不可抵赖性 |
| Information Disclosure | 信息泄露 (机密数据)         | 机密性     |
| Denial of Service      | 拒绝服务                    | 可用性     |
| Elevation of Privilege | 提升权限 (未经授权获得许可) | 授权       |

DREAD 风险分析模型:

- $\text{Risk} = \text{Probability} * \text{Damage Potential}$:
  - 高危: 12 ~ 15 分.
  - 中危: 8 ~ 11 分.
  - 低危: 0 ~ 7 分.
- Damage Potential:
  - High: 完全验证权限, 执行管理员操作, 非法上传文件.
  - Medium: 泄露敏感信息.
  - Low: 泄露其他信息.
- Reproducibility:
  - High: 攻击者可以随意重复攻击.
  - Medium: 攻击者可以重复攻击, 有时间限制.
  - Low: 攻击者难以重复攻击.
- Exploitability:
  - High: 初学者短期能掌握攻击方法.
  - Medium: 熟练者才能掌握攻击方法.
  - Low: 漏洞利用条件非常苛刻.
- Affected users:
  - High: All user, key user, default configuration.
  - Medium: Some user, non-default configuration.
  - Low: Rare user, anonymous user.
- Discoverability:
  - High: 漏洞显眼, 攻击条件容易获得.
  - Medium: 私有区域才可发现漏洞, 需要深入挖掘.
  - Low: 发现漏洞极其困难.

## Software

- 逻辑安全.
- 数据安全:
  - 数据访问权限.
  - 数据访问时间.
  - 数据存储格式.
  - 数据存储位置.
  - 数据分解与组合.
- UI 安全.
- 约束安全:
  - 数据正确类型.
  - 数据正确范围.
  - 数据长度的最大值和最小值.
  - 数据非法值.

## Checklist

### Access Control

注册/二次验证/密码重置:

- [ ] 任何地方都使用 HTTPS.
- [ ] 使用 `bcrypt` 存储密码哈希.
- [ ] `登出`之后销毁会话 ID .
- [ ] 密码重置后销毁所有活跃的会话.
- [ ] OAuth2 验证必须包含 `state` 参数.
- [ ] 登陆成功之后不能直接重定向到开放的路径 (需要校验, 否则容易存在钓鱼攻击).
- [ ] 当解析用户注册/登陆的输入时, 过滤 `javascript://`, `data://` 以及其他 CRLF 字符.
- [ ] 使用 `secure`/`httpOnly` `Cookie`.
- [ ] 移动端使用 `OTP` 验证时, 当调用 `generate OTP` 或者 `Resend OTP` API 时不能把 OTP
      (One Time Password) 直接返回
      (一般是通过发送手机验证短信, 邮箱随机 code 等方式, 而不是直接 response).
- [ ] 限制单个用户 `Login`/`Verify OTP`/ `Resend OTP`/`generate OTP` 等 API 的调用次数,
      使用 Captcha 等手段防止暴力破解.
- [ ] 检查邮件或短信里的重置密码的 token, 确保随机性 (无法猜测).
- [ ] 给重置密码的 token 设置过期时间.
- [ ] 重置密码成功后, 将重置使用的 token 失效.
- [ ] Nodejs 等不使用 sudo 运行.

### Authentication

- [ ] 诸如`我的购物车`/`我的浏览历史`之类的资源访问, 必须检查当前登录的用户是否有这些资源的访问权限.
- [ ] 避免资源 ID 被连续遍历访问, 使用 `/me/orders` 代替 `/user/37153/orders` 以防忘记检查权限, 导致数据泄露.
- [ ] `修改邮箱/手机号码`功能必须首先确认用户已经验证过邮箱/手机 (本人).
- [ ] 任何上传功能应过滤用户上传的文件名, 并存储在云存储上防止代码执行.
- [ ] `个人头像上传` 功能应过滤所有的 `EXIF` 标签.
- [ ] 用户 ID 或者其他的 ID,
      应使用 [RFC compliant](http://www.ietf.org/rfc/rfc4122.txt) 的 `UUID` 而不是整数.
- [ ] [`JWT`](https://jwt.io) (JSON Web Token): 当构建一个 `SPA`/`API` 时使用 `JWT`.

### Mobile

- [ ] 支付网关的 `salt` (盐) 不应被硬编码.
- [ ] 来自第三方的 `secret` 和 `auth token` 不应被硬编码.
- [ ] 在服务器之间调用的 API 不应在 app 里面调用.
- [ ] 在安卓系统下, 要小心评估所有申请的 [权限](https://developer.android.com/guide/topics/security/permissions.html).
- [ ] 在 iOS 系统下, 使用系统的钥匙串来存储敏感信息 (auth token/API key) **不要** 把这类信息存储在用户配置里面.
- [ ] 强烈推荐证书绑定 ([certificate pinning](https://en.wikipedia.org/wiki/HTTP_Public_Key_Pinning)).

### Server

- [ ] `添加` [CSP](https://en.wikipedia.org/wiki/Content_Security_Policy) 头信息,
      减缓 XSS 和数据注入攻击. 这很重要.
- [ ] `添加` [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) 头信息
      防止跨站请求伪造 (CSRF) 攻击.
      同时`添加` [SameSite](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00)
      属性到 cookie 里面.
- [ ] `添加` [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
      头信息防止 SSL stripping 攻击.
- [ ] `添加` 你的域名到 [HSTS 预加载列表](https://hstspreload.appspot.com).
- [ ] `添加` [X-Frame-Options](https://en.wikipedia.org/wiki/Clickjacking#X-Frame-Options)
      防止点击劫持.
- [ ] `添加` [X-XSS-Protection](https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#X-XSS-Protection)
      缓解 XSS 攻击.
- [ ] `更新` DNS 记录, 增加 [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework)
      记录防止垃圾邮件和钓鱼攻击.
- [ ] 如果你的 Javascript 托管在第三方的 CDN 上面,
      需要`添加` [内部资源集成检查](https://en.wikipedia.org/wiki/Subresource_Integrity).
      为了更加安全, 添加 [require-sri-for](https://w3c.github.io/webappsec-subresource-integrity/#parse-require-sri-for)
      CSP-directive 就不会加载到没有 SRI 的资源.
- [ ] 使用随机的 CSRF token, 业务逻辑 API 可以暴露为 POST 请求.
      不要把 CSRF token 通过 HTTP 接口暴露出来, 比如第一次请求更新的时候.
- [ ] 在 `GET` 请求参数里面, 不要使用临界数据和 token: 暴露服务器日志的同时也会暴露用户数据.

### Client

- [ ] `过滤`所有暴露给用户的参数输入,
      防止 [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 攻击.
- [ ] 使用参数化的查询防止 [SQL 注入](https://en.wikipedia.org/wiki/SQL_injection).
- [ ] `过滤`所有具有功能性的用户输入, 比如 `CSV` 导入.
- [ ] `过滤`一些特殊的用户输入,
      例如将 `robots.txt` 作为用户名,
      提供 `coolCorp.io/username` 之类的 `URL` 来提供用户信息访问页面:
      此时变成 `coolCorp.io/robots.txt`, 造成安全漏洞.
- [ ] 禁止手动拼装 JSON 字符串, 不管这个对象有多么小: 使用所用的语言相应的库或者框架来编写.
- [ ] `过滤` 类似 `URL` 的输入,
      防止 [SSRF](https://docs.google.com/document/d/1v1TkWZtrhzRLy0bYXBcdLUedXGb9njTNIJXa3u9akHM/edit#heading=h.t4tsk5ixehdd)
      攻击.
- [ ] 在输出显示给用户之前, `过滤`输出信息.

### Operation

- [ ] 如果你的业务很小或者你缺乏经验, 可以评估一下使用 AWS 或者一个 PaaS 平台来运行代码.
- [ ] 在云上使用正规的脚本创建虚拟机.
- [ ] 检查所有机器没有必要开放的 `端口`.
- [ ] 检查数据库是否没有设置密码或者使用默认密码, 特别是 MongoDB 和 Redis.
- [ ] 使用 SSH 登录你的机器, 不要使用密码, 而是通过 SSH key 验证来登录.
- [ ] 及时更新系统, 防止出现 0day 漏洞, 比如 HeartBleed, ShellShock 等.
- [ ] 修改服务器配置, HTTPS 使用 TLS1.2, 禁用其他的模式.
- [ ] 不要在线上开启 DEBUG 模式, 有些框架, DEBUG 模式会开启很多权限以及后门, 或者是暴露一些敏感数据到错误栈信息里面.
- [ ] 对坏人和 DDOS 攻击要有所准备, 使用那些提供 DDOS 清洗的主机服务.
- [ ] 监控你的系统, 同时记录到日志里面 (例如使用 [New Relic](https://newrelic.com) 或者其他).
- [ ] 如果是 2B 的业务, 坚持顺从需求.
      如果使用 AWS S3, 可以考虑使用
      [数据加密](http://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html)
      功能.
      如果使用 AWS EC2, 考虑使用磁盘加密功能 (系统启动盘也可加密).

### Teamwork

- [ ] 开一个邮件组 (例如: `security@coolcorp.io`) 和搜集页面, 方便安全研究人员提交漏洞.
- [ ] 取决于你的业务, 限制用户数据库的访问.
- [ ] 对报告 BUG 与 漏洞的人有礼貌.
- [ ] 把你的代码给那些有安全编码观念的同伴进行 review (More eyes).
- [ ] 被黑或者数据泄露时, 检查数据访问前的日志, 通知用户更改密码, 可能需要外部的机构来帮助审计.
- [ ] 使用 [Netflix Scumblr](https://github.com/Netflix/Scumblr) 及时了解
      你的组织 (公司) 在社交网络或者搜索引擎上的一些讨论信息, 比如黑客攻击/漏洞等等.

## Defensive Programming

[Defensive programming](https://mp.weixin.qq.com/s/G4pME9xFHdWnFckgytnofQ):

保护程序免遭非法数据的破坏:

- 检查所有来源于外部的数据:
  当从外部接口中获取数据时, 应检查所获得的数据值, 以确保它在允许的范围内.
  - 检查接囗数据字段: **是否存在/数据类型/取值范围/缺省值/正则表达式/特殊字符**.
  - 检查方法的属性参数做必要的转换: **是否存在/数据类型/取值范围/缺省值/正则表达式/特殊字符**.
- 检查子程序所有输入参数的值.
- 决定如何处理错误的输入数据:
  一旦检测到非法参数, 选择适合的错误处理方处理.

断言:

- 用错误处理代码处理预期发生的状况, 用断言去处理那些不该发生的错误！
- 利用断言来注解前条件和后条件: 对于`入参`/ `外部数据`/`返回结果`进行检查, 是否符合业务逻辑.
- 避免将需要执行的子程序放到断言中.
- 通过写断言, 不仅可以提高防御性, 还能提高可读性.

程序的健壮性:

- 健壮性具体指的是应用在不正常的输入或不正常的外部环境下仍能表现出正常的程度.
- 不断尝试采取措施来包容错误的输入以此让程序正常运转 (对自己的代码要保守, 对用户的行为要开放:
  主动防御处理是有降级/容错处理, 尽量不要走到 `Error Boundary`.
- 考虑各种各样的极端情况:
  - 考虑到各种可能的输入形式, 兼容全面.
  - Mock 各种极端数据进行测试.
- 即使终止执行, 也要准确/无歧义的向用户展示全面的错误信息.
- 抛出有助于 Debug 的错误信息: 丰富捕获到的错误信息, 包含更多上下文信息.

程序的正确性:

- 返回`中立值`/`默认值`: 处理错误的最佳做法就是继续执行操作并简单的返回一个没有危害的值.
  - 换用下一个正确的数据: 在轮询中, 如返回数据有误就丢掉, 进行下一轮查询.
  - 返回上一次正确的数据: 同上, 不跳过的也可以返回上一次正确的数据.
  - 选择最接近的合法值.
- 上报错误日志: 上报的错误日志对还原问题和调试友好.
- 返回一个错误状态码.
- 启动错误处理子程序或对象.
- 显示对用户友好的出错消息: 展示给用户的错误信息需要加工, 用户能看明白, 有建设性.
- 正确性要求高的话, 就直接退出程序.

异常处理:

- 用异常通知程序的其他部分, 发生了不可忽略的错误.
- 只在真正例外的情况下才抛出异常:
  当前有错误就直接抛出去, 会导致线上监控的错误信息质量不高.
- 不能用异常来推卸责任: 能在局部处理掉就在局部解决掉, 不要简单抛出去.
- 避免在构造函数和析构函数中抛出异常, 除非你在同一个地方把它们捕获.
- 在恰当的抽象层次抛出异常: 不要把底层的异常抛给高层的调用方, 暴露具体实现的细节.
- 异常消息中加入关于导致异常发生的全部信息.
- 避免使用空 `catch` 语句.
- 考虑创建一个集中的异常上报机制.
- 考虑异常的替换机制.

代码隔栏:

- 左侧外部接口数据假定是脏数据 (不可信), 通过中间这些类 (子程序) 构成隔栏, 负责清理与验证数据, 并返回可信的数据.
- 最右侧的类 (子程序) 全部在假定数据干净 (安全) 的基础上工作, 这样可以让大部分的代码无须再担负检查错误数据的职责.
- 适配器模式和门面模式用来隔离或适配变化, 是对不可控变化的防御.

辅助调试代码 (`Debugging Aids`):

- 在早期的引入辅助调试代码, 发布时移除调试辅助的代码:
  - `console.log` 算是一种辅助调试代码, 发布时清除.
  - 在复杂的调试场景下, 有必要专门写一些辅助调试代码.
  - 利用 Chrome 插件追踪变量和状态变化辅助调试.
- 采用进攻式编程:
  - 尽量让异常的情况在开发期间暴露出来, 而在产品上线时自我恢复.
  - 在开发阶段考虑到最坏的情况.
  - 写单测是一进攻式编程.

UI 的防御性:

- 防白屏:
  - 白屏监控.
  - 资源加载失败重试.
  - `Service Worker`: 资源 fallback 机制.
  - 模块都包装了 `Error Boundary`.
  - 兼容性探测和提示.
  - 白屏提示信息.
- 防慢 (网络慢/响应慢/渲染慢/执行慢): 前端性能优化.
- 防卡 (卡顿/假死): 前端性能优化.
- 防布局错乱: 前端响应式开发.
- 防极端内容 (缺失/超长/连续字符/未转义): 前端响应式开发.
- UI 一致性问题:
  - 发布设计规范 (`Design System`).
  - UI 走查工具.
  - 视觉回归测试.
- 防样式污染:
  - 代码审核.
  - 样式隔离.

## References

- List of useful [payloads and bypass](https://github.com/swisskyrepo/PayloadsAllTheThings)
  for web application security and pentest.
- Open web application security project [cheat sheet](https://github.com/OWASP/CheatSheetSeries).
- Web security [checklist](https://eggjs.org/zh-CN/core/security).
- Linux server security [guide](https://github.com/imthenachoman/How-To-Secure-A-Linux-Server).
- Security search [engines](https://github.com/edoardottt/awesome-hacker-search-engines).
- MetaSploit: penetration testing [framework](https://github.com/rapid7/metasploit-framework).
- ESLint node security [plugin](https://github.com/nodesecurity/eslint-plugin-security).
