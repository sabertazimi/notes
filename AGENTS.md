# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

Notes is a TIL (Today I Learned) documentation website built with Docusaurus.
It serves as a comprehensive knowledge repository covering AI, CS, web, programming, and more.

**Tech Stack**: Docusaurus + TypeScript + shadcn/ui + pnpm + React

**Structure**: `content/{AI,CS,Web,Language,Programming}/{topic}/{file}.md`

## Development Commands

| Command         | Description          |
| --------------- | -------------------- |
| `pnpm dev`      | Start dev server     |
| `pnpm build`    | Build for production |
| `pnpm lint`     | Run all linters      |
| `pnpm lint:fix` | Auto-fix issues      |

## Content Guidelines

- Notes are Markdown files in `content/` directory
- Require frontmatter: `tags: [Category, Subcategory]`
- Supports MDX, KaTeX math (`$inline$`, `$$block$$`), Mermaid diagrams
- Sidebar auto-generated from directory structure

## Commit Guidelines

Follows Conventional Commits format:

- Types: `feat` (new note or domain), `fix` (updates to existing notes), `perf`, `test`, `ci`, `chore`
- Scope:
  - **CRITICAL**: Only 1-2 levels allowed, maximum one `-` separator
  - Single file: Extract from filename omitting top-level (e.g. `react-hooks`)
  - Multi-area changes: Use top-level category (e.g., `web-react`, `cs-algorithm`)
- Description: the actual knowledge/concept name, extracted from headings, code examples, or explanatory text
- Key principle:
  - NEVER use structural words like `section`, `content`, `notes` in description
  - NEVER use action verbs like `add`, `update`, `remove`, `delete`, `modify` in description

Examples:

| File Path                                                 | Scope (1-2 levels only) | Description                   |
| --------------------------------------------------------- | ----------------------- | ----------------------------- |
| `content/web/react/hooks/event.md`                        | `react-hooks`           | `useEffectEvent latest value` |
| `content/language/rust/ownership.md`                      | `rust-ownership`        | `borrow checker rules`        |
| `content/cs/algorithm/sort.md`                            | `algorithm-sort`        | `quick sort partition`        |
| `content/ai/gen/gpt.md` + `content/ai/gen/claude-code.md` | `ai-gen`                | `comparison of models`        |

## Constraints

- DO NOT add Claude co-authorship footer to commits
