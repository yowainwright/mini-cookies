export interface CookieDictionary {
  [key: string]: string;
}

export interface CookieAttributes {
  days?: number;
  domain?: string;
  expires?: Date;
  isSecure?: boolean;
  isStrictSecure?: boolean;
  ["__Host-"]?: string;
  httponly?: boolean;
  ["max-age"]?: string;
  path?: string;
  samesite?: "lax" | "strict" | "none";
  secure?: boolean;
  ["__Secure-"]?: boolean;
}

export interface Options {
  debug?: boolean;
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
  updateState: (name: string, value: string, attrs?: CookieAttributes) => CookieFactory;
  clearState: () => CookieFactory;
  review: () => CookieDictionary | void;
  set: (name: string, value: string, attrs?: CookieAttributes) => CookieFactory;
  remove: (name: string) => CookieFactory;
}
