# AGENTS.md

This file provides guidance to code agents when working with code in this repository.

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
├── notes/                # All documentation content (Markdown files)
│   ├── AI/               # AI and machine learning topics
│   ├── CS/               # CS fundamentals (Algorithms, OS, Database, etc.)
│   ├── Web/              # Web technologies (React, Vue, CSS, JS, etc.)
│   ├── Language/         # Programming languages (C, C++, Go, Rust, etc.)
│   └── Programming/      # Programming practices and tools
├── src/                  # Docusaurus source files and custom CSS
├── static/               # Static assets (images, logos, etc.)
├── docusaurus.config.ts  # Main Docusaurus configuration
└── sidebars.ts           # Auto-generated sidebar configuration
```

### Content Structure

- All notes are Markdown files in the `notes/` directory
- Each note requires frontmatter:

  ```yaml
  ---
  tags: [Category, Subcategory]
  ---
  ```

  ```yaml
  ---
  sidebar_position: 8
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
2. Use appropriate tags for categorization
3. Leverage Docusaurus components (Tabs, Admonitions, etc.)

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

Follows Conventional Commits format:

- Types: `feat` (new notes/domains), `fix` (updates to existing notes), `update`, `build`, `perf`, `test`
- Scope:
  - Extract from filename omitting top-level (e.g. `react-hooks`)
  - Use category only for multi-area changes (e.g. `web-react`)
- Description: the actual knowledge/concept name, extracted from headings, code examples, or explanatory text
- Key principle:
  - NEVER use structural words like `section`, `content`, `notes` in description
  - NEVER use action verbs like `add`, `update`, `remove`, `delete`, `modify` in description

Examples:

- Bad: `fix(react-hooks): add useEffect section`
- Good: `fix(react-hooks): useEffect cleanup functions`
- Bad: `fix(rust): add ownership part`
- Good: `fix(rust-ownership): borrow checker rules`

## Constraints

- DO NOT add Claude co-authorship footer to commits
