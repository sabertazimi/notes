const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Awesome Notes',
  tagline: 'Today I Learned',
  url: 'https://sabertazimi.github.io',
  baseUrl: '/awesome-notes/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'sabertazimi',
  projectName: 'awesome-notes',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'notes',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.config.js'),
          editUrl: 'https://github.com/sabertazimi/awesome-notes/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
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
    hideableSidebar: true,
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
          to: 'computerScience/algorithms/algorithmsBasicNotes',
          label: 'Computer Science',
          position: 'left',
          activeBasePath: 'computerScience',
        },
        {
          to: 'programming/android/androidBasicNotes',
          label: 'Programming',
          position: 'left',
          activeBasePath: 'programming',
        },
        {
          to: 'language/assembly/assemblyBasicNotes',
          label: 'Language',
          position: 'left',
          activeBasePath: 'language',
        },
        {
          to: 'web/angular/angularBasicNotes',
          label: 'Web',
          position: 'left',
          activeBasePath: 'web',
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
              label: 'Awesome Web',
              href: 'https://github.com/sabertazimi/awesome-web',
            },
            {
              label: 'Bod CLI',
              href: 'https://github.com/sabertazimi/bod',
            },
            {
              label: 'Gatsby Blog',
              href: 'https://github.com/sabertazimi/blog',
            },
          ],
        },
        {
          href: 'https://notes.tazimi.dev',
          label: 'GitBook',
          position: 'right',
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
              to: '/intro',
              label: 'Getting Started',
            },
            {
              to: 'computerScience/algorithms/algorithmsBasicNotes',
              label: 'Computer Science',
            },
            {
              to: 'programming/android/androidBasicNotes',
              label: 'Programming',
            },
            {
              to: 'language/assembly/assemblyBasicNotes',
              label: 'Language',
            },
            {
              to: 'web/angular/angularBasicNotes',
              label: 'Web',
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
              label: 'Gatsby Blog',
              href: 'https://github.com/sabertazimi/blog',
            },
            {
              label: 'Minimal Boilerplate',
              href: 'https://github.com/sabertazimi/boilerplate',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sabertazimi.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: [
        'cmake',
        'csharp',
        'csv',
        'docker',
        'haskell',
        'http',
        'java',
        'kotlin',
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
        'swift',
        'tcl',
        'verilog',
        'vhdl',
        'vim',
      ],
    },
  },
};
