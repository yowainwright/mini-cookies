import { SetUpdatedState, State } from "./types";

export function setUpdatedState({ id, name, value, attrs }: SetUpdatedState) {
  const currentStorage = localStorage.getItem(id);
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
    localStorage.setItem(id, JSON.stringify(updatedState));
  } else if (Object.keys(currentState).length) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: deleted, ...updatedState } = currentState;
    localStorage.setItem(id, JSON.stringify(updatedState));
  }
}
