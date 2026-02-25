---
sidebar_position: 4
tags: [AI, Generative AI, LLM, Prompt Engineering, Prompt, Agent, Workflow, Vibe Coding, Agentic Coding]
---

# Prompts

## Design

### Prototype

```md
你是一个专业的 UI 设计师，你需要根据我提供的需求文档来完成页面的设计。

请仔细阅读需求文档 @prd.md，现在需要输出高保真的原型图，请通过以下方式帮我完成所有界面的原型设计，并确保这些原型界面可以直接用于开发：

1. 用户体验分析：先分析这个 App 的主要功能和用户需求，确定核心交互逻辑。
2. 产品界面规划：作为产品经理，定义关键界面，确保信息架构合理。
3. 高保真 UI 设计：作为 UI 设计师，设计贴近真实 iOS/Android 设计规范的界面，使用现代化的 UI 元素，使其具有良好的视觉体验。
4. HTML 原型实现：使用 HTML + Tailwind CSS（或 Bootstrap）生成所有原型界面，并使用 FontAwesome（或其他开源 UI 组件）让界面更加精美、接近真实的 App 设计。拆分代码文件，保持结构清晰。
5. 每个界面应作为独立的 HTML 文件存放，例如 home.html、profile.html、settings.html 等：
   - index.html 作为主入口，不直接写入所有界面的 HTML 代码，而是使用 iframe 的方式嵌入这些 HTML 片段，并将所有页面直接平铺展示在 index 页面中，而不是跳转链接。
   - 真实感增强：界面尺寸应模拟 iPhone 15 Pro，并让界面圆角化，使其更像真实的手机界面。
   - 使用真实的 UI 图片，而非占位符图片（可从 Unsplash、Pexels、Apple 官方 UI 资源中选择）。
   - 添加顶部状态栏（模拟 iOS 状态栏），并包含 App 导航栏（类似 iOS 底部 Tab Bar）。

请按照以上要求生成完整的 HTML 代码，并确保其可用于实际开发。
```

### Web

```md
<always_use_rpg_theme>
Always design with RPG aesthetic:

- Fantasy-inspired color palettes with rich, dramatic tones
- Ornate borders and decorative frame elements
- Parchment textures, leather-bound styling, and weathered materials
- Epic, adventurous atmosphere with dramatic lighting
- Medieval-inspired serif typography with embellished headers

</always_use_rpg_theme>
```

```md
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs.
In frontend design, this creates what users call the "AI slop" aesthetic.
Avoid this: make creative, distinctive front-ends that surprise and delight.

Focus on:

- Typography: Choose fonts that are beautiful, unique, and interesting.
  Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency.
  Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
  Draw from IDE themes and cultural aesthetics for inspiration.
- Motion: Use animations for effects and micro-interactions.
  Prioritize CSS-only solutions for HTML. Use Motion library for React when available.
  Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay)
  creates more delight than scattered micro-interactions.
- Backgrounds: Create atmosphere and depth rather than defaulting to solid colors.
  Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:

- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context.
Vary between light and dark themes, different fonts, different aesthetics.
You still tend to converge on common choices (Space Grotesk, for example) across generations.
Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
```

### Slide

```md
目标受众：{受众，例如：公司高管 / 技术团队 / 产品经理 / 普通用户}
演示目的：{目的，例如：技术分享 / 项目汇报 / 产品介绍 / 教学使用}
整体篇幅：{页数，例如：10 页以内 / 15～20 页}
风格要求：{风格}
视觉效果：{视觉效果}
```

风格:

1. 专业，内容呈现以准确、逻辑、严谨为主，强调框架化表达（适合企业汇报、战略沟通、技术述职）
2. 简洁，尽量减少装饰性内容，保留一级标题/二级标题，无其他内容，结构干净利落（适合快速阅读、高管场景）
3. 具象比喻，通过贴近生活的例子、比喻、类比，让复杂内容变得容易理解（适合面向小朋友、非专业受众群体）
4. 故事化，内容以叙事链条组织，用“背景—冲突—解决—结果”模型推动 （适合产品发布、经验分享）
5. 数据驱动，强调数据、指标、趋势、对比分析，以数据结论作为核心逻辑（适合商业分析、调研报告）
6. 教学，结构更加循序渐进，以解释概念、举例说明、对比差异、步骤演示为主（适合教学、培训类）
7. 激励，采用鼓舞语气和积极愿景，强调“为什么重要”“我们要做什么” （适合团队动员、年度启动会、愿景介绍）
8. 产品展示，突出场景镜头、用户价值、功能亮点、体验流程，强调“好处和使用方式”（适用于新品发布、方案宣讲）
9. 思维导图，以概念之间的关联为主线，用层次化结构展开知识网络（适合复杂主题）

