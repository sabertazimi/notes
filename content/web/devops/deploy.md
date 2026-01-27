---
sidebar_position: 5
tags: [Web, DevOps, Deployment]
---

# Deployment

## Static Assets

Fingerprinting is a technique that makes the name of a file,
dependent on the **contents** of the file,
not on the **timestamp** differ from servers.
When the file contents change,
the filename is also changed.
For content that is static or infrequently changed,
this provides an easy way to tell whether two versions of a file are identical,
even across different servers or deployment dates.

When a filename is unique and based on its content, HTTP headers
can be set to encourage **caches**(code: `200`) everywhere
(whether at CDNs, at ISPs, in networking equipment, or in web browsers)
to keep their own copy of the content.
When the content is updated(),
the fingerprint will change.
This will cause the remote clients to request a new copy of the content.
This is generally known as cache busting.

## CI

- Full builds upon continuous deployment.
- Incremental builds are a product of time.

## Docker

```dockerfile
FROM node:16-alpine as builder

WORKDIR /code

ADD package.json package-lock.json /code/
RUN npm install

ADD . /code
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine

# 将构建产物移至 Nginx
COPY --from=builder code/build/ /usr/share/nginx/html/
```

## Nginx

子域名设置:

```bash
sudo mkdir -p /var/www/blog/html
sudo chown -R $USER:$USER /var/www/blog/html
sudo chmod -R 755 /var/www
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/blog
# change 'root' and 'server_name' config, remove 'default_server' config
sudo vim /etc/nginx/sites-available/blog
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## A/B Testing

[A/B testing](https://rahulsuresh.net/blog/ab-testing-millions-of-users-using-aws-lambda-edge):

- Improves customer experience:
  by testing different options,
  businesses can find out what their customers prefer
  and make their websites or products more enjoyable to use.
- Increases sales:
  if a business knows which version of a webpage leads to more sales or sign-ups,
  they can use that version for everyone, potentially making more money.
- Reduces risks:
  before making big changes, like redesigning a website,
  businesses can test small changes to see how people react.
  This way, they avoid making big investments that might not pay off.
- Informs decisions:
  Instead of relying on gut feelings,
  businesses can make informed decisions that are backed up by actual user behavior.

```tsx
// A/B test causing Flash of Unstyled Content (FoUC):
// - SEO impact.
// - User experience impact.
// - Web performance impact.
import { useEffect, useState } from 'react'

const imageUrlA = 'https://fakeimg.pl/150x150/0000FF/808080?text=Variant+A'
const imageUrlB = 'https://fakeimg.pl/150x150/FF0000/FFFFFF?text=Variant+B'

const VariantA = () => <img src={imageUrlA} alt="Variant A" />
const VariantB = () => <img src={imageUrlB} alt="Variant B" />

export default function ABTestComponent() {
  const [variant, setVariant] = useState('loading')

  useEffect(() => {
    // Simulate reading from localStorage with a delay
    const timeout = setTimeout(() => {
      const randomVariant = Math.random() < 0.5 ? 'A' : 'B'
      const storedVariant = localStorage.getItem('userVariant') ?? randomVariant
      localStorage.setItem('userVariant', storedVariant)
      setVariant(storedVariant)
    }, 500) // 500ms second delay to simulate a flicker effect

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div>
      {variant === 'loading' && <div>Loading variant...</div>}
      {variant === 'A' && <VariantA />}
      {variant === 'B' && <VariantB />}
    </div>
  )
}
```

## Blue Green

两套系统, 一套稳定的绿色系统, 一套即将发布的蓝色系统.
不断切换并迭代发布到生产环境中.

## Rolling Update

多个集群实例的服务中, 在不影响服务的情况下,
停止一个或多个实例, 逐步进行版本更新.

## Gray Release

Canary Release: 全量或增量部署新文件, 并逐步把流量切换至新 CDN URL.
根据灰度白名单, 将灰度测试用户的 CDN Assets
更换至不同 Version Number 或者 Fingerprint 的新版本前端页面文件.

### Solution

通过灰度发布收集用户反馈 (转化率等指标),
决定后续是否全面将所有流量切至新版本,
或者完全放弃新版本,
亦或是通过 FLAGS 结合用户特征图像,
(如用户级别, UA, Cookie
Location, IP,
Feature List 等)
只向部分流量投放新版本.
可以实现千人千页,
每个用户获得由不同的功能 (FLAGS 开启关闭) 组成的不同页面.

业界成熟的灰度方案:

- 简单灰度逻辑通过 Nginx 配置做规则判断(路由, 参数, IP, Cookie 等), upstream 到不同的服务器:
  - 新代码部署到 A 边.
  - 符合灰度策略的小部分流量切到 A 边, 剩余大部分流量仍去往 B 边
  - 验证 A 边功能是否正常可用/好用
  - 验证无误后, 大部分流量转到 A 边, 灰度流量去往 B 边
  - 验证 B 边功能是否正常可用/好用
  - 验证无误后, 流量像往常一样均分到 AB 边

```bash
# Canary Deployment
map $COOKIE_canary $group {
  # canary account
  ~*devui$ server_canary;
  default server_default;
}

# 流量均分, 注释掉其中某一边, 另一边为灰度流量访问边
upstream server_canary {
  server 11.11.11.11:8000 weight=1 max_fails=1 fail_timeout=30s;
  server 22.22.22.22 weight=1 max_fails=1 fail_timeout=30s;
}

# 流量均分, 注释掉其中某一边, 另一边为正常流量访问边
upstream server_default {
  server 11.11.11.11:8000 weight=2 max_fails=1 fail_timeout=30s;
  server 22.22.22.22 weight=2 max_fails=1 fail_timeout=30s;
}

# 配置 8000 端口的转发规则, 并且 expose port
server {
  listen 8000;
  server_name _;
  root /var/canaryDemo;

  # Load configuration files for the default server block.
  include /etc/nginx/default.d/*.conf;

  location / {
    root /var/canaryDemo;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}

server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name _;
  # root /usr/share/nginx/html;
  root /var/canaryDemo;

  # Load configuration files for the default server block.
  include /etc/nginx/default.d/*.conf;

  location / {
    proxy_pass http://$group;
    # root /var/canaryDemo;
    # index index.html;
  }

  error_page 404 /404.html;
    location = /40x.html {
  }

  error_page 500 502 503 504 /50x.html;
  location = /50x.h
}
```

- 复杂灰度逻辑通过 Nginx + Lua 新增一个灰度中心服务,
  结合业务来做流量的灰度与切换, 控制 HTML 入口文件,
  使灰度规则与业务代码解耦.

### Performance

- 前端优化:
  每一个页面都需要去获取灰度规则, 这个灰度请求将阻塞页面.
  可以使用 localStorage 存储这个用户是否为灰度用户,
  然后定期的更新 localStorage,
  取代大量的请求造成的体验问题.

- 后端优化:
  利用 MemCache 在内存中缓存灰度规则与灰度用户列表,
  提升灰度发布性能.

## References

- SaaS/PaaS/IaaS [list](https://github.com/ripienaar/free-for-dev).
- Free budget [stack](https://github.com/255kb/stack-on-a-budget).
