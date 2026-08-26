import type { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { createServer, type ServerResponse } from "node:http";
import { extname, isAbsolute, join, relative } from "node:path";

const publicRoot = new URL("../../public/", import.meta.url);
const host = "127.0.0.1";
const port = Number(process.env.MINI_COOKIES_E2E_PORT ?? 4173);
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
]);

function getRequestPath(requestUrl = "/") {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  if (url.pathname === "/") return "/test-bundled.html";
  if (url.pathname === "/test-bundled") return "/test-bundled.html";
  return decodeURIComponent(url.pathname);
}

function getFilePath(requestUrl?: string) {
  const requestPath = getRequestPath(requestUrl);
  const relativePath = requestPath.replace(/^\/+/, "");
  const filePath = join(publicRoot.pathname, relativePath);
  const publicRelativePath = relative(publicRoot.pathname, filePath);
  const isOutsidePublic = publicRelativePath.startsWith("..") || isAbsolute(publicRelativePath);
  if (isOutsidePublic) throw new Error("Forbidden");
  return filePath;
}

function getContentType(filePath: string) {
  return contentTypes.get(extname(filePath)) ?? "application/octet-stream";
}

function sendResponse(
  response: ServerResponse,
  status: number,
  content: string | Buffer,
  contentType = "text/plain; charset=utf-8",
) {
  response.writeHead(status, { "content-type": contentType });
  response.end(content);
}

function sendError(response: ServerResponse, error: unknown) {
  const isForbidden = error instanceof Error && error.message === "Forbidden";
  if (isForbidden) return sendResponse(response, 403, "Forbidden");
  return sendResponse(response, 404, "Not found");
}

function handleRequest(requestUrl: string | undefined, response: ServerResponse) {
  try {
    const filePath = getFilePath(requestUrl);
    const content = readFileSync(filePath);
    sendResponse(response, 200, content, getContentType(filePath));
  } catch (error) {
    sendError(response, error);
  }
}

const server = createServer((request, response) => {
  handleRequest(request.url, response);
});

server.listen(port, host, () => {
  process.stdout.write(`mini-cookies e2e server: http://${host}:${port}\n`);
});
