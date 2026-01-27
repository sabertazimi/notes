---
sidebar_position: 21
tags: [AI, Generative AI, LLM, Agent, Security, Guardrail]
---

# Security

## Principles

安全[三要素](https://storage.googleapis.com/gweb-research2023-media/pubtools/1018686.pdf):

- Human controllers.
- Limited powers.
- Observable actions.

## Guidelines

Anthropic 使用 [Constitutional AI](https://constitutional.ai) 对齐模型,
确保模型生成的内容符合以下[章程](https://www.anthropic.com/news/claude-new-constitution):

- Broadly safe.
- Broadly ethical.
- Compliant with Anthropic’s guidelines.
- Genuinely helpful.
- Principals: Anthropic > operators > users.

## Evaluation

Evaluation for safety:

- Systematic red teaming.
- Automated filters.
- Human review.
- Adherence to guidelines.

## Guardrails

构建防护措施:

- 相关性分类器:
  确保智能体响应保持在预期范围内, 通过标记偏离主题的查询.
- 安全分类器:
  检测试图利用系统漏洞的不安全输入 (越狱或提示注入).
- PII 过滤器:
  通过审查模型输出中任何潜在的个人身份信息 (PII), 防止不必要的个人身份信息泄露.
- 内容审核:
  标记有害或不当的输入 (仇恨言论、骚扰、暴力), 以保持安全、尊重的互动.
- 工具安全措施:
  通过评估您代理可用的每个工具的风险,
  并根据只读与写入访问、可逆性、所需的账户权限和财务影响等因素分配低、中或高评级.
  使用这些风险评级来触发自动化操作,
  例如在高风险功能执行前暂停进行防护措施检查, 或在需要时升级到人工干预.
- 基于规则的防御:
  简单的确定性措施 (黑名单、输入长度限制、正则表达式过滤器) 以防止已知的威胁,
  如禁止的术语或 SQL 注入.
- 基于推理的防御:
  使用模型本身来评估输入、输出或代理内部推理中的潜在风险.
- 输出验证:
  通过提示工程和内容检查确保响应与品牌价值一致, 防止可能损害品牌完整性的输出.

```python
from agents import (
  Agent,
  GuardrailFunctionOutput,
  InputGuardrailTripwireTriggered,
  RunContextWrapper,
  Runner,
  TResponseInputItem,
  input_guardrail,
  Guardrail,
  GuardrailTripwireTriggered
)
from pydantic import BaseModel

class ChurnDetectionOutput(BaseModel):
  is_churn_risk: bool
  reasoning: str

churn_detection_agent = Agent(
  name="Churn Detection Agent",
  instructions="识别用户消息是否表示潜在的客户流失风险.",
  output_type=ChurnDetectionOutput,
)

@input_guardrail
async def churn_detection_tripwire(
   ctx: RunContextWrapper[None],
   agent: Agent,
   input: str | list[TResponseInputItem]
) -> GuardrailFunctionOutput:
  result = await Runner.run(churn_detection_agent, input, context=ctx.context)

  return GuardrailFunctionOutput(
    output_info=result.final_output,
    tripwire_triggered=result.final_output.is_churn_risk,
  )

customer_support_agent = Agent(
  name="Customer support agent",
  instructions="您是客户支持代理. 您帮助客户解决他们的问题.",
  input_guardrails=[Guardrail(guardrail_function=churn_detection_tripwire)]
)

async def main():
  # 这应该没问题
  await Runner.run(customer_support_agent, "你好！")
  print("你好消息已通过")

  # 这应该触发防护措施
  try:
    await Runner.run(customer_support_agent, "我想取消订阅")
    print("防护措施未触发 - 这是意料之外的")
  except GuardrailTripwireTriggered:
    print("流失检测防护措施已触发")
```

:::tip[Human-in-the-Loop]

关键的安全保障措施:
当超出失败阈值或高风险操作时, 触发人工干预计划

:::
