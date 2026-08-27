import { defineConfig, type RolldownOptions } from "rolldown";

const defaultOutput = {
  minify: true,
  sourcemap: true,
};

const defaultOptions = {
  platform: "browser",
  treeshake: true,
};

const cjsOutput = {
  ...defaultOutput,
  exports: "named",
  format: "cjs",
};

const iifeFooterByName = {
  miniCookies:
    'if (typeof miniCookies !== "undefined" && miniCookies.default) { miniCookies = miniCookies.default; }',
  miniCookiesState:
    'if (typeof miniCookiesState !== "undefined" && miniCookiesState.default) { miniCookiesState = miniCookiesState.default; }',
};

type BuildOptions = {
  input: string;
  file: string;
  format: "cjs" | "esm" | "iife";
  name?: keyof typeof iifeFooterByName;
};

function createBuild({ input, file, format, name }: BuildOptions): RolldownOptions {
  const output = {
    ...defaultOutput,
    file,
    format,
  };

  if (format === "cjs") {
    Object.assign(output, cjsOutput);
  }

  if (format === "iife") {
    Object.assign(output, {
      exports: "named",
      footer: iifeFooterByName[name],
      name,
    });
  }

  return {
    ...defaultOptions,
    input,
    output,
  };
}

const rootInput = "src/index.ts";
const stateInput = "src/state.ts";

export default defineConfig([
  createBuild({
    input: rootInput,
    file: "dist/mini-cookies.js",
    format: "esm",
  }),
  createBuild({
    input: stateInput,
    file: "dist/state.js",
    format: "esm",
  }),
  createBuild({
    input: rootInput,
    file: "dist/mini-cookies.cjs",
    format: "cjs",
  }),
  createBuild({
    input: stateInput,
    file: "dist/state.cjs",
    format: "cjs",
  }),
  createBuild({
    input: rootInput,
    file: "dist/mini-cookies.umd.js",
    format: "iife",
    name: "miniCookies",
  }),
  createBuild({
    input: stateInput,
    file: "dist/state.umd.js",
    format: "iife",
    name: "miniCookiesState",
  }),
  createBuild({
    input: rootInput,
    file: "dist/mini-cookies.bundle.js",
    format: "iife",
    name: "miniCookies",
  }),
  createBuild({
    input: stateInput,
    file: "dist/state.bundle.js",
    format: "iife",
    name: "miniCookiesState",
  }),
]);
