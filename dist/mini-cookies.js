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
export function setCookieAttributes(attrs) {
    const items = Object.keys(attrs);
    // prefer days over expires attribute
    const filteredAttrs = items.every((attr) => ["days", "expires"].includes(attr))
        ? items.filter((attr) => attr !== "expires")
        : items;
    // return attributes with booleans  and key value pairs
    return filteredAttrs.reduce((str, attr) => {
        const isTruthyAttr = ["secure", "httponly", "__Secure-"].includes(attr);
        // return truthy attributes w/o values
        if (isTruthyAttr)
            str += `; ${attr}`;
        // return days helper as expires
        else if (attr === "days")
            str += `; expires=${new Date(Date.now() + attrs[attr] || 0 * 864e5).toUTCString()};`;
        // return all other key value string pairs
        else
            str += `; ${attr}=${attrs[attr]}`;
        return str;
    }, "");
}
/**
 * mini-cookies 🍪
 * @description a just a few lines of code cookie manager
 * @param {Options} options no options yet
 * @returns {MiniCookies} a cookie manager factory function
 */
export default function miniCookies(options = {}) {
    return {
        setCookieList() {
            return document.cookie
                .split(";")
                .map((cookie) => cookie.split("="))
                .reduce((list, [key, value]) => ({
                ...list,
                [key.trim()]: decodeURIComponent(value),
            }), {});
        },
        // returns a cookie value if available
        get(name) {
            const cookies = this.setCookieList();
            if (cookies[name]) {
                return cookies[name];
            }
        },
        // sets a cookie with attributes
        set(name, value, attrs = {}) {
            document.cookie = `${name}=${encodeURIComponent(value)};${setCookieAttributes(attrs)}`;
            return this;
        },
        // removes a cookie by setting it's expires attribute to -1 and value to empty
        remove(name) {
            this.set(name, "", { days: -1 });
            return this;
        },
    };
}
