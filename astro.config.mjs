import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Catalyst Documentation",
      logo: {
        light: "/src/assets/logo_dark.svg",
        dark: "/src/assets/logo_light.svg",
        replacesTitle: true,
      },
      social: {
        github: "https://github.com/catalystdao",
      },
      customCss: ["./src/assets/landing.css"],
      favicon: "/public/favicon.ico",
      sidebar: [
        {
          label: "Introduction",
          autogenerate: { directory: "introduction" },
        },
        {
          label: "Protocol",
          autogenerate: { directory: "protocol" },
        },
        {
          label: "Generalised Incentives",
          autogenerate: { directory: "generalised-incentives" },
        },
        {
          label: "Relayer",
          autogenerate: { directory: "relayer" },
        },
        {
          label: "Resources",
          autogenerate: { directory: "resources" },
        },
      ],
    }),
  ],
});
