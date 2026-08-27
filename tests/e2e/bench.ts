import { readFile } from "node:fs/promises";
import { brotliCompressSync, gzipSync } from "node:zlib";

const rootUrl = new URL("../../", import.meta.url);
const remoteTimeoutMs = 5000;

type Target = {
  name: string;
  note: string;
  source: "local" | "remote";
  path?: string;
  url?: string;
};

type Result = {
  name: string;
  source: string;
  raw: string;
  gzip: string;
  brotli: string;
  note: string;
};

const targets: Target[] = [
  {
    name: "mini-cookies",
    note: "root browser bundle",
    source: "local",
    path: "dist/mini-cookies.umd.js",
  },
  {
    name: "mini-cookies/state",
    note: "opt-in state bundle",
    source: "local",
    path: "dist/state.umd.js",
  },
  {
    name: "js-cookie@3.0.8",
    note: "browser minified bundle",
    source: "remote",
    url: "https://cdn.jsdelivr.net/npm/js-cookie@3.0.8/dist/js.cookie.min.js",
  },
  {
    name: "tough-cookie@6.0.2",
    note: "Node-oriented ESM entry, not browser-equivalent",
    source: "remote",
    url: "https://cdn.jsdelivr.net/npm/tough-cookie@6.0.2/+esm",
  },
];

function formatBytes(size: number) {
  const sizeInKb = size / 1024;
  return `${sizeInKb.toFixed(2)} kB`;
}

function getErrorMessage(error: unknown) {
  const isError = error instanceof Error;
  if (isError) return error.message;
  return String(error);
}

function getMeasuredResult(target: Target, content: Uint8Array): Result {
  return {
    name: target.name,
    source: target.source,
    raw: formatBytes(content.byteLength),
    gzip: formatBytes(gzipSync(content).byteLength),
    brotli: formatBytes(brotliCompressSync(content).byteLength),
    note: target.note,
  };
}

function getSkippedResult(target: Target, error: unknown): Result {
  return {
    name: target.name,
    source: target.source,
    raw: "skipped",
    gzip: "skipped",
    brotli: "skipped",
    note: getErrorMessage(error),
  };
}

function readLocalTarget(target: Target) {
  const targetPath = target.path ?? "";
  const fileUrl = new URL(targetPath, rootUrl);
  return readFile(fileUrl);
}

async function readRemoteTarget(target: Target) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), remoteTimeoutMs);
  try {
    const response = await fetch(target.url ?? "", { signal: controller.signal });
    const responseFailed = !response.ok;
    if (responseFailed) throw new Error(`${response.status} ${response.statusText}`);
    return new Uint8Array(await response.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

function readTarget(target: Target) {
  const isLocalTarget = target.source === "local";
  if (isLocalTarget) return readLocalTarget(target);
  return readRemoteTarget(target);
}

async function measureTarget(target: Target) {
  try {
    const content = await readTarget(target);
    return getMeasuredResult(target, content);
  } catch (error) {
    return getSkippedResult(target, error);
  }
}

function getMarkdownRow(result: Result) {
  return `| ${result.name} | ${result.source} | ${result.raw} | ${result.gzip} | ${result.brotli} | ${result.note} |`;
}

function writeLine(line: string) {
  process.stdout.write(`${line}\n`);
}

const results = await Promise.all(targets.map(measureTarget));

writeLine("| target | source | raw | gzip | brotli | note |");
writeLine("| --- | --- | ---: | ---: | ---: | --- |");
results.map(getMarkdownRow).forEach(writeLine);
