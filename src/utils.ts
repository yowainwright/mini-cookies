import { CookieAttributes, CookieDictionary } from "./types";

/**
 * generateRandomNumber
 * @description generates a random number with the length of the number provided
 * @param {number} number
 * @returns {string}
 */
export function generateRandomNumber(n: number): string {
  return Array.from({ length: n })
    .map((_) => (Math.random() * 10) | 0)
    .join("");
}

/**
 * setCookieAttributes
 * @description a cookie attribute manager
 * @param {object} attrs cookie attributes
 * @returns {string}
 */
export function setCookieAttributes(attrs: CookieAttributes = {}): string {
  const items = Object.keys(attrs);
  if (!items.length) return "";
  // prefer days over expires attribute
  const filteredAttrs = items.every((attr) =>
    ["days", "expires"].includes(attr)
  )
    ? items.filter((attr) => attr !== "expires")
    : items;
  // return attributes with booleans  and key value pairs
  return filteredAttrs.reduce((str, attr) => {
    const isTruthyAttr = ["secure", "httponly", "__Secure-"].includes(attr);
    // return truthy attributes w/o values
    if (isTruthyAttr) str += `; ${attr}`;
    // return days helper as expires
    else if (attr === "days")
      str += `; expires=${new Date(
        Date.now() + (attrs[attr] as number) || 0 * 864e5
      ).toUTCString()};`;
    // return all other key value string pairs
    else str += `; ${attr}=${attrs[attr as keyof CookieAttributes]}`;
    return str;
  }, "");
}

/**
 * setCookieList
 * @description returns a cookie dictionary
 * @returns {object}
 */
export function setCookieList(): CookieDictionary {
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
}
