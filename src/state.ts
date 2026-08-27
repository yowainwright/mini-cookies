import miniCookies from "./index.ts";
import type { CookieFactory, Options } from "./types.ts";

export default function miniCookiesWithState(options: Options = {}): CookieFactory {
  return miniCookies({ ...options, hasState: true });
}
