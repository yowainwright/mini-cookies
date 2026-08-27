import type { CookieState, SetUpdatedState } from "./types.ts";

export function setUpdatedState({ id, name, value, attrs }: SetUpdatedState) {
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
