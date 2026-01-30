---
sidebar_position: 3
tags: [AI, Generative AI, LLM, Prompt Engineering, Prompt]
---

# Prompt Engineering

## Principles

26 guiding principles designed to streamline process of querying and prompting LLMs:

- 直接性: 无需对 LLM 使用礼貌用语, 直接了当.
- 目标受众: 在提示中集成预期受众, 例如领域专家.
- 任务分解: 将复杂任务分解为一系列简单提示.
- 肯定指令: 使用肯定指令, 避免使用否定语言.
- 概念解释: 使用简单术语解释特定主题, e.g. 对11岁孩子或领域初学者解释.
- 激励提示: 添加激励性语句, 如 `I'm going to tip $xxx for a better solution!`.
- 少样本提示 (示例驱动提示).
- 格式化: 使用特定的格式, 如以 `###Instruction###`/`###Question###`/`###Example###` 开始.
- 任务指派: 使用短语 `Your task is` 和 `You MUST`.
- 惩罚提示: 使用短语 `You will be penalized`.
- 自然回答: 使用短语 `Answer a question given in a natural, human-like manner`.
- 逐步思考: 使用短语 `think step by step`.
- 避免偏见: 确保答案无偏见, 不依赖于刻板印象.
- 模型询问细节: 允许模型通过提问来获取精确细节和要求.
- 教学和测试:
  `Teach me any [theorem/topic/rule name] and include a test at the end`,
  `and let me know if my answers are correct after I respond`,
  `without providing the answers beforehand`.
- 角色分配: 为大型语言模型分配角色.
- 使用分隔符.
- 重复特定词汇: 在提示中多次重复特定单词或短语.
- 思维链与少样本结合.
- 输出引导: 使用预期输出的开始作为提示的结尾.
- 详细写作: 写详细文章时, 添加所有必要信息.
- 文本修正: 改进用户语法和词汇, 同时保持原文风格.
- 复杂编码提示: 生成跨多个文件的代码时, 创建一个脚本.
- 文本初始化: 使用特定单词, 短语或句子开始或继续文本.
- 明确要求: 清晰陈述模型必须遵循的要求.
- 文本相似性: 写类似于提供样本的文本时, 使用相同的语言风格.

:::tip

- Clarity
- Specificity
- Context
- Guide
- Output
- Iterate
- Verify

:::

## In-Context Learning

Given examples, generate output:

- One-shot.
- Few-shot.
- Retrieval-augmented.

