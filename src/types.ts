export interface CookieDictionary {
  [key: string]: string;
}

export interface CookieAttributes {
  days?: number; // ex, 7
  domain?: string; // ex "example.com"
  expires?: Date; // ex, new Date(Date.now())
  ["__Host-"]?: string;
  httponly?: boolean;
  ["max-age"]?: string; // ex, -1
  path?: string; // ex, "/foo/bar"
  samesite?: "lax" | "strict" | "none"; // lax: user tracking level, strick: prevents cross-site cookie sending
  secure?: boolean;
  ["__Secure-"]?: boolean;
}

export interface Options {
  debug?: boolean;
  hasState?: boolean;
  id?: string;
}

export interface State {
  [x: string]:
    | Record<string, Record<string, string> | undefined>
    | { attrs?: CookieAttributes | undefined; value: string };
}

export interface SetUpdatedState {
  id: string;
  name: string;
  value: string;
  attrs: CookieAttributes;
}

export interface CookieFactory {
  hasState: boolean;
  isDebugging: boolean;
  id: string;
  setCookieList: () => CookieDictionary;
  get: (name: string) => string | void;
  updateState: (
    name: string,
    value: string,
    attrs?: CookieAttributes,
  ) => CookieFactory;
  clearState: () => CookieFactory;
  review: () => CookieDictionary;
  set: (name: string, value: string, attrs?: CookieAttributes) => CookieFactory;
  remove: (name: string) => CookieFactory;
}