视觉效果:

1. 极简留白，以大量留白、弱化装饰、突出内容主体为核心，整体视觉干净现代（适合专业场景、高管简报）
2. 强调色块，通过大色块和模块化布局强化层级关系，使重点更醒目（适合方案展示、运营复盘）
3. 卡片式布局，以卡片、分区、分栏组织内容，让阅读更轻松清晰（适合内容较多、结构化信息）
4. 图标驱动，以统一风格的图标、符号表达概念，降低文字密度、增强可读性（适合流程讲解、结构说明）
5. 插画或手绘感，采用柔和插画或轻松手绘笔触，增强亲和力与友好度（适合科普、教学、文化主题）
6. 科技质感，以线条、渐变、光效构建轻科技氛围，视觉更现代（适合 AI、数据、互联网主题）
7. 深色主题，以暗色背景配亮色文字形成强对比，强调稳重与冲击力（适合正式场景、数据展示）
8. 信息可视化，以图表、趋势图、结构图作为主视觉，减少大段文字（适合分析汇报、研究报告）
9. 分镜叙事，以类似电影分镜的结构呈现画面连续性，使内容更具故事流动感（适合产品发布、战略叙述）
10. 品牌一致，严格遵循品牌色、字体体系与风格规范，整体一致性强（适合外部宣讲、品牌官方材料）

```md
目标受众：小朋友
演示目的：概念普及
整体篇幅：10页
风格要求：具象比喻，通过贴近生活的例子、比喻、类比，让复杂内容变得容易理解
视觉效果：分镜叙事，以类似电影分镜的结构呈现画面连续性，使内容更具故事流动感
```

```md
目标受众：产品经理
演示目的：技术分享
整体篇幅：10页
风格要求：产品展示，突出场景镜头、用户价值、功能亮点、体验流程，强调“好处和使用方式”
视觉风格：卡片式布局，以卡片、分区、分栏组织内容，让阅读更轻松清晰
```

```md
目标受众：大众用户
演示目的：行业分享
整体篇幅：10页
风格要求：产品展示，突出场景镜头、用户价值、功能亮点、体验流程，强调“好处和使用方式”
视觉风格：插画或手绘感，采用柔和插画或轻松手绘笔触，增强亲和力与友好度
```

```md
目标受众：高管
演示目的：汇报
整体篇幅：10页
风格要求：简洁，尽量减少装饰性内容，保留一级标题/二级标题，无其他内容，结构干净利落
视觉效果：极简留白，以大量留白、弱化装饰、突出内容主体为核心，整体视觉干净现代
```

```md
基于下面文字主题，创作一张高密度的中文 3D 信息图。
风格要求为：
顶部：主标题区，居中展示该主题的 3D 艺术字标题。
中间部分展示相关物品或者抽象内容的 3D 微缩模型，
造型极其复杂华丽、材质高级（如发光、透明、镀金）、体积庞大、带有炫酷的特效光晕。
信息叠加层（Smart UI）：
悬浮标签： 在每个模型上方，悬浮一个 3D 气泡，写上该模型或者内容的名称。
底部：数据矩阵区
生成一个整齐的多列数据表，我提供的文本信息。
自动生成参数： 请根据主题自动选择多个最关键参数并以图形化进度条或数字形式展示。
风格与渲染：
视角： 正面平视或 30 度等轴测视角，确保三个物品处于同一水平线。
材质： 类似于“盲盒玩具”与“产品渲染”的结合，既可爱又有极高的物理真实感（C4D / Octane Render）。
背景： 干净的纯色摄影棚背景，带有柔和的投影。
```

## Frontend

### Porting

```md
Your job is to port assistant-ui-react monorepo (for react)
to assistant-ui-vue (for vue) and maintain the repository.

You have access to the current assistant-ui-react repository
as well as the assistant-ui-vue repository.

Make a commit and push your changes after every single file edit.

Use the assistant-ui-vue/.agent/ directory as a scratchpad for your work.
Store long term plans and todo lists there.

The original project was mostly tested by manually running the code.
When porting, you will need to write end to end and unit tests for the project.
But make sure to spend most of your time on the actual porting, not on the testing.
A good heuristic is to spend 80% of your time on the actual porting, and 20% on the testing.
```

```md
Your job is to port browser-use monorepo (Python)
to better-use (Typescript) and maintain the repository.

Make a commit and push your changes after every single file edit.

Keep track of your current status in browser-use-ts/agent/TODO.md
```

