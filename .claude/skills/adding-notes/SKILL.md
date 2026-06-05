---
name: adding-notes
description: >-
  Add notes to the knowledge repository. Use this skill whenever the user provides content
  to save — commands, config snippets, code examples, CLI output, explanations, or any
  knowledge worth recording. Also use when the user says "add this", "save this", "note this",
  "find a place for this", "记录一下", "添加笔记", or provides output like `systemctl cat`,
  config files, or command results without explicitly asking to "add a note". Do NOT use for
  creating entirely new topic files from scratch (that's a writing task) or for
  splitting/reorganizing existing notes (use the splitting-notes skill).
allowed-tools: Read, Grep, Glob, Edit, Write, AskUserQuestion
---

# Adding Notes

## Overview

Add content to the repository by identifying the **core concept** the user wants to record,
finding the best existing file and section, and inserting the note cleanly.

## When to Use

**Use when:**

- User provides content and asks to "add/note/save/record this"
- User says "find the right place for this"
- User pastes commands, config snippets, CLI output, code, or explanations
- User shares something they learned ("今天学到了...")

**Don't use when:**

- User asks to create a brand-new topic from scratch (writing task, not note placement)
- User asks to split or reorganize notes (use `splitting-notes` skill)

## Content Structure

The repository follows this hierarchy:

```text
content/{Domain}/{Topic}/{file}.md
```

**Domains:** `ai` | `cs` | `language` | `programming` | `web`

Each topic directory may contain:

- An index file (`{topic}.md`) with links to child pages
- Content files (`{subtopic}.md`)
- A `figures/` directory for images (`.webp` format)
- Optional `recipes/` for structured examples

## Core Principle: Identify the Concept, Not the Example

The most common mistake is treating the **example subject** as the topic.

### Diagnostic Questions

Before writing, ask yourself:

1. What **command/tool/concept** is the user demonstrating?
2. Is the specific subject (paccache, nginx, docker) just an **example** of a broader concept?
3. Would this knowledge apply to **any** instance, or only this specific one?

If the answer to #3 is "any" → the note belongs with the **tool/concept** documentation.

### Examples

**Example 1 — Command output:**

```text
User provides:  systemctl cat paccache.service
                 systemctl cat paccache.timer
❌ WRONG:  ### Cache Service (paccache-specific section)
✅ RIGHT:  Add to existing `systemctl cat` section (paccache is just an example)
```

**Example 2 — Config snippet:**

```text
User provides:  nginx.conf with gzip settings
❌ WRONG:  New `paccache-nginx.md` file
✅ RIGHT:  Add gzip config to `web/nginx/` under the relevant nginx section
```

**Example 3 — Code pattern:**

```text
User provides:  React useMemo example for expensive calculation
❌ WRONG:  New file about the specific calculation
✅ RIGHT:  Add to `web/react/hooks/` or `web/react/components.md` useMemo section
```

**Example 4 — Error/solution:**

```text
User provides:  "got 'permission denied' when running docker without sudo"
❌ WRONG:  Note about this specific error message
✅ RIGHT:  Add to Docker or Linux permissions section about user group setup
```

## Implementation

### Step 1: Identify the Core Concept

| User provides    | Core concept is                                          |
| ---------------- | -------------------------------------------------------- |
| Commands         | The command itself (`systemctl cat`, `docker inspect`)   |
| Config files     | The tool/format, not the specific instance               |
| Error messages   | The troubleshooting pattern or root cause                |
| CLI output       | The command that produced it                             |
| Code snippets    | The language feature or pattern demonstrated             |
| Explanations     | The underlying concept or principle                      |

### Step 2: Locate the Target

Search strategy:

1. `Grep` for the core concept across `content/`
2. `Glob` for files named after the tool/topic
3. Check index files for topic navigation

Placement priority:

1. **Existing section** about the same concept → add to it directly
2. **Existing file** in the relevant domain → add a new `##` subsection
3. **New file** (last resort — ask user to confirm the path)

### Step 3: Write the Note

**Format rules:**

- Frontmatter is required for new files: `tags: [Domain, Topic]` and `sidebar_position`
- No frontmatter needed when adding to an existing file
- Headings and technical terms in English
- Explanatory prose can be Chinese or English — **match the surrounding content**
- Keep note density consistent with nearby sections

**Available formatting:**

- Markdown: headers, code blocks, tables, lists, blockquotes
- MDX: interactive components
- KaTeX: `$inline$` and `$$block$$` math
- Mermaid: diagrams in code blocks
- Admonitions: `:::tip`, `:::info`, `:::warning`
- Figures: `./figures/name.webp`

### Step 4: Handle Duplicates

If similar content already exists:

- **Same concept, better info** → update the existing note
- **Same concept, different angle** → add as alternative approach
- **Different concept, same file** → add as new subsection

When in doubt, add and let the user decide.

### Step 5: Verify

- [ ] Note is under the **core concept** section, not the example subject
- [ ] No duplicated information
- [ ] No unnecessary new file
- [ ] Language and density match surrounding content
- [ ] Frontmatter present if new file created
- [ ] Index file updated if new file was created

## Common Mistakes

| Mistake                     | Example                                       | Fix                                        |
| --------------------------- | --------------------------------------------- | ------------------------------------------ |
| Mistaking example for topic | paccache section instead of `systemctl cat`   | Ask: "does this apply only to X, or any?"  |
| New file unnecessarily      | New `paccache.md` when `system.md` exists     | Search for existing sections first         |
| Adding too much context     | Full config dump when one line suffices       | Match density of surrounding notes         |
| Wrong domain                | Rust note in `cs/` instead of `language/rust/`| Follow domain hierarchy                    |
| Ignoring existing sections  | Adding parallel section instead of extending  | Merge into existing section                |
| Missing frontmatter         | New file without `tags`                       | Always add `tags` + `sidebar_position`     |

## Quick Reference

| Step | Action                  | Tool           |
| ---- | ----------------------- | -------------- |
| 1    | Identify core concept   | —              |
| 2    | Search existing content | `Grep`/`Glob`  |
| 3    | Read candidate files    | `Read`         |
| 4    | Write/insert note       | `Edit`/`Write` |
| 5    | Verify & check dupes    | `Grep`         |
