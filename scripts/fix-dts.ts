import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const distUrl = new URL("../dist/", import.meta.url);
const declarationFiles = readdirSync(distUrl).filter((file) => file.endsWith(".d.ts"));

function rewriteTypeScriptExtensions(source: string) {
  return source.replaceAll(/from "(\.\/[^"]+)\.ts";/g, 'from "$1";');
}

declarationFiles.forEach((file) => {
  const fileUrl = new URL(file, distUrl);
  const source = readFileSync(fileUrl, "utf8");
  const updatedSource = rewriteTypeScriptExtensions(source);
  if (source === updatedSource) return;
  writeFileSync(fileUrl, updatedSource);
});
