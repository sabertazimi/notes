---
allowed-tools: AskUserQuestion, Bash, Read, Write, Edit, Grep, Glob, TodoWrite, Task, Skill
description: 重构大笔记文件，进行扁平化拆分
---

# Refactor Notes

请你按照以下标准化流程，对 `$ARGUMENTS` 指定的笔记文件进行扁平化拆分：

## 拆分原则

1. **按 H2 章节拆分**：
   - 较短章节（<100 行）或高耦合章节可合并为一个文件
   - 较长章节或独立话题单独成文件
   - 目标文件大小：~500 行（可远小于 500 行），最大不超过 1000 行
   - 例外：单个 H2 章节超过 1000 行时保持独立

2. **创建索引文件**：
   - 每个目录创建 `index.md` 作为导航中心
   - 仅包含 Map of Content，不含笔记内容

3. **图片资源拆分**：
   - `figures/` 按主题分类到子目录
   - 更新所有图片引用路径

## 工作流程

1. **分析阶段**：
   - 使用 `Glob`/`Grep` 分析目标文件和目录结构
   - 使用 `Read` 读取原始文件，识别所有 H2 章节
   - 计算每个章节行数，规划拆分方案

2. **创建迁移计划**：
   - 列出所有目标文件及其包含的章节
   - 规划 figures 子目录结构
   - 确保符合文件大小限制

3. **执行拆分**：
   - 创建 figures 子目录（`Bash`）
   - 移动图片到对应子目录（`Bash`）
   - 使用 `Write` 创建新文件，包含：
     - 调整后的 frontmatter（标题、标签）
     - 原 H2-H4 内容
     - 更新后的图片路径
   - 创建 `index.md` 索引文件

4. **验证与清理**：
   - 检查并修复内部链接（`Grep` + `Edit`）
   - 删除原始文件
   - 运行 `pnpm build` 验证构建成功
   - 使用 `TodoWrite` 跟踪所有任务进度

## 注意事项

- 保持原始 frontmatter 格式，仅调整 title 和 tags
- 图片路径格式：`./figures/subdirectory/filename.ext`
- 提交时遵循项目的 Conventional Commits 规范
