import { CookieAttributes, CookieDictionary, Options } from "./types";

/**
 * Mini Cookies 🍪
 * @description Mini Cookies is a simple and minimalistic cookie management tool.
 */

/**
 * setCookieAttributes
 * @description a cookie attribute manager
 * @param {CookieAttributes} attrs cookie attributes
 * @returns {string}
 */
export function setCookieAttributes(attrs: CookieAttributes): string {
  const items = Object.keys(attrs);
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
 * mini-cookies 🍪
 * @description a just a few lines of code cookie manager
 * @param {Options} options no options yet
 * @returns {MiniCookies} a cookie manager factory function
 */
export default function miniCookies({ debug = false }: Options = {}) {
  const id = self.crypto.randomUUID();
  return {
    id,
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

    // returns a cookie value if available
    get(name: string) {
      const cookies = this.setCookieList();
      if (debug)
        console.debug({
          [`mini-cookies-🍪!`]: { name, value: cookies[name] },
        });
      if (cookies[name]) {
        return cookies[name];
      }
    },

    // updates mini-cookie state
    updateState(name: string, value: string, attrs: CookieAttributes = {}) {
      const current = this.get(`mini-cookies-${this.id}`) || "";
      const currentState = current.length ? JSON.parse(current) : {};
      if (value) {
        const updatedState = {
          ...currentState,
          [name]: { value, attrs },
        };
        this.set(`mini-cookies-${this.id}`, JSON.stringify(updatedState));
      } else {
        const { [name]: deleted, ...updatedState } = currentState;
        this.set(`mini-cookies-${this.id}`, JSON.stringify(updatedState));
      }
      if (debug) this.review();
      return this;
    },

    review() {
      const current = this.get(`mini-cookies-${this.id}`) || "";
      const currentState = current.length ? JSON.parse(current) : {};
      console.info({
        [`mini-cookies-🍪!`]: { id: this.id, cookies: currentState },
      });
    },

    // sets a cookie with attributes
    set(name: string, value: string, attrs: CookieAttributes = {}) {
      const cookieValue = encodeURIComponent(value);
      const cookieAttributes = setCookieAttributes(attrs);
      document.cookie = `${name}=${cookieValue};${cookieAttributes}`;
      this.updateState(name, value, attrs);
      if (debug) this.review();
      return this;
    },

    // removes a cookie by setting it's expires attribute to -1 and value to empty
    remove(name: string) {
      this.set(name, "", { days: -1 });
      this.updateState(name, "");
      if (debug) this.review();
      return this;
    },
  };
}
