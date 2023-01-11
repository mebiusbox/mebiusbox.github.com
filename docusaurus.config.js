// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');

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
          remarkPlugins: [math],
          rehypePlugins: [katex, {strict: false}],
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
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
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
