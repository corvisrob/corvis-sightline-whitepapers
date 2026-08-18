import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Sightline',
  tagline: 'Architecture, risk and compliance in one connected model',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://docs.corvis.au',
  baseUrl: '/',

  // GitHub Pages deployment config, served via docs.corvis.au (see static/CNAME).
  organizationName: 'corvisrob',
  projectName: 'corvis-sightline-whitepapers',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Pinned explicitly rather than inherited. The inherited default decides which
  // of two failure modes a bad placeholder gets: under 'mdx' the build fails,
  // under 'detect' it builds and the placeholder is silently deleted from the
  // rendered text. A loud failure is the better backstop behind the publish
  // tool's lint, so this is 'mdx' and must stay 'mdx'.
  markdown: {
    format: 'mdx',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          // The plugin set none, so it inherited only the Docusaurus defaults and
          // any .md dropped under docs/ became a public page. The first four
          // entries ARE those defaults and must stay: '**/_*.{...}' is what keeps
          // an imported partial from also being routed as a page of its own.
          // The rest mirror the publish deny-list, so a directory that must never
          // reach the site is refused by the site as well as by the publish tool.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            '**/plans/**',
            '**/internal/**',
            '**/.claude/**',
            '**/demo/customer-walkthrough/**',
            '**/AGENTS.md',
            '**/CLAUDE.md',
            '**/PROJECT_STATUS.md',
            '**/PUBLISH.md',
          ],
          editUrl:
            'https://github.com/corvisrob/corvis-sightline-whitepapers/tree/main/',
        },
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          blogTitle: 'Sightline Whitepapers',
          blogDescription:
            'Long-form papers on how Sightline models architecture, risk and compliance.',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/corvisrob/corvis-sightline-whitepapers/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // TODO: add a proper 1200x630 social card image (img/social-card.png)
    // once brand assets exist; omitted for now rather than referencing a
    // file that doesn't exist yet.
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Sightline',
      logo: {
        alt: 'Sightline logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'kbSidebar',
          position: 'left',
          label: 'Knowledge Base',
        },
        {to: '/blog', label: 'Whitepapers', position: 'left'},
        {
          href: 'https://github.com/corvisrob/sightline-v2',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Knowledge Base',
          items: [
            {
              // No trailing slash: the site sets trailingSlash: false, so the
              // docs index is emitted as docs.html and served at /docs. A link
              // to /docs/ looks for docs/index.html and 404s in production,
              // which the build does not catch - onBrokenLinks validates the
              // route, not the emitted file path.
              label: 'Overview',
              to: '/docs',
            },
            {
              label: 'Standards & framework alignment',
              to: '/docs/standards-alignment',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Whitepapers',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/corvisrob/sightline-v2',
            },
          ],
        },
        {
          title: 'Corvis',
          items: [
            {
              label: 'Commercial licensing',
              href: 'mailto:rob@corvis.au',
            },
          ],
        },
      ],
      copyright: `Copyright (c) ${new Date().getFullYear()} Corvis Software Pty Ltd.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
