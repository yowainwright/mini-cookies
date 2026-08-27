import type { CookieAttributes, CookieDictionary } from "./types.ts";

const secureAttributes = ["secure", "__Secure-", "samesite"];
const strictPathAttributes = ["path", "__Host-"];
const flagAttributes = ["secure", "__Secure-", "__Host-"];
const internalAttributes = ["isSecure", "isStrictSecure"];

function getCookieAttribute(
  attr: string,
  attrs: CookieAttributes,
  hasIsSecureAttr: boolean,
  hasIsStrict: boolean,
) {
  const isFlagAttr = flagAttributes.includes(attr);
  if (isFlagAttr) return `; ${attr}`;
  const isSecureSameSite = attr === "samesite" && hasIsSecureAttr;
  if (isSecureSameSite) return `; ${attr}=strict`;
  const isStrictPath = attr === "path" && hasIsStrict;
  if (isStrictPath) return `; ${attr}=/`;
  if (attr === "days") {
    const days = attrs.days ?? 0;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    return `; expires=${expires};`;
  }
  return `; ${attr}=${attrs[attr as keyof CookieAttributes]}`;
}

export function setCookieAttributes(attrs: CookieAttributes = {}): string {
  const items = Object.keys(attrs).filter((item) => !internalAttributes.includes(item));
  const isSecureProtocol = document.location.protocol === "https:";
  const hasIsSecureAttr = Boolean(attrs.isSecure) && isSecureProtocol;
  const hasIsStrict = Boolean(attrs.isStrictSecure) && isSecureProtocol;
  const hasCookieAttributes = items.length || hasIsSecureAttr || hasIsStrict;
  if (!hasCookieAttributes) return "";
  let updatedAttrs = items;
  if (hasIsStrict) {
    updatedAttrs = items
      .concat(secureAttributes, strictPathAttributes)
      .filter((item) => item !== "domain");
  } else if (hasIsSecureAttr) {
    updatedAttrs = items.concat(secureAttributes);
  }

  const filteredAttrs = updatedAttrs.every((attr) => ["days", "expires"].includes(attr))
    ? updatedAttrs.filter((attr) => attr !== "expires")
    : updatedAttrs;

  return filteredAttrs.reduce(
    (str, attr) => str + getCookieAttribute(attr, attrs, hasIsSecureAttr, hasIsStrict),
    "",
  );
}

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
