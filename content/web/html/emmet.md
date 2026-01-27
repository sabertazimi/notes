---
sidebar_position: 1
tags: [Web, HTML, Emmet]
---

# Emmet

## 嵌套

孩子 : `>`.

```html
<!-- div>ul>li -->
<div>
  <ul>
    <li></li>
  </ul>
</div>
```

兄弟 : `+`.

```html
<!-- div+ul>li -->
<div></div>
<ul>
  <li></li>
</ul>
```

上级：`^`.

```html
<!-- ul>li^div -->
<ul>
  <li></li>
</ul>
<div></div>

ul>li>a^^div
<ul>
  <li><a href=""></a></li>
</ul>
<div></div>
```

重复: `*`.

```html
<!-- ul>li*3 -->
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
```

分组：`()`.

```html
<!-- div>(p>span)*2 -->
<div>
  <p><span></span></p>
  <p><span></span></p>
</div>
```

## 属性

- id: `#`.
- class: `.`.

```html
<!-- div#header+div.main+div#footer -->
<div id="header"></div>
<div class="main"></div>
<div id="footer"></div>
```

属性值: `[]`.

```html
<!-- a[title=test target=_self] -->
<a title="test" target="_self" href=""></a>
```

数列值：`$`.

```html
<!-- p.item$*3 -->
<p class="item1"></p>
<p class="item2"></p>
<p class="item3"></p>

<!-- p.item$$*3 -->
<p class="item01"></p>
<p class="item02"></p>
<p class="item03"></p>
```

数列操作符：`@`

```html
<!-- p.item$@-*3 @- = -1 -->
<p class="item3"></p>
<p class="item2"></p>
<p class="item1"></p>

<!-- p.item$@3*3 @3 = 从3开始3次 -->
<p class="item3"></p>
<p class="item4"></p>
<p class="item5"></p>

<!-- p.item$@-3*3 @-3 = 3次后到3结束 -->
<p class="item5"></p>
<p class="item4"></p>
<p class="item3"></p>
```

## 字符

字符操作：`{}`.

```html
<!-- a{click} -->
<a href="">click</a>

<!-- a>{click}+span{me} -->
<a href="">click<span>me</span></a>
```

## 缺省元素

- `.header+.footer` -> `div.header+div.footer`.
- `ul>.item*3` -> `ul>li.item*3`.
- `table>.row*4>.cell*3` -> `table>tr.row*4>td.cell*3`.
