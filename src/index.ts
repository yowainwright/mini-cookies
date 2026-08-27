import { setCookieAttributes, setCookieList } from "./utils.ts";
import type {
  CookieAttributes,
  CookieFactory,
  CookieState,
  Options,
  SetUpdatedState,
} from "./types.ts";

const hasStateOption = {
  ["mini-cookies"]: {
    note: "Set hasState to true or use the mini-cookies/state entrypoint to enable state.",
    docs: "https://github.com/yowainwright/mini-cookies#minicookiesoptions",
  },
};

function showStateOption(isDebugging: boolean) {
  if (isDebugging) console.info(hasStateOption);
}

function readState(id: string): CookieState {
  const currentStorage = localStorage.getItem(id);
  return currentStorage ? JSON.parse(currentStorage) : {};
}

function setUpdatedState({ id, name, value, attrs }: SetUpdatedState) {
  const currentState = readState(id);
  if (value) {
    const hasAttributes = Object.keys(attrs).length > 0;
    const updatedCookie = {
      name,
      value,
      ...(hasAttributes ? { attrs } : {}),
    };
    const updatedState = {
      ...currentState,
      [name]: updatedCookie,
    };
    localStorage.setItem(id, JSON.stringify(updatedState));
  } else if (Object.keys(currentState).length) {
    const updatedState = { ...currentState };
    delete updatedState[name];
    localStorage.setItem(id, JSON.stringify(updatedState));
  }
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

function updateState(
  this: CookieFactory,
  name: string,
  value: string,
  attrs: CookieAttributes = {},
) {
  if (!this.hasState) {
    showStateOption(this.isDebugging);
    return this;
  }

  setUpdatedState({ id: this.id, name, value, attrs });
  return this;
}

function clearState(this: CookieFactory) {
  if (!this.hasState) return this;
  localStorage.removeItem(this.id);
  this.remove(this.id);
  return this;
}

function review(this: CookieFactory) {
  if (this.hasState) {
    const currentState = readState(this.id);
    if (this.isDebugging) console.info({ ["mini-cookies"]: currentState });
    return currentState;
  }

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
  hasState = false,
  id = "mini-cookies-state",
}: Options = {}): CookieFactory {
  return {
    hasState,
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
