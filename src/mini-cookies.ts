import {
  setCookieAttributes,
  setCookieList,
} from "./utils";
import { CookieAttributes, CookieFactory, Options, State } from "./types";

const hasStateOption = () => ({
            ['mini-cookies']: {
              note: 'If trying to use mini-cookie state, the hasState option must be set to true 👌',
              docs: 'https://github.com/yowainwright/mini-cookies#minicookiesoptions',
            },
          });

/**
 * Mini Cookies 🍪
 * @description a just-a-few-lines-of-code cookie manager
 * @param {object} options no options yet
 * @returns {object} a cookie manager factory function
 */
export default function miniCookies({
  debug = false,
  hasState = false,
  id = 'mini-cookies-key',
}: Options = {}): CookieFactory {
  return {
    hasState,
    isDebugging: debug,
    id,
    setCookieList,

    // returns a cookie value if available
    get(name: string): string | void {
      const cookies = this.setCookieList();
      if (this.isDebugging)
        console.debug({
          [`mini-cookies`]: { name, value: cookies[name] },
        });
      if (cookies[name]) {
        return cookies[name];
      }
    },

    key() {
      if (!this.get(this.id)) this.set(this.id, 'true');
      return this.get(this.id) as string;
    },

    // updates mini-cookie temp state
    updateState(name: string, value: string, attrs: CookieAttributes = {}) {
      if (!this.hasState) {
        if (this.isDebugging) console.info(hasStateOption());
        return this;
      }

      const currentStorage = localStorage.getItem(this.key());
      const currentState = (
        currentStorage ? JSON.parse(currentStorage) : {}
      ) as State;
      if (value) {
        const updatedState = {
          ...currentState,
          [name]: {
            name,
            value,
            ...(Object.keys(attrs).length ? { attrs } : {}),
          },
        };
        localStorage.setItem(this.id, JSON.stringify(updatedState));
      } else if (Object.keys(currentState).length) {
        const { [name]: deleted, ...updatedState } = currentState;
        localStorage.setItem(this.id, JSON.stringify(updatedState));
      }
      return this;
    },

    clearState() {
      if (!this.hasState) return this;
      localStorage.removeItem(this.key());
      this.remove('mini-cookies-key');
      return this;
    },

    // returns log of state
    review() {
      if (this.hasState) {
        const currentStorage = localStorage.getItem(this.key());
        const currentState = currentStorage ? JSON.parse(currentStorage) : {};
        if (this.isDebugging)
          console.info({
            ['mini-cookies']: currentState,
          });
        return currentState;
      } else if (this.isDebugging) console.info(hasStateOption());
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
