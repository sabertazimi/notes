---
sidebar_position: 12
tags: [Web, HTML, Form]
---

# Form

[Form](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post):

```html
<form action="表单提交的后台地址接口" method="post" 提交方式，一般为post>
  <fieldset 若内容比较多，用来分区>
    <legend>这是分区的标题</legend>
    <label for="file">选择照片按钮</label>
    <input type="file" id="file" />
  </fieldset>

  <fieldset>
    <legend>这是分区的标题</legend>
    <div>选择尺寸：</div>
    <input
      type="checkbox"
      多选框
      name="size"
      数据名称，交给后台
      value="5"
      值
      id="cb_0"
      checked
      disabled
      默认勾选，无法更改
    />
    <label for="cb_0">5寸</label>
    <!-- 一个input一个label，一一对应，同类name相同 -->
    <input type="radio" 单选框 name="material" value="fs" id="rd_0" />
    <label for="rd_0">富士，单选第一个</label>

    <input
      type="text"
      单行文本框，默认
      id="description"
      placeholder="里面是提示"
      value="这里是默认内容"
      readonly只读
      hidden隐藏
    />
    <input type="submit" 提交按钮 /> == <button type="submit">提交</button> <input type="reset" 重置按钮 /> ==
    <button type="reset">重置</button>

    <div>
      <label for="delivery" 功能提示信息，通过for与标签对应>配送方式</label>
      <select id="delivery" 下拉选择>
        <optgroup label="group1" 给选项分组>
          <option value="0">快递</option>
          <option value="1">EMS</option>
        </optgroup>
        <option value="2" selected>平邮</option>
      </select>
    </div>

    <div>
      <label for="feedback">意见反馈,多行文本框</label>
      <textarea name="feedback" rows="4" 4行 id="feedback"></textarea>
    </div>
  </fieldset>
</form>
```

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sign Up Form</title>
    <link rel="stylesheet" href="css/normalize.css" />
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet" />
    <link rel="stylesheet" href="css/main.css" />
  </head>
  <body>
    <form action="index.html" method="post">
      <h2>Your basic info</h2>

      <label for="name">Name</label>
      <input type="text" id="name" name="student_name" />

      <label for="mail">Email</label>
      <input type="email" id="mail" name="student_email" />

      <label for="password">Password</label>
      <input type="password" id="password" name="student_password" />

      <label>Age:</label>
      <input type="radio" id="under_16" value="under_16" name="user_age" /><label for="under_16" class="light"
        >Under 16</label
      ><br />
      <input type="radio" id="over_16" value="over_16" name="user_age" /><label for="over_16" class="light"
        >16 or Older</label
      >

      <h2>Your profile</h2>

      <label for="bio">Biography</label>
      <textarea id="bio" name="student_bio"></textarea>

      <label for="courses">Select Courses</label>
      <select id="courses" name="student_courses">
        <optgroup label="Engineering">
          <option value="computer_engineering">Computer Science Engineering</option>
          <option value="electrical_engineering">Electrical Engineering</option>
          <option value="mechanical_engineering">Mechanical Engineering</option>
          <option value="civil_engineering">Civil Engineering</option>
          <option value="chemical_engineering">Chemical Engineering</option>
        </optgroup>
        <optgroup label="Management">
          <option value="finance_management">Finance Management</option>
          <option value="technology_management">Technology Management</option>
          <option value="marketing_management">Marketing Management</option>
          <option value="business_administration">Business Administration</option>
        </optgroup>
      </select>

      <label>Interests:</label>
      <input type="checkbox" id="engineering" value="interest_engineering" name="user_interest" /><label
        class="light"
        for="engineering"
        >Engineering</label
      ><br />
      <input type="checkbox" id="business" value="interest_business" name="user_interest" /><label
        class="light"
        for="business"
        >Business</label
      ><br />
      <input type="checkbox" id="law" value="interest_law" name="user_interest" /><label class="light" for="law"
        >Law</label
      >

      <button type="submit">Submit</button>
    </form>
  </body>
