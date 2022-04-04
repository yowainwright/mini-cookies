import { CookieAttributes, CookieDictionary, Options } from "./types";
/**
 * Mini Cookies 🍪
 * @description Mini Cookies is a simple and minimalistic cookie management tool.
 */
/**
 * setCookieAttributes
 * @description a cookie attribute manager
 * @param {CookieAttributes} attrs cookie attributes
 * @returns {string}
 */
export declare function setCookieAttributes(attrs: CookieAttributes): string;
/**
 * mini-cookies 🍪
 * @description a just a few lines of code cookie manager
 * @param {Options} options no options yet
 * @returns {MiniCookies} a cookie manager factory function
 */
export default function miniCookies(options?: Options): {
    setCookieList(): CookieDictionary;
    get(name: string): string | undefined;
    set(name: string, value: string, attrs?: CookieAttributes): any;
    remove(name: string): any;
};
