# Ralph Loop

Ralph loop [paradigm](https://mp.weixin.qq.com/s/K4ZUGBzT0s9RwFlaYcuHiA):

```bash
scripts/ralph/
├── ralph.sh
├── prompt.md
├── prd.json
└── progress.txt
```

## Scripts

```bash
#!/bin/bash
set -e
MAX_ITERATIONS=${1:-10}
SCRIPT_DIR="$(cd "$(dirname \
  "${BASH_SOURCE[0]}")" && pwd)"
echo "🚀 Starting Ralph"
for i in $(seq 1 $MAX_ITERATIONS); do
  echo "═══ Iteration $i ═══"
  OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" \
    | amp --dangerously-allow-all 2>&1 \
    | tee /dev/stderr) || true
  if echo "$OUTPUT" | \
    grep -q "<promise>COMPLETE</promise>"
  then
    echo "✅ Done!"
    exit 0
  fi
  sleep 2
done
echo "⚠️ Max iterations reached"
exit 1
```

## Prompt

Ralph loop [prompt](../prompts/ralph.md):

1. Task.
2. Priority.
3. Feedback.
4. Progress Format.
5. Codebase Patterns.
6. Code Quality.
7. Stop Condition.
8. Loop.

## PRD

```json
{
  "branchName": "ralph/feature",
  "userStories": [
    {
      "id": "US-001",
      "title": "Add login form",
      "acceptanceCriteria": [
        "Email/password fields",
        "Validates email format",
        "typecheck passes"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

## Progress

```plaintext
# Ralph Progress Log
Started: 2024-01-15
## Codebase Patterns
- Migrations: IF NOT EXISTS
- Types: Export from actions.ts
## Key Files
- db/schema.ts
- app/auth/actions.ts
---
## 2024-01-15 - US-001
- What was implemented: Added login form with email/password fields
- Files changed: app/auth/login.tsx, app/auth/actions.ts
- **Learnings:**
  - Patterns discovered: Use IF NOT EXISTS for migrations
  - Gotchas encountered: Need to handle email validation on both client and server
---
```