</html>
```

## Validation

`<input>` validation is (maybe) [good](https://www.htmhell.dev/adventcalendar/2025/28):

```ts
const form = document.getElementById('my-form')
const input = document.getElementById('program_name')
const errorMessage = document.getElementById('program_name-error')

// IMPORTANT: set this attribute in JS, that way it's a
// progressive enhancement (ie: if JS isn't available the
// native form validation will still work).
form.setAttribute('novalidate', '')

function validateInput() {
  const isValid = input.checkValidity()
  errorMessage.textContent = isValid ? '' : input.validationMessage
  if (isValid) {
    input.removeAttribute('aria-invalid')
  } else {
    input.setAttribute('aria-invalid', 'true')
  }
}

// Validate on blur (when user leaves the field)
input.addEventListener('blur', validateInput)

// Clear errors as user types
input.addEventListener('input', () => {
  if (input.checkValidity()) {
    errorMessage.textContent = ''
    input.removeAttribute('aria-invalid')
  }
})

// Handle form submit
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault()
    // Update validation state for all fields
    validateInput()
  }
})
```

- Form validation complete [guide](https://developer.mozilla.org/docs/Learn/Forms/Form_validation).
- Constraint validation complete [guide](https://developer.mozilla.org/docs/Web/Guide/HTML/Constraint_validation).

## Attributes

### Attribute

`form=form_name`:
使表单元素可放置于表单之外

### Action

`formaction=target_name`:
使表单元素可提交到不同页面

### Method

`formmethod=post/get`:
使表单元素以不同的方式提交

### Enctype

`enctype` (HTTP `Content-Type` header):

- 默认值: `application/x-www-form-urlencoded`, 提交前编码所有字符.
- `multipart/form-data` 不编码字符, **上传控件表单元素**必须使用该值.
- `text/plain`: 表单元素数据中的空格编码为 `+`.

```html
<form method="post" enctype="multipart/form-data">
  <div>
    <label for="file">Choose file to upload</label>
    <input type="file" id="file" name="file" multiple />
  </div>
  <div>
    <button>Upload image</button>
  </div>
</form>
```

### Target

`target` 定义表单提交后加载页面打开方式:

- `self` (default): 在相同的框架中打开被链接文档.
- `blank`: 在新窗口中打开被链接文档.
- `parent`: 在父框架集中打开被链接文档.
- `top`: 在整个窗口中打开被链接文档.
- `frameName`: 在指定的框架中打开被链接文档.

### Novalidate

取消表单元素的提交验证 (`novalidate`):

将 `submit` 元素的 `formnovalidate` 属性值为 `true`,
使整个表单提交验证失效, 实现假提交,
进而弹出再次确认按钮 (真提交).

### AutoFocus

```html
<div class="form-control">
  <label for="search">Search the site...</label>
  <input id="search" name="search" type="search" placeholder="Search here ..." autofocus />
</div>
```

### Required

```html
<div class="form-control">
  <label for="film">The film in question?</label>
  <input id="film" name="film" type="text" placeholder="e.g. King Kong" required aria-required="true" />
</div>
```

### Disabled

`disabled` 表单元素的数据不会被提交.

### Hidden

`hidden` 表单元素的数据仍会被提交.

### AutoComplete

[`autocomplete`](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete):

- `email`.
- `new-password`.
- `current-password`.
- `street-address`.
- `address-line1`.
- `address-line2`.
- `address-line3`.
- `city`.
- `state`.
- `country`.
- `tel`.
- `zip`.
- `one-time-code`.
- `cc-name`.
- `cc-number`.
- `cc-exp`.
- `off`.

```html
<form>
  <div>
    <label for="email">Email</label>
    <input autocomplete="email" required type="email" id="email" name="email" />
  </div>
  <div>
    <label for="password">Password</label>
    <input autocomplete="new-password" type="password" id="password" name="password" />
  </div>
  <button>Sign up</button>
</form>

<form>
  <div>
    <label for="email">Email</label>
    <input autocomplete="email" required type="email" id="email" name="email" />
  </div>
  <div>
    <label for="password">Password</label>
    <input autocomplete="current-password" type="password" id="password" name="password" />
  </div>
  <button>Sign in</button>
