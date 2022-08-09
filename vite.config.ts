import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import gfm from 'remark-gfm';

export default defineConfig(async () => {
const mdx = await import('@mdx-js/rollup');
return {
    base: "/mini-cookies/",
    root: ".",
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
      mdx.default({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [gfm],
      })
  ],
    define: {
      "process.env": {},
    },
    build: {
      outDir: "./docs",
    }
  }
});
