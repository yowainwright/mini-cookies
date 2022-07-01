import { setCookieAttributes } from "./utils";
import { CookieAttributes, CookieDictionary, Options } from "./types";

/**
 * Mini Cookies 🍪
 * @description Mini Cookies is a simple and minimalistic cookie management tool.
 */

/**
 * mini-cookies 🍪
 * @description a just a few lines of code cookie manager
 * @param {Options} options no options yet
 * @returns {MiniCookies} a cookie manager factory function
 */
export default function miniCookies({
  debug = false,
  hasState = false,
}: Options = {}) {
  const id = self.crypto.randomUUID();
  return {
    id,
    hasState,
    isDebugging: debug,
    isReview: debug && hasState,
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
      if (this.isDebugging)
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
      if (value && this.hasState) {
        const updatedState = {
          ...currentState,
          [name]: { value, attrs },
        };
        this.set(`mini-cookies-${this.id}`, JSON.stringify(updatedState));
      } else {
        const { [name]: deleted, ...updatedState } = currentState;
        this.set(`mini-cookies-${this.id}`, JSON.stringify(updatedState));
      }
      if (this.isReview) this.review();
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
      if (this.hasState) this.updateState(name, value, attrs);
      if (this.isReview) this.review();
      return this;
    },

    // removes a cookie by setting it's expires attribute to -1 and value to empty
    remove(name: string) {
      this.set(name, "", { days: -1 });
      this.updateState(name, "");
      if (this.isReview) this.review();
      return this;
    },
  };
}
