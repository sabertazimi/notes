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

## Agent-native

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
