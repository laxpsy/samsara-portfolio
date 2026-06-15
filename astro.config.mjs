// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { remarkReadingTime } from "./src/remark-reading-time.mjs";
import remarkCallout from "@r4ai/remark-callout";
import remarkDirective from "remark-directive";
import { remarkDirectiveHandlers } from "./src/remark-directive.mjs";

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      remarkCallout,
      remarkDirective,
      remarkDirectiveHandlers,
    ],
    shikiConfig: {
      theme: "catppuccin-mocha",
    },
  },
});
