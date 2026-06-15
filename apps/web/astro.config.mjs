import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://beabuddhist.vercel.app",
  integrations: [sitemap()],
});
