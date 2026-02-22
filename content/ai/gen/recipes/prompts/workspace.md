# Workspace

## Settings

`.claude/settings.json`:

```json
{
  "alwaysThinkingEnabled": true,
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": ["Bash", "Edit", "Skill"]
  }
}
```

## Instructions

`CLAUDE.md`:

```md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Purpose

This workspace is used for **centralized management of config files** that need to be synchronized across multiple repositories.

## Synced Configuration Files

Configuration files maintained across repositories:

- `.claude/settings.json` - Claude Code settings
- `.github/renovate.json` - Renovate dependency automation
- `.prettierrc.json` - Code formatting
- `.stylelintrc.json` - Style linting
- `.gitattributes` - Git attributes
- etc.

## Sync Workflow

**User commands apply to all repositories by default**, not the workspace root itself.

Example: "update Claude Code `defaultMode`" means updating `.claude/settings.json` in each repository, not workspace directory.

When applying user commands:

1. **Discover repositories** - `ls -d */` to list all repos
2. **Apply to each repo** - Execute the change in each repository separately
3. **Commit per repository** - Each repository needs its own git commit

### Edge Cases

**Monorepos**:Some repositories may contain subdirectories with their own configuration files that also need to be synchronized.
Always search recursively to discover all instances.
```
