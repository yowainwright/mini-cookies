import { CookieAttributes, CookieDictionary } from "./types";

// let domain be assigned by browser unless specified
const secureAttributes = ["secure", "__Secure-", "samesite"];
const strictPathAttributes = ["path", "__Host-"];

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
  const hasIsSecureAttr =
    items.find((item) => item === "isSecure") && isSecureProtocol;
  const hasIsStrict =
    items.find((item) => item === "isStrictSecure") && isSecureProtocol;
  let updatedAttrs = items;
  if (hasIsStrict) {
    // merge secure attributes
    // remove domain if added
    updatedAttrs = items
      .concat(secureAttributes, strictPathAttributes)
      .filter((item) => item !== "domain");
  } else if (hasIsSecureAttr) {
    updatedAttrs = items.concat(secureAttributes);
  }

  // prefer days over expires attribute
  const filteredAttrs = updatedAttrs.every((attr) =>
    ["days", "expires"].includes(attr),
  )
    ? updatedAttrs.filter((attr) => attr !== "expires")
    : updatedAttrs;

  // return attributes with booleans  and key value pairs
  return filteredAttrs.reduce((str, attr) => {
    const isTruthyAttr = secureAttributes.concat(["__Host-"]).includes(attr);
    // return truthy attributes w/o values
    if (isTruthyAttr) str += `; ${attr}`;
    // secure specific values
    if (attr === "sameSite" && hasIsSecureAttr) str += `; ${attr}=strict`;
    if (attr === "path" && hasIsStrict) str += `; ${attr}=/`;
    // return days helper as expires
    else if (attr === "days")
      str += `; expires=${new Date(
        Date.now() + ((attrs[attr] as number) || 0) * 864e5,
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
      {},
    );
}
