---
sidebar_position: 2
tags: [AI, Generative AI, LLM, Agent, MCP, Best Practice]
---

# Model Context Protocol

[![Model Context Protocol](./figures/model-context-protocol.png)](https://www.kaggle.com/whitepaper-agent-tools-and-interoperability-with-mcp)

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    }
  }
}
```

## Tool

- `name`
- `title`
- `description`
- `inputSchema`
- `outputSchema`
- `annotations`: `destructiveHint`, `idempotentHint`, `openWorldHint`, `readOnlyHint`.

```json
{
  "name": "get_stock_price",
  "title": "Stock Price Retrieval Tool",
  "description": "Get stock price for a specific ticker symbol. If 'date' is provided, it will retrieve closing price.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "symbol": {
        "type": "string",
        "description": "Stock ticker symbol"
      },
      "date": {
        "type": "string",
        "description": "Date to retrieve (in YYYY-MM-DD format)"
      }
    },
    "required": ["symbol"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "price": {
        "type": "number",
        "description": "Stock price"
      },
      "date": {
        "type": "string",
        "description": "Stock price date"
      }
    },
    "required": ["price", "date"]
  },
  "annotations": {
    "readOnlyHint": "true"
  }
}
```

## Error Handling

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Unknown tool: invalid_tool_name. It may be misspelled, or the tool may not exist on this server."
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Failed to fetch weather data: API rate limit exceeded. Wait 15 seconds before calling this tool again."
      }
    ],
    "isError": true
  }
}
```

## Security

- Explicit allowlist.
- Package pinning.
- Secure gateway.
- Controlled server environment.
- Prevent naming collisions.
- Lifecycle hooks.
- Require human-in-the-loop (HITL): long-running operations, high-risk operations.
- Input validation.
- Output sanitization.
- Separate system prompts.
- Least privilege.

## Best Practices

Build [good](https://www.philschmid.de/mcp-best-practices) MCP servers:

- Outcomes over operations: don't convert REST APIs 1:1 into MCP tools.
- Flatten arguments.
- Fewer tools and tighter responses:
  - 5–15 tools per server.
  - One server, one job.
  - Delete unused tools.
  - Split by persona (Admin/user).
- Name for discovery `{service}_{action}_{resource}`: e.g. `slack_send_message`, `linear_list_issues`.
- Paginate large results.

:::tip[No MCP]

Use [MCPorter](https://github.com/steipete/mcporter) to wrap MCP servers into CLI tools.

:::

## Library

### SDK

- [FastMCP](https://github.com/jlowin/fastmcp):
  Build MCP servers and clients.

### API

- [Context7](https://github.com/upstash/context7).
- [APIFox](https://github.com/apifox/apifox-mcp-server).

### Browser

- [Playwright](https://github.com/microsoft/playwright-mcp).
- [StageWise](https://github.com/stagewise-io/stagewise).

### Backend

- [Database](https://github.com/Anarkh-Lee/universal-db-mcp).

### Integration

- [Figma](https://github.com/figma/mcp-server-guide).
- [Notion](https://github.com/makenotion/claude-code-notion-plugin).
- [Blender](https://github.com/ahujasid/blender-mcp).
- [n8n](https://github.com/czlonkowski/n8n-mcp).

### Memory

- [Memory](http://github.com/doobidoo/mcp-memory-service):
  Automatically captures project context, architecture decisions, and code patterns.

### Collections

- [Registry](https://github.com/modelcontextprotocol/registry):
  Official registry.
- [Pulse](https://www.pulsemcp.com):
  Directory.
- [MCP](https://mcpservers.org):
  Collection.
- [Awesome](https://github.com/punkpeye/awesome-mcp-servers):
  List.

## References

- MCP [specification](https://github.com/modelcontextprotocol/modelcontextprotocol).
- MCP [whitepaper](https://www.kaggle.com/whitepaper-agent-tools-and-interoperability-with-mcp).
