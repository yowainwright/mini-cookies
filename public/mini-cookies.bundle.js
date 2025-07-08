"use strict";
var miniCookies = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/state-manager.ts
  var state_manager_exports = {};
  __export(state_manager_exports, {
    setUpdatedState: () => setUpdatedState
  });
  function setUpdatedState({ id, name, value, attrs }) {
    const currentStorage = localStorage.getItem(id);
    const currentState = currentStorage ? JSON.parse(currentStorage) : {};
    if (value) {
      const updatedState = {
        ...currentState,
        [name]: {
          name,
          value,
          ...Object.keys(attrs).length ? { attrs } : {}
        }
      };
      localStorage.setItem(id, JSON.stringify(updatedState));
    } else if (Object.keys(currentState).length) {
      const { [name]: deleted, ...updatedState } = currentState;
      localStorage.setItem(id, JSON.stringify(updatedState));
    }
  }
  var init_state_manager = __esm({
    "src/state-manager.ts"() {
      "use strict";
    }
  });

  // src/mini-cookies.ts
  var mini_cookies_exports = {};
  __export(mini_cookies_exports, {
    default: () => miniCookies
  });

  // src/utils.ts
  var secureAttributes = ["secure", "__Secure-", "samesite"];
  var strictPathAttributes = ["path", "__Host-"];
  function setCookieAttributes(attrs = {}) {
    const items = Object.keys(attrs);
    if (!items.length) return "";
    const isSecureProtocol = document.location.protocol === "https:";
    const hasIsSecureAttr = items.find((item) => item === "isSecure") && isSecureProtocol;
    const hasIsStrict = items.find((item) => item === "isStrictSecure") && isSecureProtocol;
    let updatedAttrs = items;
    if (hasIsStrict) {
      updatedAttrs = items.concat(secureAttributes, strictPathAttributes).filter((item) => item !== "domain");
    } else if (hasIsSecureAttr) {
      updatedAttrs = items.concat(secureAttributes);
    }
    const filteredAttrs = updatedAttrs.every(
      (attr) => ["days", "expires"].includes(attr)
    ) ? updatedAttrs.filter((attr) => attr !== "expires") : updatedAttrs;
    return filteredAttrs.reduce((str, attr) => {
      const isTruthyAttr = secureAttributes.concat(["__Host-"]).includes(attr);
      if (isTruthyAttr) str += `; ${attr}`;
      if (attr === "sameSite" && hasIsSecureAttr) str += `; ${attr}=strict`;
      if (attr === "path" && hasIsStrict) str += `; ${attr}=/`;
      else if (attr === "days")
        str += `; expires=${new Date(
          Date.now() + (attrs[attr] || 0) * 864e5
        ).toUTCString()};`;
      else str += `; ${attr}=${attrs[attr]}`;
      return str;
    }, "");
  }
  function setCookieList() {
    return document.cookie.split(";").map((cookie) => cookie.split("=")).reduce(
      (list, [key, value]) => ({
        ...list,
        [key.trim()]: decodeURIComponent(value)
      }),
      {}
    );
  }

  // src/mini-cookies.ts
  var setUpdatedStateFunc = null;
  var ensureStateManager = async () => {
    if (!setUpdatedStateFunc) {
      const module = await Promise.resolve().then(() => (init_state_manager(), state_manager_exports));
      setUpdatedStateFunc = module.setUpdatedState;
    }
    return setUpdatedStateFunc;
  };
  var hasStateOption = {
    ["mini-cookies"]: {
      note: "If trying to use mini-cookie state, the hasState option must be set to true \u{1F44C}",
      docs: "https://github.com/yowainwright/mini-cookies#minicookiesoptions"
    }
  };
  function miniCookies({
    debug = false,
    hasState = false,
    id = "mini-cookies-state"
  } = {}) {
    return {
      hasState,
      isDebugging: debug,
      id,
      setCookieList,
      // returns a cookie value if available
      get(name) {
        const cookies = this.setCookieList();
        const value = cookies[name] ? decodeURIComponent(cookies[name]) : void 0;
        if (this.isDebugging)
          console.debug({
            ["mini-cookies"]: { name, value }
          });
        if (value) return value;
      },
      // updates mini-cookie temp state
      updateState(name, value, attrs = {}) {
        if (!this.hasState) {
          if (this.isDebugging) console.info(hasStateOption);
          return this;
        }
        if (setUpdatedStateFunc) {
          setUpdatedStateFunc({ id: this.id, name, value, attrs });
        } else {
          ensureStateManager().then((func) => {
            func({ id: this.id, name, value, attrs });
          });
        }
        return this;
      },
      clearState() {
        if (!this.hasState) return this;
        localStorage.removeItem(this.id);
        this.remove(this.id);
        return this;
      },
      // returns log of state
      review() {
        if (this.hasState) {
          const currentStorage = localStorage.getItem(this.id);
          const currentState = currentStorage ? JSON.parse(currentStorage) : {};
          if (this.isDebugging)
            console.info({
              ["mini-cookies"]: currentState
            });
          return currentState;
        } else if (this.isDebugging) console.info(hasStateOption);
      },
      // sets a cookie with attributes
      set(name, value, attrs = {}) {
        const cookieValue = encodeURIComponent(value);
        const cookieAttributes = setCookieAttributes(attrs);
        document.cookie = `${name}=${cookieValue};${cookieAttributes}`;
        this.updateState(name, value, attrs);
        return this;
      },
      // removes a cookie by setting it's expires attribute to -1 and value to empty
      remove(name) {
        this.set(name, "", { days: -1 });
        this.updateState(name, "");
        return this;
      }
    };
  }
  return __toCommonJS(mini_cookies_exports);
})();
if (typeof miniCookies !== "undefined" && miniCookies.default) { miniCookies = miniCookies.default; }
//# sourceMappingURL=mini-cookies.bundle.js.map