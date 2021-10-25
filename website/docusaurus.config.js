// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Geppetto",
  tagline: "WebGL Animation Studio",
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
        // blog: {
        //   showReadingTime: true,
        //   editUrl:
        //     "https://github.com/matthijsgroen/geppetto/edit/gh-pages/website/blog/",
        // },
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
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "features/features",
            position: "right",
            label: "Features",
          },
          {
            type: "doc",
            docId: "features/demo",
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
            docId: "creating-animation/studio",
            position: "right",
            label: "Creating an animation",
          },
          {
            type: "doc",
            docId: "using-player/player",
            position: "right",
            label: "Embedding an animation",
          },
          {
            type: "doc",
            docId: "using-player/api",
            position: "right",
            label: "API",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Contact and Source code",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/matthijsgroen",
              },
              {
                label: "Studio GitHub",
                href: "https://github.com/matthijsgroen/geppetto",
              },
              {
                label: "Player GitHub",
                href: "https://github.com/matthijsgroen/geppetto-player",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Matthijs Groen. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
