import { defineConfig } from "vite";
import { resolve } from "path";
import pkg from "./package.json";
import { SignPlugin } from "./src/lib/sign";

export default defineConfig({
  build: {
    outDir: "bin",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["cjs"],
      fileName: () => "ne-test",
    },
    minify: false,
    rollupOptions: {
      external: [
        "commander",
        "fs",
        "child_process",
        "nearley",
        "path",
        "perf_hooks",
      ],
    },
  },
  define: {
    VERSION: JSON.stringify(pkg.version),
  },
  plugins: [
    SignPlugin({
      content: [
        "#!/usr/bin/env node",
        "/*",
        `Name   : ${pkg.name}`,
        `Version: ${pkg.version}`,
        `Author : ${pkg.author.name} <${pkg.author.email}>`,
        //`Description: ${pkg.description}`,
        "*/",
      ].join("\n"),
    }),
  ],
});
