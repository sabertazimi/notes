---
sidebar_position: 32
tags: [Web, CSS, Component, Form]
---

# Form

Form [design](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post):

- 由于表单组件多为 `Replaced Element`, 通过 CSS 控制样式存在困难,
  一般利用 `label`/`span` 代替 `input` 的方式,
  对 `label` 与 `span` 进行[核心样式控制](https://developer.mozilla.org/docs/Web/CSS/Pseudo-classes#user_action_pseudo-classes),
  对 `input` 进行[辅助样式控制](https://developer.mozilla.org/docs/Web/CSS/Pseudo-classes#the_input_pseudo-classes):
  - `:disabled`.
  - `:checked`.
  - `:focus-visible`.
  - `:focus:not(:focus-visible)`.
  - `:active:not(:disabled)`.
  - `:indeterminate`.
- 隐藏 `input`, 用 `label` 模拟时, 需要注意表单元素的键盘可访问性:
  - 保持键盘访问:
    不应使用 `display: none`/`visibility: hidden` 隐藏 `input` (无法键盘访问),
    应使用 `[type="checkbox"] { position: absolute; clip: rect(0 0 0 0); }`.
  - 修饰键盘访问:
    应添加 `:focus`/`:focus-visible` 伪类样式,
    `input:focus ~ label { outline: 1px solid red; border: 1px solid red; }`.

```css
[type='radio'] {
  position: absolute;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  opacity: 0;
}

.radio-label {
  background-color: var(--color-transparent);
  border-color: var(--color-dark);
  border-radius: 999px;
}

:disabled ~ .radio-label {
  border-color: var(--color-ghost);
}

:checked ~ .radio-label {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

:focus-visible ~ .radio-label {
  outline: 1px solid var(--color-primary);
}

:focus:not(:focus-visible) ~ .radio-label {
  outline: none;
  border-color: var(--color-primary);
}

:active:not(:disabled) ~ .radio-label {
  transform: scale(1.1);
}
```

[![Form Input Style](figures/form-input-style.png)](https://css-tricks.com/html-inputs-and-labels-a-love-story)

## Presets

```css
input[type='email'],
input[type='number'],
input[type='search'],
input[type='text'],
input[type='tel'],
input[type='url'],
input[type='password'],
textarea,
select {
  box-sizing: border-box;
  height: 38px;
  padding: 6px 10px;
  background-color: #fff;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  box-shadow: none;
}

/* Removes awkward default styles on some inputs for iOS */
input[type='email'],
input[type='number'],
input[type='search'],
input[type='text'],
input[type='tel'],
input[type='url'],
input[type='password'],
textarea {
  appearance: none;
}

textarea {
  min-height: 65px;
  padding-top: 6px;
  padding-bottom: 6px;
}

input[type='email']:focus,
input[type='number']:focus,
input[type='search']:focus,
input[type='text']:focus,
input[type='tel']:focus,
input[type='url']:focus,
input[type='password']:focus,
textarea:focus,
select:focus {
  /* Key point: remove default outline */
  outline: 2px solid transparent;
  outline-offset: 2px;

  /* Custom border color */
  border: 1px solid #33c3f0;
}

label,
legend {
  display: block;
  padding: 0;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border-width: 0;
}

input[type='checkbox'],
input[type='radio'] {
  display: inline;
}

label > .label-body {
  display: inline-block;
  margin-left: 0.5rem;
  font-weight: normal;
}
```

## Button

隐藏 `<input>`, 添加样式至 `<label>`/`<span>`:

```html
<input id="submit" type="submit" />
<label class="btn" for="submit">Submit</label>

<style>
  [type='submit'] {
    position: absolute;
    clip-path: rect(0 0 0 0);
  }

  .btn {
    display: inline-block;
    padding: 2px 12px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    background-color: #cd0000;
  }

  :focus + label.btn {
    outline: 1px dotted var(--highlight);
  }
</style>
```

## Checkbox

Input itself as border shape,
pseudo elements as center shape (checked transform animation):

```css
input[type='checkbox'] + label::before {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  content: '';
  background: white;
}

input[type='checkbox']:checked + label::before {
  background: #5ac5c9;
}

input[type='checkbox']:checked + label::after {
  position: absolute;
  top: 3px;
  left: 27px;
  width: 13px;
  height: 6px;
  content: '';
  border-bottom: 2px solid black;
  border-left: 2px solid black;
  transform: rotate(-45deg);
}

input[type='checkbox']:focus + label::before {
  outline: #5d9dd5 solid 1px;
  box-shadow: 0 0 8px #5e9ed6;
}

input[type='checkbox']:disabled + label {
  color: #575757;
}

input[type='checkbox']:disabled + label::before {
  background: #ddd;
}
```

## Switch

[Pseudo element switch](https://web.dev/articles/building/a-switch-component)
from circle to circle:

- thumb-size: 2rem.
- track-width: `2 * thumb-size`.
- track-height: thumb-size.
- pseudo-element border-radius: 50%.
- track border-radius: track-size.
- checked transform:
  track `background-color`,
  pseudo element `translateX`.

```css
.gui-switch > input {
  display: grid;
  flex-shrink: 0;
  grid: [track] 1fr / [track] 1fr;
  align-items: center;
  inline-size: var(--track-size);
  block-size: var(--thumb-size);
  padding: var(--track-padding);
  appearance: none;
  border-radius: var(--track-size);
}

.gui-switch > input::before {
  grid-area: track;
  inline-size: var(--thumb-size);
  block-size: var(--thumb-size);
  content: '';
}
```

## Select

[Modern select](https://nerdy.dev/nice-select):

```css
.custom-select {
  width: 15%;
  height: 35px;
  margin-right: 20px;
  text-overflow: '';

  /* 文本属性 */
  text-align: center;
  text-align-last: center;

  /* 消除默认箭头 */
  text-indent: 0.01px;

  /* 消除默认样式 */
  appearance: none;

  /* 将箭头图片移至右端 */
  background: url('images/arrow.png') no-repeat;
  background-color: #fff;
  background-position: right;

  /* 自定义边框 */
  border: 0;
}

.custom-select:focus {
  border: 1px solid #e74f4d;
}

.custom-select option {
  width: 100%;
  height: 25px;
  padding-left: 30px;
  line-height: 25px;
  color: #323333;
  background-color: #fff;
  direction: rtl;
}

.custom-select option:hover,
.custom-select option:focus {
  color: #fff;
  background: url('./img/tick.png') no-repeat 8px center;
  background-color: #e74f4d;
}
```
