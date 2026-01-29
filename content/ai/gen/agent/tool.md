---
sidebar_position: 4
tags: [AI, Generative AI, LLM, Agent, Tool]
---

# Tool

## Taxonomy

[Tool execution](https://www.youtube.com/watch?v=TqC1qOfiVcQ):

1. Built-in: atomic toolkit.
2. Function calling.
3. Bash: composable static scripts.
4. Codegen: dynamic programs.
5. Agent calling: agent tools, subagents, multi-agent systems.

## Documentation

Documentation is important:

- Use clear name and description.
- Simplify parameter lists, describe input and output parameters.
- Add targeted examples.
- Provide default values.

```python
def get_product_information(product_id: str) -> dict:
    """
    Retrieves comprehensive information about a product based on the unique product ID.

    Args:
        product_id: The unique identifier for the product.

    Returns:
        A dictionary containing product details. Expected keys include:
            'product_name': The name of the product.
            'brand': The brand name of the product
            'description': A paragraph of text describing the product.
            'category': The category of the product.
            'status': The current status of the product (e.g., 'active', 'inactive', 'suspended').

    Example return value:
        {
            'product_name': 'Astro Zoom Kid's Trainers',
            'brand': 'Cymbal Athletic Shoes',
            'description': '...',
            'category': 'Children's Shoes',
            'status': 'active'
        }
    """
```

## Agentic

Describe actions, not implementations:

- What over how.
- Explain tool interactions over dictate (规定) workflows.
- Don't duplicate instructions.

## Granularity

- Define clear responsibilities.
- Don't create multi-tools (❌多功能工具❌).

## Output

Concise output:

- Don't return large responses.
- Use external data storage for long-term memory.
- Provide descriptive error messages.

## References

- Agent tools and interoperability [whitepaper](https://www.kaggle.com/whitepaper-agent-tools-and-interoperability-with-mcp).
