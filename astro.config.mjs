import starlight from "@astrojs/starlight";
import d2 from "astro-d2";
import { defineConfig } from "astro/config";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import starlightLinksValidator from "starlight-links-validator";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/cross-cats/": "/intent/intent/",
    "/cross-cats/solver/": "/intent/becoming-a-solver/introduction/",
  },
  site: `${process.env["CF_PAGES_URL"] ?? "https://docs.catalyst.exchange"}`,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  },
  integrations: [
    starlight({
      plugins: [starlightLinksValidator()],
      title: "Catalyst Documentation",
      editLink: {
        baseUrl: `https://github.com/catalystdao/catalyst-documentation/edit/${process.env["CF_PAGES_BRANCH"]}`,
      },
      logo: {
        light: "/src/assets/logo_dark.svg",
        dark: "/src/assets/logo_light.svg",
        replacesTitle: true,
      },
      social: {
        github: "https://github.com/catalystdao",
      },
      customCss: ["./src/assets/landing.css", "./src/assets/math-fix.css"],
      favicon: "/favicon.ico",
      sidebar: [
        {
          label: "Catalyst Intent System",
          link: "/",
        },
        {
          label: "Implementations",
          autogenerate: {
            directory: "implementation",
          },
        },
        {
          label: "Solvers",
          badge: "Outdated",
          autogenerate: {
            directory: "solver",
          },
        },
        {
          label: "Knowledge Database",
          collapsed: true,
          autogenerate: {
            directory: "knowledge",
          },
        },
        {
          label: "CatalystAMM",
          collapsed: true,
          badge: "Legacy",
          autogenerate: {
            directory: "protocol",
          },
        },
      ],
    }),
    d2({
      skipGeneration: !!process.env["CF_PAGES"] || !process.env["D2"],
      layout: "elk",
    }),
    svelte(),
  ],
});
