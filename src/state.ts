import miniCookies from "./index.ts";
import { setUpdatedState } from "./state-manager.ts";
import type { CookieAttributes, CookieFactory, CookieState, Options } from "./types.ts";

function readState(id: string): CookieState {
  const currentStorage = localStorage.getItem(id);
  return currentStorage ? JSON.parse(currentStorage) : {};
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
