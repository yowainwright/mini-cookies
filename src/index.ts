import { setCookieAttributes, setCookieList } from "./utils.ts";
import type { CookieAttributes, CookieFactory, Options } from "./types.ts";

const hasStateOption = {
  ["mini-cookies"]: {
    note: "Use the mini-cookies/state entrypoint to enable state.",
    docs: "https://github.com/yowainwright/mini-cookies#minicookiesoptions",
  },
};

function showStateOption(isDebugging: boolean) {
  if (isDebugging) console.info(hasStateOption);
}

function getCookie(this: CookieFactory, name: string): string | void {
  const cookies = this.setCookieList();
  const value = cookies[name] ? decodeURIComponent(cookies[name]) : undefined;
  if (this.isDebugging)
    console.debug({
      ["mini-cookies"]: { name, value },
    });
  if (value) return value;
}

function updateState(this: CookieFactory) {
  showStateOption(this.isDebugging);
  return this;
}

function clearState(this: CookieFactory) {
  return this;
}

function review(this: CookieFactory) {
  showStateOption(this.isDebugging);
}

function setCookie(this: CookieFactory, name: string, value: string, attrs: CookieAttributes = {}) {
  const cookieValue = encodeURIComponent(value);
  const cookieAttributes = setCookieAttributes(attrs);
  document.cookie = `${name}=${cookieValue};${cookieAttributes}`;
  this.updateState(name, value, attrs);
  return this;
}

function removeCookie(this: CookieFactory, name: string) {
  this.set(name, "", { days: -1 });
  this.updateState(name, "");
  return this;
}

export default function miniCookies({
  debug = false,
  id = "mini-cookies-state",
}: Options = {}): CookieFactory {
  return {
    hasState: false,
    isDebugging: debug,
    id,
    setCookieList,
    get: getCookie,
    updateState,
    clearState,
    review,
    set: setCookie,
    remove: removeCookie,
  };
}
