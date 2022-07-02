export type CookieDictionary = {
  [key: string]: string;
};

export type CookieAttributes = {
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
};

export type Options = {
  debug?: boolean;
  hasState?: boolean;
  id?: string;
};

export type TempState = {
  [x: string]:
    | Record<string, Record<string, string> | undefined>
    | { attrs?: CookieAttributes | undefined; value: string };
};

export type UpdateState = (
  name: string,
  value: string,
  attrs: CookieAttributes
) => void;

export type MiniCookiesFactory = {
  hasState: boolean;
  isDebugging: boolean;
  get: (name: string) => string | undefined;
  set: (name: string, value: string) => void;
  remove: (name: string) => void;
  updateState: UpdateState;
};
