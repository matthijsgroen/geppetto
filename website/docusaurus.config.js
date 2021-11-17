// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Geppetto",
  tagline: "Bring your art to life",
  url: "https://geppetto.js.org",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "matthijsgroen",
  projectName: "geppetto",

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/matthijsgroen/geppetto/edit/gh-pages/website/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Geppetto",
        logo: {
          alt: "Geppetto logo",
          src: "/img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "demo",
            position: "right",
            label: "Demo",
          },
          {
            type: "doc",
            docId: "intro",
            position: "right",
            label: "Getting Started",
          },
          {
            type: "doc",
            docId: "creating-animation",
            position: "right",
            label: "Creating an animation",
          },
          {
            type: "doc",
            docId: "player",
            position: "right",
            label: "Embedding an animation",
          },
          {
            type: "docsVersion",
            label: "1.3",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Contact",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/matthijsgroen",
              },
              {
                label: "Keybase chat",
                href: "https://keybase.io/matthijsgroen/chat",
              },
              {
                label: "Issue tracker",
                href: "https://github.com/matthijsgroen/geppetto",
              },
            ],
          },
          {
            title: "Tech Docs",
            items: [
              {
                label: "API Reference",
                to: "/docs/api",
              },
              {
                label: "Changelog",
                href: "https://github.com/matthijsgroen/geppetto/blob/main/CHANGELOG.md",
              },
            ],
          },
          {
            title: "Source",
            items: [
              {
                label: "NPM Package",
                href: "https://www.npmjs.com/package/geppetto-player",
              },
              {
                label: "Studio sourcecode",
                href: "https://github.com/matthijsgroen/geppetto",
              },
              {
                label: "Player sourcecode",
                href: "https://github.com/matthijsgroen/geppetto-player",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Matthijs Groen.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
