export declare type CookieDictionary = {
    [key: string]: string;
};
export declare type CookieAttributes = {
    days?: number;
    domain?: string;
    expires?: Date;
    ["__Host-"]?: string;
    httponly?: boolean;
    ["max-age"]?: string;
    path?: string;
    samesite?: "lax" | "strict" | "none";
    secure?: boolean;
    ["__Secure-"]?: boolean;
};
export declare type Options = Record<string, unknown>;
