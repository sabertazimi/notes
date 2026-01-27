---
tags: [Programming, DevOps, Design Pattern, Code Review]
---

# Code Review

- 逻辑正确.
- 简单易懂.
- 编程规范 (Linter).
- 模块化.
- 多余或重复: 代码/日志/测试.
- 重复轮子: 可被基本库替换.
- 无必要的全局变量.
- 代码误注释.
- 死循环: 边界检查.

## Smell

Bad code smell:

- Mysterious name.
- Duplicated code.
- Long function.
- Long parameter list.
- Large class.
- Global data.
- Mutable data.
- Divergent change (发散式变化):
  某个模块经常因为不同的原因在不同的方向上发生变化.
- Shotgun surgery (霰弹式修改):
  每遇到某种变化, 必须在许多不同的类内做出许多小修改.

## Security

- 所有的数据输入是否都进行了检查 (检测正确的类型, 长度, 格式和范围) 并且进行了编码?
- 在哪里使用了第三方工具, 返回的错误是否被捕获?
- 输出的值是否进行了检查并且编码?
- 无效的参数值是否能够处理?

## Documents

## Comments

- 数据结构.
- 计量单位.
- 描述代码意图.
- 函数块.
- 非常规行为/边界检查.
- `TODO` 标记.
- `FIXME` 标记.
- 第三方库文档.

## Tests

- 代码是否可以测试? 比如, 不要添加太多的或是隐藏的依赖关系, 不能够初始化对象, 测试框架可以使用方法等.
- 是否存在测试, 它们是否可以被理解? 比如, 至少达到你满意的代码覆盖 (code coverage).
- 单元测试是否真正的测试了代码是否可以完成预期的功能?
- 是否检查了数组的`越界`错误?
- 是否有可以被已经存在的 API 所替代的测.
