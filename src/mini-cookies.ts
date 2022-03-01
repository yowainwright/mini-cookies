import { CookieAttributes, CookieDictionary, CookiesOptions } from "./types";

export default function miniCookies(options: CookiesOptions = {}) {
  return {
    setCookieList(): CookieDictionary {
      return document.cookie
        .split(";")
        .map((cookie: string) => cookie.split("="))
        .reduce(
          (list, [key, value]) => ({
            ...list,
            [key.trim()]: decodeURIComponent(value),
          }),
          {}
        );
    },
    get(name: string) {
      const cookies = this.setCookieList();
      if (cookies[name]) {
        return cookies[name];
      } else if (options.isDebugging) {
        return console.warn(`Cookie "${name}" not found.`);
      }
    },
    set(name: string, value: string, { days }: CookieAttributes = {}) {
      const expires: string = days
        ? ` expires=${new Date(Date.now() + days * 864e5).toUTCString()};`
        : "";
      document.cookie = `${name}=${encodeURIComponent(value)};${expires}`;
      return this;
    },
    remove(name: string) {
      this.set(name, "", { days: -1 });
      return this;
    },
  };
}
