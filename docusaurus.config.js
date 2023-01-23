// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const rlc = require('remark-link-card');

// const math = require('remark-math');
// const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mebiusbox software',
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
    locales: ['ja'],
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // remarkPlugins: [math],
          // rehypePlugins: [[katex, {strict: false}]],
          remarkPlugins: [rlc],
        },
        blog: {
          showReadingTime: true,
          postsPerPage: 5,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [rlc],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        gtag: {
          trackingID: 'G-DXXWEQB56E',
          anonymizeIP: true,
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
                label: 'Twitter',
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
        // theme: lightCodeTheme,
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['powershell'],
      },
      zoom: {
        selector: '.markdown :not(em) > img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        config: {}
      }
    }),
};

module.exports = config;
