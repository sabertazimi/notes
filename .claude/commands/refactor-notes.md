---
allowed-tools: AskUserQuestion, Bash, Read, Write, Edit, Grep, Glob, TodoWrite, Task, Skill, EnterPlanMode
description: 重构大笔记文件，进行扁平化拆分
---

# Refactor Notes

## 前置检查

**重要**：此命令涉及复杂的多步骤重构，必须先完成规划阶段。

- 如果当前不在 **plan mode**，将自动调用 `EnterPlanMode` 进入规划模式
- 在 **plan mode 中**：完成「分析阶段」和「创建迁移计划」
- 退出 **plan mode 后**：执行「执行拆分」和「验证与清理」

---

请你按照以下标准化流程，对 `$ARGUMENTS` 指定的笔记文件进行扁平化拆分：

## 拆分原则

1. **按 H2 章节拆分**：
   - 较短章节（<100 行）或高耦合章节可合并为一个文件
   - 较长章节或独立话题单独成文件
   - 目标文件大小：~500 行（可远小于 500 行），最大不超过 1000 行
   - 例外：单个 H2 章节超过 1000 行时保持独立

2. **创建索引文件**：
   - 每个目录创建同名 `.md` 文件作为导航中心
   - 仅包含 Map of Content，不含笔记内容

3. **图片资源拆分**：
   - `figures/` 按主题分类到子目录
   - 更新所有图片引用路径

## 工作流程

### 📋 规划阶段（Plan Mode 中）

1. **分析阶段**：
   - 使用 `Glob`/`Grep` 分析目标文件和目录结构
   - 使用 `Read` 读取原始文件，识别所有 H2 章节
   - 计算每个章节行数，规划拆分方案

2. **创建迁移计划**：
   - 列出所有目标文件及其包含的章节
   - 规划 figures 子目录结构
   - 确保符合文件大小限制

> **完成迁移计划后，请退出 plan mode 并确认，然后继续执行阶段**

### ⚙️ 执行阶段（退出 Plan Mode 后）

3. **执行拆分**：
   - 创建 figures 子目录（`Bash`）
   - 移动图片到对应子目录（`Bash`）
   - 使用 `Write` 创建新文件，包含：
     - 调整后的 frontmatter（`sidebar_position`、标题、标签）
     - 原 H2-H4 内容
     - 更新后的图片路径
   - 创建索引文件

4. **验证与清理**：
   - [ ] 使用 `Grep` 检查并修复内部链接
   - [ ] 验证所有图片路径已更新
   - [ ] 验证索引文件中列出的顺序与 sidebar_position 顺序一致
   - [ ] 运行 `pnpm build` 确保构建成功
   - [ ] 运行 `pnpm lint:notes` 确保 markdown 格式正确
   - [ ] 手动检查生成的索引文件
   - [ ] 删除原始文件
   - [ ] 使用 `TodoWrite` 标记所有任务完成

## 注意事项

- 保持原始 frontmatter 格式，仅调整 sidebar_position、title 和 tags
- 图片路径格式：`./figures/subdirectory/filename.ext`
- 提交时遵循项目的 Conventional Commits 规范
