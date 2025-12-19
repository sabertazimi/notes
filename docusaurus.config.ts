import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import ci from 'ci-info'
import { themes } from 'prism-react-renderer'
import katex from 'rehype-katex'
import math from 'remark-math'

const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula

const config: Config = {
  title: 'Awesome Notes',
  tagline: 'Today I Learned',
  url: 'https://tazimi.dev',
  baseUrl: ci.GITHUB_ACTIONS ? '/awesome-notes/' : '/',
  onBrokenLinks: 'throw',
  favicon: 'img/logo.svg',
  organizationName: 'sabertazimi',
  projectName: 'awesome-notes',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'notes',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sabertazimi/awesome-notes/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsDir: 'notes',
        docsRouteBasePath: '/',
        language: ['en', 'zh'],
        hashed: true,
      },
    ],
  ],
  themeConfig: {
    respectPrefersColorScheme: true,
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark',
      },
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'Awesome Notes',
      logo: {
        alt: 'Awesome Notes',
        src: 'img/logo.svg',
      },
      hideOnScroll: true,
      items: [
        {
          to: 'intro',
          label: 'Notes',
          position: 'left',
          activeBasePath: 'intro',
        },
        {
          to: 'ComputerScience/Algorithms/AlgorithmsBasicNotes',
          label: 'Computer Science',
          position: 'left',
          activeBasePath: 'ComputerScience',
        },
        {
          to: 'Programming/DevOps/CleanCodeBasicNotes',
          label: 'Programming',
          position: 'left',
          activeBasePath: 'Programming',
        },
        {
          to: 'Language/Rust/RustBasicNotes',
          label: 'Language',
          position: 'left',
          activeBasePath: 'Language',
        },
        {
          to: 'Web/JavaScript/JavaScriptBasicNotes',
          label: 'Web',
          position: 'left',
          activeBasePath: 'Web',
        },
        {
          to: 'AI/Theory/AIBasicNotes',
          label: 'AI',
          position: 'left',
          activeBasePath: 'AI',
        },
        {
          to: 'Web/Frameworks/LibraryBasicNotes',
          label: 'Library Gallery',
          position: 'right',
          activeBasePath: 'Web/Frameworks/LibraryBasicNotes',
        },
        {
          type: 'dropdown',
          label: 'Links',
          position: 'right',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sabertazimi',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sabertazimi',
            },
            {
              label: 'Email',
              href: 'mailto:sabertazimi@gmail.com',
            },
          ],
        },
        {
          type: 'dropdown',
          label: 'Repos',
          position: 'right',
          items: [
            {
              label: 'Next.js Blog',
              href: 'https://github.com/sabertazimi/blog',
            },
            {
              label: 'Awesome Web',
              href: 'https://github.com/sabertazimi/awesome-web',
            },
            {
              label: 'Bod CLI',
              href: 'https://github.com/sabertazimi/bod',
            },
          ],
        },
        {
          href: 'https://github.com/sabertazimi/awesome-notes',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Notes',
          items: [
            {
              to: 'ComputerScience/Algorithms/AlgorithmsBasicNotes',
              label: 'Computer Science',
            },
            {
              to: 'Programming/DevOps/CleanCodeBasicNotes',
              label: 'Programming',
            },
            {
              to: 'Language/Rust/RustBasicNotes',
              label: 'Language',
            },
            {
              to: 'Web/JavaScript/JavaScriptBasicNotes',
              label: 'Web',
            },
            {
              to: 'AI/Theory/AIBasicNotes',
              label: 'AI',
            },
            {
              to: 'Web/Frameworks/LibraryBasicNotes',
              label: 'Library Gallery',
            },
          ],
        },
        {
          title: 'Social Media',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sabertazimi',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sabertazimi',
            },
            {
              label: 'Facebook',
              href: 'https://facebook.com/sabertazimi',
            },
            {
              label: 'Weibo',
              href: 'https://weibo.com/sabertazimi',
            },
            {
              label: 'Email',
              href: 'mailto:sabertazimi@gmail.com',
            },
          ],
        },
        {
          title: 'Find More',
          items: [
            {
              label: 'Next.js Blog',
              href: 'https://github.com/sabertazimi/blog',
            },
            {
              label: 'Awesome Web',
              href: 'https://github.com/sabertazimi/awesome-web',
            },
            {
              label: 'Bod CLI',
              href: 'https://github.com/sabertazimi/bod',
            },
            {
              label: 'Dragon ZSH Theme',
              href: 'https://github.com/sabertazimi/dragon-zsh-theme',
            },
            {
              label: 'LaTeX Snippets',
              href: 'https://github.com/sabertazimi/LaTeX-snippets',
            },
            {
              label: 'Lab Notes',
              href: 'https://github.com/sabertazimi/hust-lab',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sabertazimi.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      // https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/generate-prism-languages/index.ts#L9-L25
      additionalLanguages: [
        'bash',
        'cmake',
        'csharp',
        'csv',
        'docker',
        'haskell',
        'http',
        'java',
        'json',
        'latex',
        'lisp',
        'lua',
        'matlab',
        'perl',
        'php',
        'regex',
        'ruby',
        'scala',
        'scheme',
        'tcl',
        'verilog',
        'vhdl',
        'vim',
      ],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
