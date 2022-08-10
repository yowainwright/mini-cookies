import { CookieAttributes, CookieDictionary } from "./types";

/**
 * @todo isStrictPath
 * - unassign domain
 * - set path to "/"
 * - set "__Host-"
 */

// let domain be assigned by browser unless specified
const secureAttributes = ["secure", "httponly", "__Secure-", "samesite"];

/**
 * setCookieAttributes
 * @description a cookie attribute manager
 * @param {object} attrs cookie attributes
 * @returns {string}
 */
export function setCookieAttributes(attrs: CookieAttributes = {}): string {
  const items = Object.keys(attrs);
  if (!items.length) return "";
  // set secure attributes
  const isSecureProtocol = document.location.protocol === "https:";
  const hasIsSecureAttr = items.find(item => item === "isSecure") && isSecureProtocol;
  const updatedAttrs = hasIsSecureAttr ? items.concat(secureAttributes) : items;

  // prefer days over expires attribute
  const filteredAttrs = updatedAttrs.every((attr) =>
    ["days", "expires"].includes(attr)
  )
    ? updatedAttrs.filter((attr) => attr !== "expires")
    : updatedAttrs;

  // return attributes with booleans  and key value pairs
  return filteredAttrs.reduce((str, attr) => {
    const isTruthyAttr = secureAttributes.includes(attr);
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
