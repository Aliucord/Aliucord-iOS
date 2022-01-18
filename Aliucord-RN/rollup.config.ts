import { defineConfig, Plugin } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default defineConfig({
  input: "src/index.tsx",
  output: [
    { file: "dist/Aliucord.js", format: "cjs", strict: false },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild({ target: "es2015", minify: true, })
  ]
});