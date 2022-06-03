import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import {
  author,
  description,
  homepage,
  license,
  name,
  version,
} from "./package.json";

const banner = `/**
  ${name} - ${description}
  @version v${version}
  @link ${homepage}
  @author ${author}
  @license ${license}
**/`;

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: false,
    lib: ["esnext", "dom"],
    target: "esnext",
    moduleResolution: "node",
    resolveJsonModule: true,
  }),
];

export default {
  input: "src/mini-cookies.ts",
  output: {
    file: "dist/mini-cookies.umd.js",
    format: "umd",
    name: "miniCookies",
  },
  plugins,
};
