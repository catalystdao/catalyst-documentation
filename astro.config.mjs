import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import d2 from "astro-d2";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.catalyst.exchange",
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax]
  },
  integrations: [starlight({
    title: "Catalyst Documentation",
    editLink: {
      baseUrl: "https://github.com/catalystdao/catalyst-documentation/edit/main"
    },
    logo: {
      light: "/src/assets/logo_dark.svg",
      dark: "/src/assets/logo_light.svg",
      replacesTitle: true
    },
    social: {
      github: "https://github.com/catalystdao",
      discord: "https://discord.gg/GQmgzVxgmN"
    },
    customCss: ["./src/assets/landing.css", "./src/assets/math-fix.css"],
    favicon: "/favicon.ico",
    sidebar: [{
      label: "Introduction",
      autogenerate: {
        directory: "introduction"
      }
    }, {
      label: "Protocol",
      autogenerate: {
        directory: "protocol"
      }
    }, {
      label: "Generalised Incentives",
      autogenerate: {
        directory: "generalised-incentives"
      }
    }, {
      label: "Relayer",
      autogenerate: {
        directory: "relayer"
      }
    }, {
      label: "Resources",
      autogenerate: {
        directory: "resources"
      }
    }]
  }), d2({
    skipGeneration: !!process.env["CF_PAGES"] || !process.env["D2"]
  }), svelte()]
});