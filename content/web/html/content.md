---
sidebar_position: 10
tags: [Web, HTML]
---

# Content

## Details

Accordion list:

```html
<div class="container">
  <h3>FAQ</h3>

  <details open>
    <summary>Why is it called an accordion menu?</summary>
    <hr />
    <p>
      Because each part of it can expand and contract, like in an accordion. If you don't know what an accordion is,
      just imagine a cute fluffy cat. You still won't know what it is, but at least you'll feel better about not
      knowing.
    </p>
  </details>

  <details>
    <summary>Huh?</summary>
    <hr />
    <p>Huh.</p>
  </details>

  <details>
    <summary>If I use an accordion menu will it make me cool?</summary>
    <hr />
    <p>
      No, not unless you're designing a MySpace profile. The
      <code>{"details"}</code> element is cool though, and you can use that for a lot of things. I'm using it on this
      page right below here, to show the code for each example!
    </p>
  </details>
</div>

<style>
  .container {
    padding: 1em 2em;
    border: 0.2em solid black;
    border-radius: 2em;
  }

  details {
    padding: 1em;
    margin-bottom: 1em;
    border: 0.1em solid black;
    border-radius: 1em;
  }

  summary {
    font-size: 1.2em;
    cursor: pointer;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  details[open] summary {
    font-size: 1.3em;
  }
</style>
```

### Summary

展开与收缩时触发 `toggle` 事件:

```html
<details>
  <summary>Details</summary>
  Something small enough to escape casual notice.
</details>
```

### Data Grid

### AutoComplete

### Open

默认 `open=false`.

## Description List

- `<dl>`: description list.
- `<dt>`: description Term.
- `<dd>`: description details.

```html
<h1>Review your data</h1>
<p>Please review the data you entered in the previous step to ensure it is correct:</p>
<dl>
  <dt>First name</dt>
  <dd>Marc</dd>

  <dt>Last name</dt>
  <dd>Simmons</dd>

  <dt>Date of Birth</dt>
  <dd><time datetime="1990-05-15">May 15 1990</time></dd>
</dl>
```

## Datalist

```html
<datalist id="register-prompt" style="display: none">
  <option value="Windows">Windows</option>
  <option value="Mac OS">Mac OS</option>
  <option value="Linux">Linux</option>
</datalist>
```

```html
<label for="myBrowser">Choose a browser from this list:</label>
<input list="browsers" id="myBrowser" name="myBrowser" />
<datalist id="browsers">
  <option value="Chrome"></option>
  <option value="Firefox"></option>
  <option value="Internet Explorer"></option>
  <option value="Opera"></option>
  <option value="Safari"></option>
  <option value="Microsoft Edge"></option>
</datalist>
```

## Dialog

Native [`dialog`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog):

```html
<dialog open>
  <p>Greetings, one and all!</p>
  <form method="dialog">
    <button>OK</button>
  </form>
</dialog>
```

```html
<button class="btn" data-toggle="#dialog">Open modal</button>

<button class="btn" data-toggle="#dialog-tall">Open tall modal</button>

<dialog id="dialog">
  <header>
    Example modal
    <button class="btn btn-close" data-close>
      <svg width="16" height="16"><use xlink:href="#x" /></svg>
    </button>
  </header>
  Some basic text inside the modal to demonstrate how it all looks and works.
</dialog>

<dialog id="dialog-tall">
  <header>
    Super tall modal
    <button class="btn btn-close" data-close>
      <svg width="16" height="16"><use xlink:href="#x" /></svg>
    </button>
  </header>
  <p>Line breaks to push the height out.</p>
  <button type="button" class="btn" data-close>Close</button>
</dialog>
```

```ts
const togglers = document.querySelectorAll('[data-toggle]')
const closers = document.querySelectorAll('[data-close]')

togglers?.forEach((toggler) => {
  const target = toggler.getAttribute('data-toggle')
  const dialogs = document.querySelectorAll(target)

  toggler.addEventListener('click', (_event) => {
    dialogs.forEach((dialog) => {
      dialog.showModal()
    })
  })
})

closers?.forEach((closer) => {
  closer.addEventListener('click', (_event) => {
    const dialog = closer.closest('dialog')
    dialog.close()
  })
})
```

## Popover

[Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API):

```html
<button popovertarget="my-popover">Toggle Popover</button>
<div id="my-popover" popover>Popover Content</div>
```

```html
<button popovertarget="my-popover" class="toggle-btn">Toggle Popover</button>

<div id="my-popover" popover="manual">
  <p>I am a popover with more information.</p>
  <p>
    <button popovertarget="my-popover" popovertargetaction="hide" class="close-btn">
      <span aria-hidden="true">❌</span>
      <span class="sr-only">Close</span>
    </button>
  </p>
</div>
```

## Table

```html
<table>
  <thead>
    <tr>
      <th scope="col">Col Header 1</th>
      <th scope="col">Col Header 2</th>
      <th scope="col">Col Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Row Header 1</th>
      <td>Row 1 Col 2</td>
      <td>Row 1 Col 3</td>
    </tr>
    <tr>
      <th scope="row">Row Header 2</th>
      <td>Row 2 Col 2</td>
      <td>Row 2 Col 3</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Summary</th>
      <td>Col 2 summary</td>
      <td>Col 3 summary</td>
    </tr>
  </tfoot>
</table>
```

## Time

### Pub Date

`pubdate`:
boolean 代表当前`<time>`表示整个网页的时间

### DateTime

```html
<time datetime="2010-11-13T20:00Z"></time>
<time datetime="2010-11-13T20:00+09:00"></time>
```

- `T` 分隔日期与时间
- `Z` 使用 UTC 标准时间
- `+` 时差

## Mark

突出/高亮显示，无关原文作者

## Ins

Insert text

```html
<ins cite="https://bugzilla.mozilla.org/show_bug.cgi?id=1620467" datetime="2020-07-23">
  The <code>appearance</code> property, previously only available prefixed in Firefox, can now be used in all modern
  browsers un-prefixed.
</ins>
```

## Del

Delete text

```html
<del cite="https://bugzilla.mozilla.org/show_bug.cgi?id=1620467" datetime="2020-07-23">
  Firefox doesn't support CSS's standard <code>appearance</code> property, so you can only use it prefixed.
</del>
```

## U

underline text

## Em

文章重点

## Strong

段落强调

## Small

- 免责声明、注意事项、法律规定、版权声明
- 不改变文字样式

## Hr

下划线

## Progress

value/max 百分比

```html
<label for="file">File progress:</label>

<progress id="file" max="100" value="70">70%</progress>
```

## Meter

### Value

### Min

### Max

### Low

### High

### Optimum

## Wbr

软换行
