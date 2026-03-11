import { defineConfig } from "@solidjs/start/config";
import pkg from "@vinxi/plugin-mdx";
import rehypeShiki from "@shikijs/rehype";

import { transformerNotationDiff } from "@shikijs/transformers";

const { default: mdx } = pkg;

export default defineConfig({
  extensions: ["mdx", "md"],
  server: {
    preset: "cloudflare-pages",
  },
  vite: {
    plugins: [
      mdx.withImports({})({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        rehypePlugins: [
          [
            rehypeShiki,
            {
              theme: "nord",
              transformers: [transformerNotationDiff()],
            },
          ],
        ],
      }),
    ],
  },
});
