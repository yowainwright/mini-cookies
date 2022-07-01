import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

import {
  author,
  description,
  homepage,
  license,
  name,
  version,
} from "./package.json";

const banner = `/**
  @preserve ${name} - ${description}
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
  uglify({
    output: {
      comments: (_, { type, value }) =>
        type === "comment2" ? /@preserve/i.test(value) : false,
    },
  }),
];

export default {
  input: "src/mini-cookies.ts",
  output: {
    banner,
    file: "dist/mini-cookies.umd.js",
    format: "umd",
    name: "miniCookies",
    exports: "named",
  },
  plugins,
};
