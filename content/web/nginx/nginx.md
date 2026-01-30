---
tags: [Web, Linux, Server, Nginx]
---

# Nginx

Sites config located in `/etc/nginx/sites-available`:

```bash
nginx -t # check config syntax
```

## Configuration

泛域名路径分离: `xxx.test.dev` -> `/usr/local/html/xxx`:

```bash
server {
  listen 80;
  server_name ~^([\w-]+)\.test\.dev$;
  root /usr/local/html/$1;
}
```

```bash
server {
  # SSL configuration
  #
  # listen 443 ssl default_server;
  # listen [::]:443 ssl default_server;
  #
  root /var/www/html/;

  # Add index.php to the list if you are using PHP
  index index.html index.htm index.nginx-debian.html;

  server_name example.tld www.example.tld;

  # Cache static assets
  location ~* \.(?:jpg|jpeg|gif|png|ico|svg)$ {
    expires 7d;
    add_header Cache-Control "public";
  }

  location ^~ /assets/ {
    gzip_static on;
    expires 12h;
    add_header Cache-Control "public";
  }

  # Cache css and js bundle
  location ~* \.(?:css|js)$ {
    add_header Cache-Control "no-cache, public, must-revalidate, proxy-revalidate";
  }

  location / {
    include /etc/nginx/mime.types;
    try_files $uri $uri/ /index.html;
    # try_files $uri $uri/ =404;

    # proxy_http_version 1.1;
    # proxy_cache_bypass $http_upgrade;
    # proxy_set_header Upgrade $http_upgrade;
    # proxy_set_header Connection 'upgrade';
    # proxy_set_header Host $host;
    # proxy_set_header X-Real-IP $remote_addr;
    # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # proxy_set_header X-Forwarded-Proto $scheme;
    # proxy_pass http://localhost:3000;
  }
}
```

## References

- Selectively disabling [HTTP/1.X](https://markmcb.com/web/selectively_disabling_http_1).
