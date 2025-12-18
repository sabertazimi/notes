# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Awesome Notes is a personal learning notes (TIL - Today I Learned) documentation website built with Docusaurus.
It serves as a comprehensive knowledge repository covering
computer science, programming languages, web technologies, AI, and more.

## Development Commands

### Core Development

- `pnpm dev` or `pnpm start` - Start development server with hot reload
- `pnpm build` - Build the static site for production
- `pnpm serve` - Serve the built site locally (useful for previewing production build)
- `pnpm clear` - Clear Docusaurus cache and build artifacts

### Code Quality

- `pnpm lint` - Run all linters (markdown, style, and TypeScript checks)
- `pnpm lint:notes` - Lint all markdown files in the notes directory
- `pnpm lint:style` - Lint source code and CSS files
- `pnpm lint:type-check` - Run TypeScript type checking without emitting files
- `pnpm lint:fix` - Auto-fix all linting issues

### Release Management

- `pnpm changeset` - Dry run to preview version changes
- `pnpm release` - Commit changes, bump version, and create a tag

## Architecture

### Technology Stack

- **Framework**: Docusaurus with TypeScript
- **Package Manager**: pnpm
- **UI**: React
- **Styling**: CSS with custom styles
- **Math Rendering**: KaTeX with remark-math and rehype-katex
- **Diagrams**: Mermaid support integrated
- **Search**: Local search via @easyops-cn/docusaurus-search-local

### Directory Structure

```plaintext
awesome-notes/
├── notes/              # All documentation content (Markdown files)
│   ├── AI/            # AI and machine learning topics
│   ├── ComputerScience/  # CS fundamentals (Algorithms, OS, Database, etc.)
│   ├── Language/      # Programming languages (C, C++, Go, Rust, etc.)
│   ├── Programming/   # Programming practices and tools
│   └── Web/           # Web technologies (React, Vue, CSS, JS, etc.)
├── src/               # Docusaurus source files and custom CSS
├── static/            # Static assets (images, logos, etc.)
├── docusaurus.config.ts  # Main Docusaurus configuration
└── sidebars.ts        # Auto-generated sidebar configuration
```

### Content Structure

- All notes are Markdown files in the `notes/` directory
- Notes follow the naming pattern `*Notes.md`
- Each note requires frontmatter with author metadata:

  ```yaml
  ---
  author: Sabertazimi
  authorTitle: Web Developer
  authorURL: https://github.com/sabertazimi
  authorImageURL: https://github.com/sabertazimi.png
  tags: [Category, Subcategory]
  ---
  ```

- Sidebar navigation is auto-generated from the directory structure
- Content is organized hierarchically: Domain > Topic > Subtopic

### Key Features

- Math support: LaTeX equations rendered via KaTeX
- Code highlighting: Supports 30+ programming languages
- Diagrams: Mermaid diagrams for visual explanations
- Search: Full-text search with English and Chinese support
- Theme: Dark/light mode with responsive design
- Version control: Shows last update author and time

## Configuration Details

### Docusaurus Configuration (docusaurus.config.ts)

- Base URL adjusts automatically for GitHub Pages deployment
- Math support enabled via remark-math and rehype-katex plugins
- Mermaid diagrams enabled
- Local search configured for documentation only (not blog)
- Edit URLs point to GitHub repository

### Deployment

- **GitHub Pages**: Automatic deployment on main branch via GitHub Actions
- **Vercel**: Alternative deployment configured
- Build artifacts output to `/build` directory
- Base path configured for GitHub Pages (`/awesome-notes/`)

### Development Environment

- Node.js LTS required
- pnpm must be used (not npm or yarn)
- Extensive cSpell dictionary configured in `.vscode/settings.json`
- TypeScript configured with strict mode

## Content Guidelines

### Creating New Notes

1. Create Markdown file in appropriate category under `notes/`
2. Follow the `*Notes.md` naming convention
3. Include required frontmatter with author metadata
4. Use appropriate tags for categorization
5. Leverage Docusaurus components (Tabs, Admonitions, etc.)

### Supported Features in Notes

- JSX/React components via MDX
- LaTeX math equations: `$inline$` and `$$block$$`
- Mermaid diagrams using mermaid code blocks
- Code syntax highlighting with language hints
- Import Docusaurus components: `import Tabs from '@theme/Tabs'`

## CI/CD Pipeline

The GitHub Actions workflow (.github/workflows/ci.yml):

1. **Lint**: Runs all linters on pull requests and pushes
2. **Build**: Builds the site on Ubuntu with Node.js LTS
3. **Deploy**: Deploys to GitHub Pages on successful merge to main
4. **Publish**: Creates GitHub releases for version tags

## Common Tasks

### Adding a New Category

1. Create new directory under `notes/`
2. Add notes following the naming convention
3. Sidebar will auto-update

### Modifying Styles

- Custom CSS in `src/css/custom.css`
- Docusaurus theme can be customized via `docusaurus.config.ts`

### Testing Changes

- Use `pnpm dev` for live preview
- Run `pnpm build` to ensure production build succeeds
- Check `pnpm lint` before committing

## Commit and Pull Request Guidelines

Follows Conventional Commits with changelog auto-generation.
Key types (defined in `.versionrc.json`):

- **feat**: New notes files or new knowledge domains
- **fix**: Updates to existing notes
- **update**: General improvements
- **build**: Build changes
- **perf**: Performance optimizations
- **test**: Test changes

Format: `<type>(<scope>): <description>`
Examples:

- `fix(react-hooks): hook usage examples`
- `feat(ai-llm): comprehensive guide to LLM prompting`

PR titles follow same format.

### Scope Guidelines

- Use specific section/topic from filename (e.g., `react-hooks`, `css-layouts`)
- Use top-level category (e.g., `web-react`) only when changes span multiple areas or don't fit a specific scope

### Description Guidelines

- Summarize the actual knowledge/concept in the commit
- Focus on what changed, not how you changed it
- Be specific: "useEffect cleanup" not "useEffect section"

**Good Examples**:

- `fix(rust-ownership): borrow checker concepts`
- `fix(react-hooks): custom hook patterns`
- `fix(css-layout): flexbox gap vs margin differences`

## Constraints

- DO NOT add Claude co-authorship footer to commits
