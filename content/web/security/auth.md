---
sidebar_position: 20
tags: [Web, Security, Authentication, Vulnerability]
---

# Authentication

## Password

Password [mis-management](https://www.hacksplaining.com/prevention/password-mismanagement),
使用同一个密钥 (reused key) 进行多次加/解密, 将使得破解流密码变得非常简单:

- Require complex password.
- Require multi-factor authentication.
- Secure and robust password hashing: `bcrypt`.
- Secure and robust password salting.
- Secure password resets.
- Validate email address.
- Ban disposable email account.
- 密钥管理:
  - 防止密钥从非正常的渠道泄露.
  - 定期更换密钥.
  - 采用安全的密钥管理系统: Web 应用通过 service API 动态获取密钥, 只加载到内存中, 不写入本地文件.

## User Enumeration

通过暴力工具得到被攻击网站的用户名单, 并利用社工得到密码:

REST API 无法抵抗此种攻击,
e.g. GitHub [user profile](https://github.com).

### API

- 限制 API 访问频率与次数.
- 设置 IP 黑名单.
- 记录登陆日志.
- [CAPTCHA](https://www.google.com/recaptcha/about):
  completely automated public turing test to tell computers and humans apart.
- 隐藏用户 ID, 只显示昵称.

### Login

使攻击者无法枚举用户名, 他无法确定是用户不存在还是密码错误:

- Login error message: Unknown User **or** Password.
- All login code-paths take **same time** on average: time consuming operations.
- All login code-paths take **same context**: session ID, cookie.

### Signup and Reset

Not with name, should with email:

- 使攻击者无法枚举用户名, 他无法确定是用户不存在还是用户已存在.
- Not Exist: Sending sign-up email.
- Exist: Sending pwd-reset email.