</form>
```

## Label

指定表单元素的标签

```html
<label for="input_id">OS : </label>
```

### Control

javascript tips：通过 control 属性改变标签对应表单元素的值

```ts
const textbox = $('#label_id').control
textbox.value = '666666' //  等同于 input.value = '666666';
```

## Input

```html
<!-- default -->
<input type="text" />
<!-- numeric keyboard -->
<input type="tel" />
<!-- numeric keyboard -->
<input type="number" />
<!-- displays @ key -->
<input type="email" />
<!-- displays .com key -->
<input type="url" />
<!-- displays search button -->
<input type="search" />
<!-- displays date picker or wheel controls -->
<input type="date" />
<input type="date picker(date,month,week,time,datetime,datetime-local)" />

<input type="range" />
<input type="color" />
```

### Indeterminate

检查 `[type=checkbox]` 的状态:

```ts
if (checkbox.indeterminate) {
  doSomething()
} else {
  if (checkbox.checked)
    doSomething()
  else
    doSomething()
}
```

### Pattern

通过正则表达式指定输入格式:

```html
<input pattern="[0-9][A-Z]{3}" />
```

### Validity

返回 `ValidityState` 对象, 拥有 `ValidityState.valid` 属性.

## Text

```html
<input type="text" spellcheck="true" lang="en" />
```

## Radio

`name` 相同时, 多个 radio 组成一个 radio group.

## Checkbox

## Search

搜索条:

```html
<div class="form-control">
  <label for="search">Search the site...</label>
  <input id="search" name="search" type="search" placeholder="Search here ..." />
</div>
```

## Tel

电话号码无输入检查:

```html
<div class="form-control">
  <label for="tel">Telephone (so we can berate you if you're wrong)</label>
  <input id="tel" name="tel" type="tel" placeholder="1-234-546758" autocomplete="off" required />
</div>
```

## Url

```html
<div class="form-control">
  <label for="web">Your Web address</label>
  <input id="web" name="web" type="url" placeholder="https://www.mysite.com" />
</div>
```

## Email

```html
<div class="form-control">
  <label for="email">Your Email address</label>
  <input type="email" id="email" name="email" placeholder="dwight.schultz@gmail.com" required />
</div>
```

## Number

```html
<div class="form-control">
  <label for="yearOfCrime">Year Of Crime</label>
  <input id="yearOfCrime" name="yearOfCrime" type="number" min="1929" max="2015" step="1" required />
</div>
```

## Range

```html
<div class="form-control">
  <input
    id="howYouRateIt"
    name="howYouRateIt"
    type="range"
    min="1"
    max="10"
    value="5"
    onchange="showValue(this.value)"
  />
  <span id="range">5</span>
</div>
```

## DateTime

`[type]`:

- `date`.
- `month`.
- `week`.
- `time`.
- `datetime-local`.

```html
<input id="date" name="date" type="date" />
<input id="month" name="month" type="month" />
<input id="week" name="week" type="week" />
<input id="time" name="time" type="time" />
```

## Color

```html
<div class="form-control">
  <label for="color">Your favorite color</label>
  <input id="color" name="color" type="color" />
</div>
```

## List

`autocomplete`, 为输入框指定智能提示数据:

```html
<div class="form-control">
  <label for="awardWon">Award Won</label>
  <input id="awardWon" name="awardWon" type="text" list="awards" />
  <datalist id="awards">
    <select>
      <option value="Best Picture"></option>
      <option value="Best Director"></option>
      <option value="Best Adapted Screenplay"></option>
      <option value="Best Original Screenplay"></option>
    </select>
  </datalist>
</div>
```

## File

File type:

```html
<input type="file" accept=".jpeg,.png" />
```

Multiple files:

```html
<input type="file" multiple />
```

Capture device camera:

```html
<!-- Front camera -->
<input type="file" capture="user" accept="image/*" />
<!-- Back camera -->
<input type="file" capture="environment" accept="image/*" />
```

## Output

`<input>` 元素的镜像元素.

## Textarea

### Maxlength

### Cols

每行可显示字符最大数

### Wrap

- hard:换行时加入换行标志，**此时必须指定**`cols`属性
- soft:不加入换行标志
