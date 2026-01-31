import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import ci from 'ci-info'
import { themes } from 'prism-react-renderer'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import tailwind from './src/plugins/tailwind'

const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula

const config: Config = {
  title: 'Personal Notes',
  tagline: 'Today I Learned',
  url: 'https://tazimi.dev',
  baseUrl: ci.GITHUB_ACTIONS ? '/notes/' : '/',
  onBrokenLinks: 'throw',
  favicon: 'img/logo.svg',
  organizationName: 'sabertazimi',
  projectName: 'notes',
  future: {
    v4: true,
    experimental_faster: true,
  },
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
          path: 'content',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sabertazimi/notes/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsDir: 'content',
        docsRouteBasePath: '/',
        language: ['en', 'zh'],
        hashed: true,
      },
    ],
    tailwind,
  ],
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
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
      title: 'TIL',
      logo: {
        alt: 'Today I Learned',
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
          to: 'ai',
          label: 'AI',
          position: 'left',
          activeBasePath: 'ai',
        },
        {
          to: 'cs',
          label: 'CS',
          position: 'left',
          activeBasePath: 'cs',
        },
        {
          to: 'web',
          label: 'Web',
          position: 'left',
          activeBasePath: 'web',
        },
        {
          to: 'language',
          label: 'Language',
          position: 'left',
          activeBasePath: 'language',
        },
        {
          to: 'programming',
          label: 'Programming',
          position: 'left',
          activeBasePath: 'programming',
        },
        {
          to: 'web/library',
          label: 'Library Gallery',
          position: 'right',
          activeBasePath: 'web/library',
        },
        {
          href: 'https://github.com/sabertazimi/notes',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Notes',
          items: [
            {
              to: 'ai',
              label: 'AI',
            },
            {
              to: 'cs',
              label: 'CS',
            },
            {
              to: 'web',
              label: 'Web',
            },
            {
              to: 'language',
              label: 'Language',
            },
            {
              to: 'programming',
              label: 'Programming',
            },
            {
              to: 'web/library',
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
              label: 'X',
              href: 'https://x.com/sabertazimi',
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
              label: 'Lab',
              href: 'https://github.com/sabertazimi/lab',
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
              label: 'HUST Lab',
              href: 'https://github.com/sabertazimi/hust-lab',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sabertaz`,
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
