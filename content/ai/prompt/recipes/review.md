# Code Review

## Request

[Code review](https://github.com/sabertazimi/blog/pull/1572):

```md
You are performing a comprehensive code review on this pull request.
Please analyze the changes and provide feedback in the following structure:

## Summary
Brief overview of what this PR changes.

## :white_check_mark: Strengths
What was done well in this PR.

## :warning: Issues & Suggestions

### 🔴 Critical Issues
- Security vulnerabilities
- Breaking changes
- Bugs that will cause failures

### 🟡 Important Issues
- Performance concerns
- Code quality issues
- Missing error handling

### 🟢 Minor Issues
- Code style improvements
- Documentation gaps

## Specific File Feedback
For each significantly changed file, provide:
- File path
- Brief assessment
- Specific line-by-line feedback if needed

## Project Guidelines Compliance
Check against CLAUDE.md guidelines:
- [ ] Follows conventional commits style
- [ ] No Claude co-authorship footer
- [ ] TypeScript strict mode compliance (no `any` types)
- [ ] Server components first, client only when necessary
- [ ] No removal of `__tests__/mocks/`
- [ ] Uses `pnpm` (never npm/yarn) in docs

## Testing & Validation
- Are tests included or updated?
- Are E2E tests needed?
- Does the code handle edge cases?

## :bulb: Recommendations
Actionable suggestions for improvement.

## :rocket: Overall Assessment
- Approval status (Ready to merge / Needs changes / Major concerns)
- Confidence level (High / Medium / Low)

---

Please be thorough but concise. Focus on actionable feedback that will improve code quality and maintainability.
```

## Confidence Scoring

[Confidence scoring code review](https://github.com/sabertazimi/blog/pull/1573),
based on [Anthropic code review plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-review):

```md
REPO: `${{ github.repository }}`
PR_NUMBER: `${{ github.event.pull_request.number }}`

You are performing an automated code review on this pull request.

Please:

1. Use `gh pr diff` to see the changes
2. Use `gh pr view` to get PR details
3. Analyze the code for:
   - CLAUDE.md guidelines compliance (read CLAUDE.md if it exists)
   - Bugs and issues introduced in this PR
   - Security vulnerabilities
   - Performance concerns
   - Code quality issues
4. For each issue found:
   - Verify it is actually introduced by this PR (not pre-existing)
   - Score your confidence 0-100
   - Only report issues with 80+ confidence
5. Post your review as a PR comment using `gh pr comment ${{ github.event.pull_request.number }} --body <markdown>`

Format your review comment as:

\`\`\`md
## Code review

Found <N> issues:

1. <Issue description> (confidence: <score>)
   <file-with-link>

...
\`\`\`

For code links, use format:

\`\`\`md
https://github.com/<owner>/<repo>/blob/<full-sha>/<path>#L<start>-L<end>
\`\`\`

If no issues with 80+ confidence are found, post a positive review comment.
```

## Agent-Native

[Agent-native code review](https://github.com/sabertazimi/blog/pull/1574):

```md
REPO: ${{ github.repository }}
PR NUMBER: ${{ github.event.pull_request.number }}

You are performing an automated code review on this pull request.

Please:
1. Use `gh pr diff` to see the changes
2. Use `gh pr view` to get PR details
3. Analyze the code for:
   - CLAUDE.md guidelines compliance (read CLAUDE.md if it exists)
   - Bugs and issues introduced in this PR
   - Security vulnerabilities
   - Performance concerns
   - Code quality issues

4. For each issue found:
   - Verify it is actually introduced by this PR (not pre-existing)
   - Score your confidence 0-100
   - Only report issues with 80+ confidence

5. Call `gh pr review` ONCE at the end with:
   - Flag: `--comment`, `--approve`, or `--request-changes` based on findings
   - Body format:
     \`\`\`markdown
     ## Code review
     Found <N> issues:
     1. <Issue description> (confidence: <score>)
        <file-with-link>
     ...
     \`\`\`
   - For code suggestions, use the `+/-` suggestion format for easy apply
   - For code links: https://github.com/<owner>/<repo>/blob/<full-sha>/<path>#L<start>-L<end>
```

## Agent

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