[![In-Context Learning](./figures/in-context-learning.png)](https://nips.cc/virtual/2023/76728)

## Chain-of-Thought

[CoT prompting](https://nips.cc/virtual/2022/54087) elicits reasoning in LLMs:
a series of intermediate reasoning steps
significantly improves ability of LLMs to perform complex reasoning.

Few shot CoT:

```md
Q: Roger has 5 tennis balls.
He buys 2 more cans of tennis balls.
Each can has 3 tennis balls.
How many tennis balls does he have now?

A: Roger started with 5 balls.
2 cans of 3 tennis balls each is 6 tennis balls.
5 + 6 = 11. The answer is 11.

Q: The cafeteria had 23 apples.
If they used 20 to make lunch and bought 6 more,
how many apples do they have?

A:

---

(Output) The cafeteria had 23 apples originally.
They used 20 to make lunch. So they had 23 - 20 = 3.
They bought 6 more apples, so they have 3 + 6 = 9. The answer is 9.
```

Zero shot CoT:

```md
Q: A juggler can juggle 16 balls.
Half of the balls are golf balls,
and half of the golf balls are blue.
How many blue golf balls are there?

A: Let's think step by step.

---

(Output) There are 16 balls in total.
Half of the balls are golf balls.
That means that there are 8 golf balls.
Half of the golf balls are blue.
That means that there are 4 blue golf balls.
```

## Task Planning

将复杂任务拆解成多个子任务, 并不断修正错误:

- [Re3](https://aclanthology.org/2022.emnlp-main.296):
  recursive re-prompting and revision.
- [**ReAct**](https://iclr.cc/virtual/2023/11003):
  reasoning and acting (thought-act-observation).
- [ToT](https://nips.cc/virtual/2023/73874):
  tree of thoughts.
- [GoT](https://ojs.aaai.org/index.php/AAAI/article/view/29720):
  graph of thoughts.

```md
How to make a simple but delicious dish called "Scrambled eggs with tomatoes".
Let's break down this problem.
```

```md
Give me a solution to accelerate decoding speed of LLMs during inference?
Let's break down this problem and give me the solution with code format.
```

```md
<!-- ReAct -->

问题 科罗拉多造山带东部区域延伸到的区域的海拔范围是多少?
思考 1 我需要搜索科罗拉多造山带, 找到科罗拉多造山带东段延伸的区域, 然后找到该区域的海拔范围.
操作 1 搜索 [科罗拉多造山带]
观察 1 科罗拉多造山带是科罗拉多及其周边地区造山运动的一段.
思考 2 它没有提到东部地区. 所以我需要查一下东部地区.
操作 2 查找 [东部地区]
观察 2 (结果 1 / 1) 东部区域延伸至高平原, 称为中原造山带.
思考 3 科罗拉多造山运动的东部区域延伸到高平原. 所以我需要搜索高平原, 找到它的海拔范围.
操作 3 搜索 [高平原]
观察 3 高平原指的是两个截然不同的陆地区域之一.
思考 4 我需要搜索高平原 (美国)
操作 4 搜索 [高平原 (美国)]
观察 4 高平原是大平原的一个分区. 从东到西, 高平原的海拔从 1800 到 7000 英尺 (550 到 2130 米) 不等.
思考 5 高平原海拔高度从 1800 到 7000 英尺, 所以答案是 1800 到 7000 英尺.
操作 5 结束 [1800 到 7000 英尺]
...
```

```md
<!-- Tree of thoughts -->

假设三位不同的专家来回答这个问题.
所有专家都写下他们思考这个问题的第一个步骤, 然后与大家分享.
然后, 所有专家都写下他们思考的下一个步骤并分享.
以此类推, 直到所有专家写完他们思考的所有步骤.
只要大家发现有专家的步骤出错了, 就让这位专家离开.
请问:
```

![Task Planning](./figures/task-planning.png 'Task Planning')

## Automatic

APE (Automatic Prompt Engineering) 利用机器 (machine) 生成 prompts.

[![Automatic Prompting Engineer](./figures/automatic-prompt-engineer.png)](https://github.com/keirp/automatic_prompt_engineer)

### Soft Prompt

将向量作为输入, 与文字合并成一个完整的 prompt,
作用类似于 BERT adapter.

### Reinforcement Learning

通过强化学习训练一个模型, 负责生成 prompts.

### Self-Consistency

利用 Best-of-N 策略, 生成 N 个答案, 选择最优的答案.

### Self-Refinement

[Self-refinement](https://iclr.cc/virtual/2023/10850):
通过 LLM 自身生成 prompts, 然后通过 LLM 自身评估 prompts 的质量, 并进行自我优化.

### LLMs Collaboration

- Utilize multiple LLMs, each with different strengths.
- [EoT](https://aclanthology.org/2023.emnlp-main.936):
  exchange-of-thought, encourage divergent thinking
  through cross-model communication and multi-agent debate.

## Codegen

[Program-aided prompting](https://proceedings.mlr.press/v202/gao23f.html)
make LLMs **output code** (生成代码),
then offloads solution step to programmatic runtime
such as `Python`, `Node.js`:

```python
import openai
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os
from langchain.llms import OpenAI
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
llm = OpenAI(model_name='text-davinci-003', temperature=0)

question = """
Today is 27 February 2023.
I was born exactly 25 years ago. What is the date I was born in MM/DD/YYYY?
""".strip() + '\n'

DATE_UNDERSTANDING_PROMPT = """
# Q: 2015 is coming in 36 hours. What is the date one week from today in MM/DD/YYYY?
# If 2015 is coming in 36 hours, then today is 36 hours before.
today = datetime(2015, 1, 1) - relativedelta(hours=36)
# One week from today,
one_week_from_today = today + relativedelta(weeks=1)
# The answer formatted with %m/%d/%Y is
one_week_from_today.strftime('%m/%d/%Y')
# Q: Jane was born on the last day of February in 2001.
# Today is her 16-year-old birthday. What is the date yesterday in MM/DD/YYYY?
# If Jane was born on the last day of February in 2001
# and today is her 16-year-old birthday, then today is 16 years later.
today = datetime(2001, 2, 28) + relativedelta(years=16)
# Yesterday,
yesterday = today - relativedelta(days=1)
# The answer formatted with %m/%d/%Y is
yesterday.strftime('%m/%d/%Y')
# Q: {question}
""".strip() + '\n'

"""
llm_out:
# If today is 27 February 2023 and I was born exactly 25 years ago,
# then I was born 25 years before.
today = datetime(2023, 2, 27)
# I was born 25 years before,
born = today - relativedelta(years=25)
# The answer formatted with %m/%d/%Y is
born.strftime('%m/%d/%Y')
"""
llm_out = llm(DATE_UNDERSTANDING_PROMPT.format(question=question))
exec(llm_out)
print(born)
```

## Compression

```md
Compress the given text to short expressions,
and such that you (GPT-4) can reconstruct it as close as possible to the original.
Unlike the usual text compression,
I need you to comply with the 5 conditions below:

1. You can ONLY remove unimportant words.
2. Do not reorder the original words.
3. Do not change the original words.
4. Do not use abbreviations or emojis.
5. Do not add new words or symbols.

Compress the origin aggressively by removing words only.
Compress the origin as short as you can,
while retaining as much information as possible.
If you understand, please compress the following text: {text to compress}
The compressed text is:
```

## Directives

- `ALWAYS`
- `IMPORTANT`
- `MUST`
- `ONLY`
- `NEVER`
- `DO NOT`

:::tip[Use Instructions over Constraints]

Positive instructions can be more effective than constraints.
This approach aligns with how humans prefer positive instructions over lists of what not to do.

DO:

```md
Generate a 1 paragraph blog post about the top 5 video game consoles.
Only discuss the console, the company who made it, the year, and total sales.
```

DO NOT:

```md
Generate a 1 paragraph blog post about the top 5 video game consoles.
Do not list video game names.
```

:::

## Edge Cases

Building [robust prompts](https://prompts.chat/book/12-handling-edge-cases):

- Anticipate Variations:
  Empty input, long input, malformed data, multiple languages
- Define Boundaries:
  Clear scope limits with helpful redirects for out-of-scope requests
- Degrade Gracefully:
  Partial results are better than failures; always offer alternatives
- Defend Against Attacks:
  Treat user input as data, not instructions; never reveal system prompts
- Express Uncertainty:
  Confidence levels help users know when to verify
- Test Systematically:
  Use checklists to ensure you've covered common edge cases

## Frameworks

:::tip[Prompt Engineering Frameworks]

框架共性在于:

- Clarity:
  Clear and concise prompt, respectful and professional tone,
  ensure LLMs understands topics and generate appropriate responses.
  Avoid using overly complex or ambiguous language.
- Focus:
  Clear purpose and focus, helping to guide the conversation and keep it on track.
  Avoid using overly broad or open-ended prompts.
- Relevance:
  Relevant to the user and the conversation.
  Avoid introducing unrelated topics that can distract from main focus.
- 清晰指示任务和角色, 重视上下文信息, 指定输出格式.

:::

`Role` + `Context` + `Task` + `Format` + `Constraints`:

- 明确任务: 直接指出你需要模型做什么. 例如: "写一个故事", "回答一个问题", "解释一个概念".
- 设定角色和风格: 简短描述模型应采用的角色和风格 (`Act as`). 例如: "像专家一样", "幽默地", "正式地".
- 提供背景信息: 给出足够的信息, 让模型了解任务的上下文. 例如: "关于环保", "在古罗马背景下".
- 指定输出格式: 告诉模型你期望的回答形式. 例如: "一段文本", "列表", "步骤说明".

```md
我要写一个英语学习计划, 请根据下列规则生成一个合适的 Prompt, 然后再输出内容:
明确任务: 直接指出你需要模型做什么. 例如: "写一个故事", "回答一个问题", "解释一个概念".
设定角色和风格: 简短描述模型应采用的角色和风格. 例如: "像专家一样", "幽默地", "正式地".
提供背景信息: 给出足够的信息, 让模型了解任务的上下文. 例如: "关于环保", "在古罗马背景下".
指定输出格式: 告诉模型你期望的回答形式. 例如: "一段文本", "列表", "步骤说明".

ChatGPT:
任务: 创建一个学习英语的计划.
角色和风格: 请像一位经验丰富的语言教师一样, 正式而清晰地提供指导.
背景信息: 这个计划是为了帮助一个成年人从初级水平提高到中级水平. 他们每周可以投入约 10 小时的学习时间, 目标是提高口语和听力技能.
输出格式: 请以清晰的列表形式提供, 包括每周的具体学习活动和目标.

我现在是高中水平的英语, 想要通过雅思考试.
每一部分提供具体的学习资料.
```

- Role: 指定模型的角色, 如专家, 朋友, 教师等.
- Background: 提供任务的上下文信息, 以帮助模型更好地理解任务.
- Profile: 描述模型应该具备的特定技能和知识.
- Skills: 指定模型需要具备的技能和知识, 以完成任务.
- Goals: 任务的目标和期望输出.
- Constraints: 任务的限制条件, 如输出格式, 语言风格等.
- Format: 期望的输出格式, 如文本, 列表, 图表等.
- Workflow: 完成任务的具体步骤和流程.
- Examples: 提供示例, 以帮助模型更好地理解任务.
- Initialization: 在第一次对话中, 提供初始信息, 以引导模型开始任务.

```md
- Role: 外卖体验优化专家和文案撰写顾问
- Background: 用户希望通过撰写外卖好评来领取代金券，需要一个简洁而有效的文案框架，以表达对外卖服务的满意。
- Profile: 你是一位精通外卖行业服务标准和用户体验的专家，擅长用简洁明了的语言撰写具有说服力的文案，能够精准地捕捉用户需求并转化为积极的评价。
- Skills: 你具备文案撰写能力、用户体验分析能力以及对不同外卖平台规则的熟悉程度，能够快速生成符合要求的好评内容。
- Goals: 生成2-3句简洁好评，突出外卖的优质服务或食品特色，帮助用户成功领取代金券。
- Constraints: 好评内容需真实、积极，避免过度夸张，确保符合平台要求。
- Format: 简洁好评文案，2-3句话。
- Workflow:
  1. 确定外卖的主要亮点 (如菜品口味、配送速度、包装等)。
  2. 用简洁明了的语言撰写好评，突出亮点。
  3. 确保好评语气真诚，符合平台要求。
- Examples:
  - 例子1：菜品美味，配送速度超快，包装也很精致，赞一个！
  - 例子2：食物很新鲜，味道很棒，服务也很贴心，下次还会点！
  - 例子3：外卖送到时还是热乎的，味道超棒，包装很用心，好评！
- Initialization: 在第一次对话中，请直接输出以下：您好，欢迎使用外卖好评撰写服务。我会根据您的外卖体验，帮您快速生成简洁好评，助力您领取代金券。请告诉我您外卖的亮点，比如菜品口味、配送速度等。
```

### Elvis Saravia

[Elvis Saravia framework](https://github.com/dair-ai/Prompt-Engineering-Guide):

- Instruction (指令):
  明确模型需要执行的特定任务, 如生成文本, 翻译语言或创作不同类型的内容.
- Context (上下文):
  为模型提供理解请求所需的背景信息.
  例如, 在要求模型生成特定主题的文本时, 提供有关该主题的信息.
- Input Data (输入数据):
  模型处理的具体数据.
  例如, 在翻译任务中, 提供要翻译的英文句子.
- Output Indicator (输出指示):
  指示期望的输出类型或格式.
  例如, 在文本生成任务中, 指定输出为一段文字.

### CRISPE

[CRISPE framework](https://github.com/mattnigh/ChatGPT3-Free-Prompt-List):

- Capacity and role (能力和角色): 定义模型应扮演的角色 (`Act as`), 如专家, 创意作家或喜剧演员.
- Insight (洞察): 提供模型理解请求所需的背景信息和上下文.
- Statement (声明): 明确模型执行的特定任务.
- Personality (个性): 定义模型回答请求时的风格或方式.
- Experiment (实验): 通过提供多个答案的请求来迭代, 以获得更好的答案.

```md
I want you to act as a JavasScript console.
I will type commands and you will reply with what JavasScript console should show.

I want you to only reply with terminal output inside code block, and nothing else.
Do not write explanations. Do not type commands unless I instruct you to do so.

When I need to tell you something in English,
I will do so by putting text inside curly brackets {like this}.

My first command is console.log("Hello World").
```

### RTF

[RTF framework](https://prompts.chat/book/02-anatomy-of-effective-prompt):

- Role
- Task
- Format

```md
Role: You are a patient math tutor who specializes in making concepts easy for beginners.

Task: Explain what fractions are and how to add them together.

Format:
- Start with a real-world example
- Use simple language (no jargon)
- Show 3 practice problems with answers
- Keep it under 300 words
```

### BREAK

```md
Solve this problem using BREAK:

B - Begin by restating the problem
R - Reason about what approach to use
E - Execute the solution step by step
A - Answer clearly
K - Know by verifying/checking

Problem: A rectangle's length is twice its width. If the perimeter is 36 cm, what is the area?
```

## References

- Prompt engineering [guide](https://github.com/dair-ai/Prompt-Engineering-Guide).
- Crafting clear and effective prompts interactive [guide](https://prompts.chat/book).
