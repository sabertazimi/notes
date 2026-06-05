---
name: adding-notes
description: >-
  Add notes to the knowledge repository. Use whenever the user provides content to save
  (commands, config, code, CLI output, explanations) or says "add/save/note/record this",
  "find a place for this", "记录一下", "添加笔记". Do NOT use for creating new topics from
  scratch or splitting/reorganizing notes (use splitting-notes skill).
allowed-tools: Read, Grep, Glob, Edit, Write, AskUserQuestion
---

# Adding Notes

Identify the **core concept** from the user's content, find the best existing file and section, insert concisely.

## Core Principle: Concept ≠ Example

The #1 mistake: treating the **example subject** as the topic.

```text
User provides:  systemctl cat paccache.service
❌  → new "paccache" section
✅  → existing "systemctl cat" section (paccache is just an example)

User provides:  nginx.conf gzip settings
❌  → new "gzip-config.md"
✅  → existing web/nginx/ section
```

**Ask yourself:** Does this knowledge apply to *any* instance, or only this specific one? If "any" → put it with the tool/concept, not the example.

## Workflow

1. **Identify concept** — commands → the command; config → the tool; errors → the pattern; code → the feature
2. **Locate target** — `Grep`/`Glob` for the concept in `content/{ai,cs,language,programming,web}/`. Prefer existing section > existing file new subsection > new file (last resort, ask user)
3. **Insert** — match surrounding language/style density. New files need frontmatter: `tags: [Domain, Topic]` + `sidebar_position`. Available formats: KaTeX, Mermaid, `:::tip`, `./figures/*.webp`
4. **Deduplicate** — same concept better info → update; different angle → supplement; truly new → add
5. **Verify** — concept not example ✓ no duplicates ✓ matching style ✓ frontmatter if new file ✓
