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
    "/resources/whitepaper": "/resources/audit-whitepaper#Papers",
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
        discord: "https://discord.gg/nvvN3XbaYG",
      },
      customCss: ["./src/assets/landing.css", "./src/assets/math-fix.css"],
      favicon: "/favicon.ico",
      sidebar: [
        {
          label: "Overview",
          link: "/",
        },
        {
          label: "Introduction",
          autogenerate: {
            directory: "introduction",
          },
        },
        {
          label: "Protocol",
          autogenerate: {
            directory: "protocol",
          },
        },
        {
          label: "Generalised Incentives",
          autogenerate: {
            directory: "generalised-incentives",
          },
        },
        {
          label: "Relayer",
          autogenerate: {
            directory: "relayer",
          },
        },
        {
          label: "Underwriter",
          badge: "Open Beta!",
          autogenerate: {
            directory: "underwriter",
          },
        },
        {
          label: "Resources",
          autogenerate: {
            directory: "resources",
          },
        },
      ],
    }),
    d2({
      skipGeneration: !!process.env["CF_PAGES"] || !process.env["D2"],
      layout: "tala",
    }),
    svelte(),
  ],
});
