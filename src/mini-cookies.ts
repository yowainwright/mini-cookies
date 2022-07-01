import { setCookieAttributes } from "./utils";
import {
  CookieAttributes,
  CookieDictionary,
  Options,
  TempState,
} from "./types";

/**
 * Mini Cookies 🍪
 * @description a just-a-few-lines-of-code cookie manager
 * @param {Options} options no options yet
 * @returns {MiniCookies} a cookie manager factory function
 */
export default function miniCookies({
  debug = false,
  hasState = false,
}: Options = {}) {
  return {
    hasState,
    isDebugging: debug,
    tempState: {} as TempState,
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

    // updates mini-cookie temp state
    updateState(name: string, value: string, attrs: CookieAttributes = {}) {
      if (!this.hasState) return;
      if (value) {
        const updatedState = {
          ...this.tempState,
          [name]: { value, ...(Object.keys(attrs).length ? { attrs } : {}) },
        };
        this.tempState = updatedState;
      } else if (Object.keys(this.tempState).length) {
        const { [name]: deleted, ...updatedState } = this.tempState;
        this.tempState = updatedState;
      }
      return this;
    },

    review() {
      console.info({
        [`mini-cookies-🍪!`]: this.tempState,
      });
    },

    // sets a cookie with attributes
    set(name: string, value: string, attrs: CookieAttributes = {}) {
      const cookieValue = encodeURIComponent(value);
      const cookieAttributes = setCookieAttributes(attrs);
      document.cookie = `${name}=${cookieValue};${cookieAttributes}`;
      this.updateState(name, value, attrs);
      return this;
    },

    // removes a cookie by setting it's expires attribute to -1 and value to empty
    remove(name: string) {
      this.set(name, "", { days: -1 });
      this.updateState(name, "");
      return this;
    },
  };
}
