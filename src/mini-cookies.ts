import { CookieAttributes, CookieDictionary } from "./types";

export function setCookieAttributes(attrs: CookieAttributes): string {
  const items = Object.keys(attrs);
  // prefer days over expires attribute
  const filteredAttrs = items.every((attr) =>
    ["days", "expires"].includes(attr)
  )
    ? items.filter((attr) => attr === "expires")
    : items;
  // return attributes with booleans  and key value pairs
  return filteredAttrs.reduce((str, attr) => {
    const isTruthyAttr = ["secure", "httponly", "__Secure-"].includes(attr);
    if (isTruthyAttr) str += `; ${attr}`;
    else str += `; ${attr}=${attrs[attr as keyof CookieAttributes]}`;
    return str;
  }, "");
}

export default function miniCookies() {
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
      }
    },
    set(name: string, value: string, attrs: CookieAttributes = {}) {
      document.cookie = `${name}=${encodeURIComponent(
        value
      )};${setCookieAttributes(attrs)}`;
      return this;
    },
    remove(name: string) {
      this.set(name, "", { days: -1 });
      return this;
    },
  };
}