### UI

UI [design](./recipes/prompts/ui.md):

- 设计原则.
- 颜色规范.
- 字体规范.
- 布局规范.
- 组件规范.
- 交互规范.
- 响应式设计.

```md
你是一位资深全栈工程师，参考 `docs/ui-design.md` 设计一个 @README.md 中描述的应用，
模拟产品经理提出需求和信息架构，请自己构思好功能需求和界面，然后设计 UI/UX：

1、要高级有质感，遵守设计规范，注重 UI 细节。
2、请引入 Tailwind CSS CDN 来完成，而不是编写 CSS Style 样式，图片使用 unslash。
3、每个页面写一个独立的 HTML 文件，并可以通过点击跳转。
4、由于页面较多，你每完成一部分就让我来确认，一直持续到结束。
```

### Scaffold

Website generation [checklist](https://addyo.substack.com/p/how-good-is-ai-at-coding-react-really):

```md
Create a Next.js App Router landing page (app/page.tsx) for a developer tools SaaS:

Layout sections:
1. Hero with headline, CTA
2. Features (3 columns, icon + title + description each)
3. Social proof (logos grid)
4. CTA

Stack: Next.js 16, TypeScript, Tailwind, shadcn/ui
Density: Spacious landing page (not cramped)
Colors: Avoid purple/pink gradients - use neutral gray with blue accent
Responsive: Stack features vertically below 768px

Accessibility:
- Semantic HTML (header, main, section)
- Alt text for all images
- Sufficient color contrast (WCAG AA)
```

### Component

React [component](https://addyo.substack.com/p/how-good-is-ai-at-coding-react-really):

```md
Create a sign-up Button component with:

Props:
- variant: 'primary' | 'secondary' | 'ghost'
- size: 'sm' | 'md' | 'lg'
- disabled: boolean
- loading: boolean

Requirements:
- Use Tailwind classes
- Show loading spinner when loading=true
- Disable pointer events when disabled
- Support keyboard navigation (Enter/Space)
- Include focus-visible ring
- ARIA: use aria-disabled, aria-busy

Example usage:
<Button variant="primary" size="md" loading={isSubmitting}>
  Submit
</Button>
```

### Page

Prototype [implementation](./recipes/prompts/prototype.md):

- 设计稿处理.
- 样式实现规范.
- 布局实现规范.
- 组件化开发.
- 图标与资源.
- 响应式设计.
- 国际化处理.
- 数据可视化.
- 性能优化.
- 开发环境.
- 文档获取与参考.
- 代码质量.
- 错误处理与边界情况.
- 代码检查清单.

## Backend

### Integration

```md
<核心任务>
分析指定的前端页面代码和后端 API 文档，制定一份详细的接口对接实施计划，并为后续的编码工作做好准备。
</核心任务>

<工作流程>

1. 信息收集 (Information Gathering)：
   - 分析前端：深入分析当前上下文中的前端页面代码，完全理解其业务逻辑、功能和当前使用的数据结构。
   - 获取后端 API：
     1. 使用 API Documentation MCP 工具，务必先刷新缓存，以获取最新的 API 文档。
     2. 重点研究XXX接口 (XXX APIs) 与XXX接口 (XXX APIs) 的接口定义及其关联的数据模型 (Model Definitions)。
2. 规划与文档 (Planning & Documentation)：
   - 定义数据模型：基于后端 API 的数据结构，在 `src/models/` 目录下规划所需的 TypeScript 类型/接口。请遵循下文的 【复用原则】。
   - 定义 API 调用：在 `src/apis/` 目录下规划与后端接口对应的 API 调用函数。同样遵循 【复用原则】。
3. 创建实施计划：将上述分析结果整理成一份详细的实施计划。该计划应：
   - 保存为 Markdown 格式。
   - 使用 英文 命名文件。
   - 存放于项目的 `docs/` 目录下。

</工作流程>

<必须遵守的关键原则>

1. 【复用优于创建】：在创建任何新的模型或 API 定义之前，必须首先检查 `src/models/` 和 `src/apis/` 目录。如果已存在功能相同或相似的定义，必须复用，严禁重复创建。
2. 【计划是唯一真相来源】：
   - 实施计划一经创建，即成为后续所有讨论和编码工作的基准。
   - 任何对计划的修改（无论是由于编码中的新发现，还是需求讨论），都必须立即同步更新到该 Markdown 文档中。
   - 如果在编码过程中对某个 API 不确定，应立即使用 API Documentation MCP 工具查询确认，并将结果更新至计划文档。
3. 【清理临时代码】：
   - 严格遵守**以后端接口为准**的原则。在实施对接时，必须删除前端组件、`utils.ts` 或 `mocks.ts` 文件中的所有临时类型定义 (type, interface)。
   - 与这些临时类型相关的适配函数（如 `transform`、`map` 等）也必须一并删除。
   - 所有类型定义都必须从 `src/models/` 中导入。

</必须遵守的关键原则>
```

### Endpoint

[API endpoint generation](https://prompts.chat/book/19-programming-development):

```md
Create a REST API endpoint for ${resource:user profiles}.

Framework: ${framework:FastAPI}
Method: ${method:GET}
Path: ${path:/api/users/{id}}

Request:
- Headers: ${headers:Authorization Bearer token}
- Body schema: ${bodySchema:N/A for GET}
- Query params: ${queryParams:include_posts (boolean)}

Response:
- Success: ${successResponse:200 with user object}
- Errors: ${errorResponses:401 Unauthorized, 404 Not Found}

Include:
- Input validation
- Authentication check
- Error handling
- Rate limiting consideration
```

### Database

[Database schema design](https://prompts.chat/book/19-programming-development)

```md
Design a database schema for ${application:e-commerce platform}.

Requirements:
- ${feature1:User accounts with profiles and addresses}
- ${feature2:Product catalog with categories and variants}
- ${feature3:Orders with line items and payment tracking}

Provide:
1. Entity-relationship description
2. Table definitions with columns and types
3. Indexes for common queries
4. Foreign key relationships
5. Sample queries for key operations
```

### Generation

```md
请读取 `tables.md` SQL 语句，为每个表生成独立 Entity，Mapper 接口以及对应的 XML文件，
要求包含通用的增加、删除、修改、查询方法，详细如下：

- 单个增加。
- 批量增加。
- 根据 id 更新。
- 通用查询，以 Entity 为 condition。
- 根据 id 查询。
- 根据 ids 查询。
- 根据 id 删除（软删除）。
- 根据 ids 删除（软删除）。
```

## Debugging

[Bug analysis](https://prompts.chat/book/19-programming-development):

```md
Debug this code.
It should ${expectedBehavior:return the sum of all numbers} but instead ${actualBehavior:returns 0 for all inputs}.

Code:
${code:paste your code here}

Error message (if any):
${error:none}

Steps to debug:
1. Identify what the code is trying to do
2. Trace through execution with the given input
3. Find where expected and actual behavior diverge
4. Explain the root cause
5. Provide the fix with explanation
```

### Interpretation

[Error message interpretation](https://prompts.chat/book/19-programming-development):

```md
Explain this error and how to fix it:

Error:
${errorMessage:paste error message or stack trace here}

Context:
- Language/Framework: ${framework:Python 3.11}
- What I was trying to do: ${action:reading a JSON file}
- Relevant code: ${codeSnippet:paste relevant code}

Provide:
1. Plain English explanation of the error
2. Root cause
3. Step-by-step fix
4. How to prevent this in the future
```

### Performance

[Performance optimization](https://prompts.chat/book/19-programming-development):

```md
This code is slow. Analyze and optimize:

Code:
${code:paste your code here}

Current performance: ${currentPerformance:takes 30 seconds for 1000 items}
Target performance: ${targetPerformance:under 5 seconds}
Constraints: ${constraints:memory limit 512MB}

Provide:
1. Identify bottlenecks
2. Explain why each is slow
3. Suggest optimizations (ranked by impact)
4. Show optimized code
5. Estimate improvement
```

### Bug

```md
Task: Fix abandoned cart bug in checkout page.

Context:
- File: `app/checkout/page.tsx`
- Error: Cart resets on page refresh
- Expected: Cart persists via localStorage
- Test: Run `pnpm test checkout.test.tsx` to verify

Plan required before implementation:
1. Identify where cart state is managed
2. Add `localStorage` persistence
3. Add hydration logic
4. Update tests
5. Verify in Playwright

Constraints:
- Only modify `app/checkout/*` and `lib/cart.ts`
- Maintain existing TypeScript types
- Follow our ESLint rules
```

## Testing

### Unit

[Unit test generation](https://prompts.chat/book/19-programming-development):

```md
Write unit tests for this function:

Function:
${code:paste your function here}

Testing framework: ${testFramework:pytest}

Cover:
- Happy path (normal inputs)
- Edge cases (empty, null, boundary values)
- Error cases (invalid inputs)
- ${specificScenarios:concurrent access, large inputs}

Format: Arrange-Act-Assert pattern
Include: Descriptive test names
```

### Mock

```md
所有的 API 请求需要支持 Mock 接口，请设置一个全局变量来控制是否开启 Mock 数据，
在 request 中统一进行 Mock 数据的切换，每个 Mock 数据按模块划分与 API 请求一一对应。

命名规范：`<模块名>-mock.ts`。
```

## Review

### Workflow

```md
请和我一起进行 code review。

首先请执行`gh pr checkout $PR_ID`命令，切换到对应的代码分支，并确保内容是最新的。
再通过`gh pr view $PR_ID | cat`和`gh pr diff $PR_ID | cat`命令来获取 pull request 中的修改内容。

然后，请开始*一步一步*深入思考，仔细执行如下的 code review 流程。
如果改动比较简单直接，你也可以自行选择跳过某些步骤。

1. **理解业务目标**：判断你是否能理解这个改动的业务目标。
2. **High-level review**：查看当前的项目内容，本次改动是否放在了合适的位置，是否尽可能复用已有实现。是否有破坏了现有设计与逻辑的可能？
3. **检查 Bug**：仔细分析当前的代码修改，是否隐含了业务错误、逻辑纰漏或安全问题？对于“没有修改”的相关联部分代码，也需要检查是否有遗漏。
4. **代码清晰度**: 评估代码设计，逻辑是否简洁易懂，命名是否清晰且合理，假设一年后再来读这几行代码，是否能轻松理解？
5. **KISS 原则**：审视每一行代码是否简洁、清晰，没有不必要的复杂度，尤其避免重复造轮子。检查是否有没用到的定义，过于复杂的逻辑，过多参数等问题。
6. **单一职责**：是否做到了每个函数/类只做一件事，职责明确，项目结构清晰。注意控制文件/类/方法的代码行数。
7. **测试覆盖**：复杂业务逻辑必须有相应测试。但也不应该过度测试，例如对于没有 if/else/for 等控制逻辑的代码，不需要写测试。一般来说只对 public 方法写测试。

完成整个流程后，请对 code review 中发现的重点问题进行总结，以中文输出。
```

### Pull Request

[Comprehensive review](https://prompts.chat/book/19-programming-development):

```md
Review this code for a pull request.

Code:
${code:paste your code here}

Review for:
1. **Correctness**: Bugs, logic errors, edge cases
2. **Security**: Vulnerabilities, injection risks, auth issues
3. **Performance**: Inefficiencies, N+1 queries, memory leaks
4. **Maintainability**: Readability, naming, complexity
5. **Best practices**: ${framework:Python/Django} conventions

Format your review as:
🔴 Critical: must fix before merge
🟡 Important: should fix
🟢 Suggestion: nice to have
💭 Question: clarification needed
```

### Security

[Security review](https://prompts.chat/book/19-programming-development):

```md
Perform a security review of this code:

Code:
${code:paste your code here}

Check for:
- [ ] Injection vulnerabilities (SQL, XSS, command)
- [ ] Authentication/authorization flaws
- [ ] Sensitive data exposure
- [ ] Insecure dependencies
- [ ] Cryptographic issues
- [ ] Input validation gaps
- [ ] Error handling that leaks info

For each finding:
- Severity: Critical/High/Medium/Low
- Location: Line number or function
- Issue: Description
- Exploit: How it could be attacked
- Fix: Recommended remediation
```

### Smell

[Code smell detection](https://prompts.chat/book/19-programming-development):

```md
Analyze this code for code smells and refactoring opportunities:

Code:
${code:paste your code here}

Identify:
1. Long methods (suggest extraction)
2. Duplicate code (suggest DRY improvements)
3. Complex conditionals (suggest simplification)
4. Poor naming (suggest better names)
5. Tight coupling (suggest decoupling)

For each issue, show before/after code.
```

### Patterns

[Design pattern application](https://prompts.chat/book/19-programming-development):

```md
Refactor this code using the ${patternName:Factory} pattern.

Current code:
${code:paste your code here}

Goals:
- ${whyPattern:decouple object creation from usage}
- ${benefits:easier testing and extensibility}

Provide:
1. Explanation of the pattern
2. How it applies here
3. Refactored code
4. Trade-offs to consider
```

## Documentation

### Mermaid

```md
Create a Mermaid diagram showing the data flow for our authentication system,
including OAuth providers, session management, and token refresh.
```

### API

[API documentation](https://prompts.chat/book/19-programming-development):

```md
Generate API documentation from this code:

Code:
${code:paste your endpoint code here}

Format: ${format:OpenAPI/Swagger YAML}

Include:
- Endpoint description
- Request/response schemas
- Example requests/responses
- Error codes
- Authentication requirements
```

### Module

[Code documentation](https://prompts.chat/book/19-programming-development):

```md
Add comprehensive documentation to this code:

Code:
${code:paste your code here}

Add:
- File/module docstring (purpose, usage)
- Function/method docstrings (params, returns, raises, examples)
- Inline comments for complex logic only
- Type hints if missing

Style: ${docStyle:Google}
```

## Developer

### Step-by-step

```md
采用 「原子化任务拆分」+「渐进式验证」 方法, 将复杂需求拆解为独立可测试的小模块.
帮我设计并且给出我每一步的提示词用来指导 Cursor 编程.
```

### Multiple Choices

```md
Please think through at least 3 possibilities of what could be causing this, write in detail about them.
Choose which you believe could be the most likely cause
(noting above you already tried 2 other things that didn't work,
so don't try them again, because we're getting the same exact error after both)

When you pick the most probably solution, write in detail how do implement the solution.
Make it a thorough plan that even a junior engineer could solve successfully.
```

### Logging

```md
Please add logs to the code to get better visibility into what is going on so we can find the fix.
I'll run the code and feed you the logs results.
```

### Reading

[内容分析师](./recipes/prompts/analysis.md).

### Learning

利用 Cursor 的辅助学习新知识, 例如学习 [Next.js](https://github.com/zenyarn/nextjs-study):

```md
我是一个需要快速接手这段代码的开发者。这个文件的代码是由 Cursor 生成的。
我希望快速掌握其核心要点。请重点分析以下几个方面：

1. **整体功能和作用：** 这段代码（或组件/模块）是用来做什么的？在整个应用中扮演什么角色？
2. **UI 组件结构：** 如果是组件，它内部包含哪些子组件或主要DOM结构？层级关系是怎样的？
3. **状态管理和数据流：** 关键的状态 (state) 或属性 (props) 是什么？数据是如何在组件间流动或更新的？
   是否有用到特定的状态管理方案（如 Redux, Vuex, Context API, Hooks 的 state/reducer 等）？
4. **用户交互和事件处理：** 代码如何响应用户的操作（点击、输入等）？主要的事件监听和处理逻辑在哪里？
5. **API 交互：** 如果代码涉及与后端通信，它是如何发起请求、处理响应和管理数据的？使用了什么库（如 fetch, axios）或模式？
6. **关键依赖或技术栈：** 这段代码主要依赖于哪个前端框架/库（如 React, Vue, Angular）？使用了哪些重要的第三方库或技术？

请以清晰、结构化的方式呈现，模拟我理解自己代码时的那种感觉（即对整体架构和关键部分的把握）。
**避免详细的代码实现细节或逐行解释。**
```

## System

### Bootstrap

```md
1. Always respond in 中文。
2. 如果我要求先讨论方案请不要修改任何代码，直到方案确定才可以修改代码。
3. 方案讨论或代码实现时，如果遇到了争议或不确定性请主动告知我，请牢记让我决策而不是默认采用一种方案实现，重点强调。
4. 方案讨论需要在我们双方都没疑问的情况下才可以输出具体方案文档。
5. 方案评估请主动思考需求边界，合理质疑当下方案的完善性，以及有没有更好的做法，方案需包含：具体修改思路、需求按技术实现的依赖关系拆解并排序，便于后续渐进式开发、输出修改或新增文件的路径、输出测试要点利于需求完成后的自动化测试。
6. 当你针对我的需求提出建议时，先向我展示你的解决思路，在与我确认清楚后，再采取行动。
7. 当我向你反馈错误代码时，请总是按照思考链推理的方式严谨地分析出现问题的原因，不要基于猜想来修改代码。如果有不确定的地方，要进一步深入严谨地分析，直到真正找到问题的根源。
8. 开发项目必须严格按步骤执行，每次只专注当前讨论的步骤，要求：不允许跨步骤实现功能或"顺便"完成其他步骤任务、实现前必须先确认技术方案和实现细节、每个步骤完成后必须明确汇报，等待 Review 确认后才能进入下一步。
9. 代码修改请始终遵守最小改动原则，除非我主动要求优化或者重构。
10. 代码实现请先思考哪些业务可以参考或复用，尽可能参考现有业务的实现风格，如果你不明确可让我为你提供，避免从零造轮子。
11. 在需要生成新文件时，你必须先检查项目结构中已存在的文件，只有当不存在相同文件名的文件时，才生成新文件。否则，你需要与我确认，然后再采取行动。
12. 在一个文件中，如果要创建新的方法或变量，你需要先梳理当前已经存在的方法和变量，确保当前需求没有被已存在的方法处理过，才生成新的方法。否则，你需要与我确认，然后再采取行动。
```

### Architecture

System design blueprint:

```md
Act as a senior software architect. I need to build [your project].
Let's approach this through:

1. System requirements and constraints
2. Core architectural decisions
3. Data models and relationships
4. API contract design
5. Security considerations

For each point, challenge my assumptions and suggest alternatives.
Use examples from your experience when relevant.
```

Share architectural decisions:

```md
Based on our previous discussion, I'm implementing [component].
Here's my planned approach:
[Your brief explanation]

Before I code: What edge cases am I missing? Where might this break at scale?
```

Technical design from product requirement document:

```md
**参考资料:**

1. 需求文档：
2. 代码仓库：
3. 后端技术方案（可选）：
4. 交互设计（可选）：
5. 待修改的关键文件目录（可选，逗号分割）：

**要求:**

1. 高度总结需求文档的核心内容，包括项目目标、业务场景等，明确项目要解决的核心问题。
2. 参考需求文档和交互设计 Demo 给出整体的技术架构设计，包含架构图、流程图，并详细说明架构设计。
3. 列举项目中涉及的所有实体，并给出实体关系。
4. 通过 UML 图给出关键模块和流程设计。
5. 如果存在后端技术方案则依据接口设计，否则遵循 RESTful 设计要求给出接口设计，完成实体的TS定义。
6. 考虑系统稳定性和监控，考虑可扩展性和可维护性。
7. 基于现有代码仓库代码列出需要做哪些改动，包含改造内容分析和代码文件定位。
8. 输出一份腾讯文档
```

### Analysis

[现状分析](https://zhuanlan.zhihu.com/p/1892580714635047120):

- 了解业务功能:
  - 当前功能如何运作, 用户交互有哪些路径, 具体数据流向是怎样的, 请整理成 mermaid 时序图
  - 输出所属功能中的角色和角色之间的交互方式, 能快速掌握业务模块的大体脉络
- 了解代码实现:
  - 当前代码如何组织, 核心模块有哪些, 组件间如何通信, 梳理组件关系图
  - 输出组件职责和组件间的关系, 以便在投入开发前以组件模块维度确定改动范围
- 了解字段依赖:
  - 梳理当前表单字段的显隐关系、联动逻辑以及数据源
  - 能直观地呈现表单字段间的联动说明

```md
我们先探讨方案, 在我让你写代码之前不要生成代码.
如果此处要加个 xxx 该怎么做,请先逐步分析需求,
在想明白后向我说明为什么要这么设计.
```

### Implementation

Get implementation guidance:

```md
For [specific component], suggest the optimal implementation considering:

- Performance impact.
- Maintenance overhead.
- Testing strategy.

Code examples should follow [your language/framework] best practices.
```

Deep dive into documentation:

```md
You are a [framework/language] expert. I need to implement [feature].
Walk me through:

1. The relevant API methods/classes.
2. Common pitfalls and how to avoid them.
3. Performance optimization techniques.
4. Code examples for each key concept.
```

最小改动原则:

```md
在写代码时遵循最小改动原则, 避免影响原先的功能.
即使识别到历史问题也不要自行优化, 可以先告知我问题描述和对当前需求的影响, 不要直接改跟本次需求无关的代码.
```

审查与验证:

| 目标   | 代码审查                                                | 功能验证                                     |
| ------ | ------------------------------------------------------- | -------------------------------------------- |
| 提示词 | `@git` 逐个文件分析并总结改动点, 评估是否引入了新的问题 | `@git` 基于代码变更输出自测用例清单          |
| 效果   | 在列举出每个文件的改动意图后, 会告知潜在问题和修改意见  | 围绕改动, 生成新旧功能在不同场景中的测试用例 |

## Image

Midjourney [cookbook](https://fka.gumroad.com/l/the-art-of-midjourney-ai-guide-to-creating-images-from-text):

- Themes:
  - Realistic, Realism, Surreal, Surrealism, Unrealistic.
  - Science fiction, Dreamy, Dreampunk, Otherworldly, Abstraction.
  - Fantasy, Dark fantasy, Illusion, Retro, Vintage.
  - Cyberpunk, Rustic, Historic, Futuristic, Sci-fi.
  - Cartoon, Marvel comics, Kawaii, Anime.
- Design styles:
  - Simple, Detailed, Complex, Multiplex, Chaotic.
  - Surface detail, Minimalist, Maximalist, Ukiyo-e, Ukiyo-e flat design.
  - Patterns, Polka dot, Halftone, 20s, 30s, 1940s, 1950s.
  - Decor, 60s, 1800s, 2020s, 4000s, Pop-art, Hi-fi, Gothic.
  - Painting/Graffiti By artists,
    e.g. `By Van Gogh`, `By Pablo Picasso`, `By Leonardo Da Vinci`, `Graffiti By Banksy`.
- Engines:
  - Unreal engine, Cinema4D, 4k, 8k, 16k, Ultra-HD.
  - 2-bit, 4-bit, 8-bit, 16-bit.
  - Disney, Pixar, Dreamworks, IMAX, Pixomondo.
  - Vector graphics, 3D model, Lowpoly, Holographic.
  - Digital art, Pixel art, NFT, Clip art, Character design, Wallpaper.
- Drawing and art mediums:
  - Sketch, Drawing, Hand-drawn, Dot art, Line art.
  - Caricature, Illustration, Pencil art, Charcoal art, Pastel art.
  - Acrylic painting, Oil painting, Watercolor painting, Graffiti, Spray paint.
  - Sticker, Blueprint, Mosaic, Coloring book, Chibi, Paper cut craft.
- Colors and palettes:
  - Red, Orange, Light-gray, Light-purple, Neutral.
  - Multicolored, Black and white, Monochromatic, Sepia, Dark mode.
- Time of the day:
  - Golden hour, High noon, Afternoon, Mid-morning.
  - Blue hour, Sunset, Sunrise, Nighttime.
- Material properties:
  - Transparent, Opaque, Polarized, Prismatic, Glitter, Glowing.
  - Glossy, Shiny, Polished, Melting, Squishy, Dirty.
- Materials and textures:
  - Stone:
    pebbles, cobblestone, rock, bedrock, sandstone,
    marble, gypsum, granite, diorite, andesite.
  - Mineral:
    coal, sulfur, sodalime, geyserite, ceramic,
    enamel, asbestos, fossil, perlite, vermiculite,
    slag, minium, travertine, fulgurite, graphene.
  - Wood:
    wooden, plywood, particle board, hardboard, lumber, planks,
    wooden planks, nailed-wood, wood veneer, petrified wood, oak wood,
    maple wood, acacia-wood, pine-wood, cherry-wood, birch-wood, cedar-wood.
  - Paper:
    cardboard, corrugated fibre-board, paperboard, construction paper,
    card-stock, tracing paper, glassine, tissue paper, kraft paper,
    papyrus, parchment, hemp paper, tar paper.
  - Metal:
    metallic, rusty, foil, tarnish, tin,
    copper, pewter, aluminum, bronze, brass,
    iron, steel, titanium, silver, bismuth.
  - Glass:
    stained glass, sea-grass, obsidian, fiberglass, crystalline,
    borax crystal, amethyst, quartz, rose quartz.
- Lighting:
  - Spotlight, Sunlight, Starlight, Nightlight, Neon lamp, Dot matrix display.
  - Warm light, Hard light, Soft light, Cold light, Neon light.
- Geography and culture:
  - French-style, Turkish-style.
  - Mayan, Arabic, Nordic mythology.
- Shot types:
  - Extreme long shot, Long shot, Medium shot, Close-up shot, Extreme close-up shot.
  - Low angle shot, High angle shot, Night shot, Silhouette shot, Wide shot.
  - Overhead shot, Side-view shot, Centered shot, Back-view shot, Selfie.
- Views:
  - Top-view, Side-view, Satellite-view, View from an airplane, Closeup.
  - Extreme closeup, Epic wide shot, First-person view, Third-person view.
  - Full body, Portrait, Front-view, Bird-view, Macro shot, Macro view.
  - Microscopic, 360 panorama, Ultra-wide angle, 360 angle.
- Film types:
  - DSLR, Night vision, Drone photography, GoPro video.
  - Unregistered Hypercan 2, Hyper-special imaging, Multi-special imaging.
  - Schlieren, Disposable camera, Polaroid, Instax, Lomo, Pinhole photography.
  - VistaVision, Technirama, Techniscope, Panavision, Ambrotype.

## References

- OpenAI prompt [packs](https://academy.openai.com/public/tags/prompt-packs-6849a0f98c613939acef841c).
- Gemini prompts [cookbook](https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf).
- Prompts and skills [community](https://github.com/f/awesome-chatgpt-prompts).
- Vibe coding [prompts](https://docs.google.com/spreadsheets/d/1ngoQOhJqdguwNAilCl1joNwTje7FWWN9WiI2bo5VhpU).
