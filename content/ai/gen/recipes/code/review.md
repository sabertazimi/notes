# Code Review

Code review [agent](https://nader.substack.com/p/the-complete-guide-to-building-agents):

```python
import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

interface ReviewResult {
  issues: Array<{
    severity: "low" | "medium" | "high" | "critical";
    category: "bug" | "security" | "performance" | "style";
    file: string;
    line?: number;
    description: string;
    suggestion?: string;
  }>;
  summary: string;
  overallScore: number;
}

const reviewSchema = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
          category: { type: "string", enum: ["bug", "security", "performance", "style"] },
          file: { type: "string" },
          line: { type: "number" },
          description: { type: "string" },
          suggestion: { type: "string" }
        },
        required: ["severity", "category", "file", "description"]
      }
    },
    summary: { type: "string" },
    overallScore: { type: "number" }
  },
  required: ["issues", "summary", "overallScore"]
};

async function runCodeReview(directory: string): Promise<ReviewResult | null> {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`🔍 Code Review Agent`);
  console.log(`📁 Directory: ${directory}`);
  console.log(`${"=".repeat(50)}\n`);

  let result: ReviewResult | null = null;

  for await (const message of query({
    prompt: `Perform a thorough code review of ${directory}.

Analyze all source files for:
1. Bugs and potential runtime errors
2. Security vulnerabilities
3. Performance issues
4. Code quality and maintainability

Be specific with file paths and line numbers where possible.`,
    options: {
      model: "opus",
      allowedTools: ["Read", "Glob", "Grep", "Task"],
      permissionMode: "bypassPermissions",
      maxTurns: 250,
      outputFormat: {
        type: "json_schema",
        schema: reviewSchema
      },
      agents: {
        "security-scanner": {
          description: "Deep security analysis for vulnerabilities",
          prompt: `You are a security expert. Scan for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Sensitive data exposure
- Insecure dependencies`,
          tools: ["Read", "Grep", "Glob"],
          model: "sonnet"
        } as AgentDefinition
      }
    }
  })) {
    // Progress updates
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if ("name" in block) {
          if (block.name === "Task") {
            console.log(`🤖 Delegating to: ${(block.input as any).subagent_type}`);
          } else {
            console.log(`📂 ${block.name}: ${getToolSummary(block)}`);
          }
        }
      }
    }

    // Final result
    if (message.type === "result") {
      if (message.subtype === "success" && message.structured_output) {
        result = message.structured_output as ReviewResult;
        console.log(`\n✅ Review complete! Cost: $${message.total_cost_usd.toFixed(4)}`);
      } else {
        console.log(`\n❌ Review failed: ${message.subtype}`);
      }
    }
  }

  return result;
}

function getToolSummary(block: any): string {
  const input = block.input || {};
  switch (block.name) {
    case "Read": return input.file_path || "file";
    case "Glob": return input.pattern || "pattern";
    case "Grep": return `"${input.pattern}" in ${input.path || "."}`;
    default: return "";
  }
}

function printResults(result: ReviewResult) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 REVIEW RESULTS`);
  console.log(`${"=".repeat(50)}\n`);

  console.log(`Score: ${result.overallScore}/100`);
  console.log(`Issues Found: ${result.issues.length}\n`);
  console.log(`Summary: ${result.summary}\n`);

  const byCategory = {
    critical: result.issues.filter(i => i.severity === "critical"),
    high: result.issues.filter(i => i.severity === "high"),
    medium: result.issues.filter(i => i.severity === "medium"),
    low: result.issues.filter(i => i.severity === "low")
  };

  for (const [severity, issues] of Object.entries(byCategory)) {
    if (issues.length === 0) continue;

    const icon = severity === "critical" ? "🔴" :
                 severity === "high" ? "🟠" :
                 severity === "medium" ? "🟡" : "🟢";

    console.log(`\n${icon} ${severity.toUpperCase()} (${issues.length})`);
    console.log("-".repeat(30));

    for (const issue of issues) {
      const location = issue.line ? `${issue.file}:${issue.line}` : issue.file;
      console.log(`\n[${issue.category}] ${location}`);
      console.log(`  ${issue.description}`);
      if (issue.suggestion) {
        console.log(`  💡 ${issue.suggestion}`);
      }
    }
  }
}

# Run the review
async function main() {
  const directory = process.argv[2] || ".";
  const result = await runCodeReview(directory);

  if (result) {
    printResults(result);
  }
}

main().catch(console.error);
```
