// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';

// const math = require('remark-math');
// const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mebiusbox software',
  tagline: "mebiusbox's software, blogs and articles",
  url: 'https://mebiusbox.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Mebiusbox', // Usually your GitHub org/user name.
  projectName: 'mebiusbox.github.com', // Usually your repo name.
  trailingSlash: false,

  plugins: [
    'docusaurus-plugin-sass',
    './plugins/docusaurus-plugin-yml',
    './plugins/docusaurus-plugin-katex-client',
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'ideal-image',
      /** @type {import('@docusaurus/plugin-ideal-image').PluginOptions} */
      ({
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
      }),
    ],
  ],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: false,
          sidebarCollapsed: false,
          // remarkPlugins: [math],
          // rehypePlugins: [[katex, {strict: false}]],
        },
        blog: {
          showReadingTime: true,
          postsPerPage: 5,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        googleTagManager: {
          containerId: 'GTM-5WZWRT7N',
        },
      }),
    ],
  ],
  scripts: [
    {
      src: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js",
      integrity: "sha384-PwRUT/YqbnEjkZO0zZxNqcxACrXe+j766U2amXcgMg5457rve2Y7I6ZJSm2A0mS4",
      crossorigin: "anonymous",
      defer: true,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js",
      integrity: "sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05",
      crossorigin: "anonymous",
      defer: true,
    }
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Mebiusbox software',
        // logo: {
        //   alt: 'Mebiusbox Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {to: '/docs/category/lab', label: 'Lab', position: 'left'},
          {to: '/docs/category/note', label: 'Note', position: 'left'},
          {to: '/docs/category/software', label: 'Software', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {href: 'https://mebiusbox.github.io/contents/EffectTextureMaker', label: 'EffectTextureMaker', position: 'left'},
          {type: 'localeDropdown', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Contents',
            items: [
              {
                label: 'Lab',
                to: '/docs/category/lab',
              },
              {
                label: 'Note',
                to: '/docs/category/note',
              },
              {
                label: 'Software',
                to: '/docs/category/software',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'BOOTH',
                href: 'https://mebiusbox.booth.pm/',
              },
              {
                label: 'X (Twitter)',
                href: 'https://twitter.com/mebiusbox2',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/mebiusbox',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Privacy Policy',
                to: '/privacy',
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} mebiusbox software.`,
      },
      prism: {
        // theme: prismThemes.github,
        theme: prismThemes.okaidia,
        darkTheme: prismThemes.okaidia,
        additionalLanguages: ['powershell', 'lua', "json"],
      },
      zoom: {
        selector: '.markdown :not(em) > img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        config: {}
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'T4PENXHNV7',
  
        // Public API key: it is safe to commit it
        apiKey: '4819b5c79b5eb22938689e64036be53b',
  
        indexName: 'mebiusbox',
  
        // Optional: see doc section below
        contextualSearch: true,
  
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'external\\.com|domain\\.com',
  
        // Optional: Algolia search parameters
        searchParameters: {},
  
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
  
        //... other Algolia params
        // container: '',
        debug: false // Set debug to true if you want to inspect the modal
      },
    }),
};

export default config;
