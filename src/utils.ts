import { CookieAttributes } from "./types";

/**
 * setCookieAttributes
 * @description a cookie attribute manager
 * @param {CookieAttributes} attrs cookie attributes
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
