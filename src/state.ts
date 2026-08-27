import miniCookies from "./index.ts";
import type {
  CookieAttributes,
  CookieFactory,
  CookieState,
  Options,
  SetUpdatedState,
} from "./types.ts";

function readState(id: string): CookieState {
  const currentStorage = localStorage.getItem(id);
  return currentStorage ? JSON.parse(currentStorage) : {};
}

function setUpdatedState({ id, name, value, attrs }: SetUpdatedState) {
  const currentStorage = localStorage.getItem(id);
  const currentState = (currentStorage ? JSON.parse(currentStorage) : {}) as CookieState;
  if (value) {
    const updatedState = {
      ...currentState,
      [name]: {
        name,
        value,
        ...(Object.keys(attrs).length ? { attrs } : {}),
      },
    };
    localStorage.setItem(id, JSON.stringify(updatedState));
  } else if (Object.keys(currentState).length) {
    const updatedState = { ...currentState };
    delete updatedState[name];
    localStorage.setItem(id, JSON.stringify(updatedState));
  }
}

export default function miniCookiesWithState({
  debug = false,
  id = "mini-cookies-state",
}: Options = {}): CookieFactory {
  const cookies = miniCookies({ debug, id });

  return {
    ...cookies,
    hasState: true,

    updateState(name: string, value: string, attrs: CookieAttributes = {}) {
      setUpdatedState({ id: this.id, name, value, attrs });
      return this;
    },

    clearState() {
      localStorage.removeItem(this.id);
      this.remove(this.id);
      return this;
    },

    review() {
      const currentState = readState(this.id);
      if (this.isDebugging) console.info({ ["mini-cookies"]: currentState });
      return currentState;
    },
  };
}
