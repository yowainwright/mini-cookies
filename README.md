# Mini Cookies 🍪

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
![ci](https://github.com/yowainwright/mini-cookies/actions/workflows/ci.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/mini-cookies)](https://www.npmjs.com/package/mini-cookies)
[![unpkg](https://img.shields.io/badge/unpkg-link-blue.svg)](https://unpkg.com/mini-cookies@latest/dist/mini-cookies.umd.js)
[![Github](https://badgen.net/badge/icon/github?icon=github&label&color=black)](https://github.com/yowainwright/mini-cookies)

A mini JS Document.cookie manager to help you write your cookies right! 🎯

Use (or try) it in your \*browser's console right now!

```js
eval(await (await fetch('https://unpkg.com/mini-cookies@latest/dist/mini-cookies.umd.js')).text())
const cookies = miniCookies();
cookies.set('mini', 'cookies!');
cookies.get('mini'); // cookies!
```

\*Evaling won't work on sites that don't allow the`unpkg` domain.

---

## Why Mini Cookies?

Mini Cookie's API is very small. It's size is also very small.
Even though Mini Cookies is super small, it's built to make using [`document.cookie`](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)'s API easy!

### How?

1. It [smartly assists](#smartly-assist-constructing-cookies) in contructing `document.cookie` attributes.
2. And, it store's your `document.cookie` [state](opt-in-cookie-state-management) so you can access/review your `document.cookie`'s state later—including attributes!

---

## Install

```bash
npm install mini-cookies --save
# pnpm/yarn add mini-cookies --save
```

---

## Use

Basic usage

```typescript
import miniCookies from 'mini-cookies';

const cookies = miniCookies();
cookies.set('mini', 'cookies!!!');
cookies.get('mini'); // 'cookies!!!'
cookies.remove('mini'); // no cookie!!! 😫
```

With Mini Cookie state management

```typescript
import miniCookies from 'mini-cookies';

const cookies = miniCookies({ hasState: true });
cookies.set('mini', 'cookies!!!');
cookies.get('mini'); // 'cookies!!!'
cookies.review(); // mini-cookies-🍪: { mini: { value: 'cookies!!!' } }
cookies.remove('mini'); // no cookie!!! 😫
```

With debugging

```typescript
import miniCookies from 'mini-cookies';

const cookies = miniCookies({ hasState: true, debug: true });
cookies.set('mini', 'cookies!!!');
cookies.get('mini'); // 'cookies!!!' + logs
cookies.review(); // mini-cookies-🍪: { mini: { value: 'cookies!!!' } }
cookies.remove('mini'); // no cookie!!! 😫 + logs
```

---

## API

### `miniCookies({options})`

**`{options}`** an object argument of **Mini Cookies** options.

- `{hasState: boolean}`: Whether or not to enable Mini Cookie state management.
- `{debug: boolean}`: Whether or not to enable debugging.

---

### `miniCookies({options}).set(<key>, <value>), {attributes})`

Set a cookie.

#### params

- `<key>`: a string
- `<value>`: a string
- `{attributes}`: an object of cookie attributes.

---

### `miniCookies({options}).get(<key>)`

Gets a cookie by string.

#### param

- `<key>`: a string

---

### `miniCookies({options}).remove(<key>)`

Removes a cookie by string.

#### param

- `<key>`: a string

---

### `miniCookies({options}).review()`

Returns mini-cookie state.

\***`hasState`** must be enabled for this to work!

---

### `miniCookies({options}).clearState()`
Clears mini-cookie state.

*hasState must be enabled for this to work!

---

## Smartly Assist Constructing Cookies

The ability to smartly assist in constructing cookie attributes and store cookie state is awesome because `document.cookie` cookies can't be updated (only overwritten) and `document.cookie` cookies attributes can't be read (only written). With Mini Cookies, `document.cookie` state is accessible and writing the `document.cookie` you want is easy. More to diagrams and such on this to come!

## Opt-in Cookie State Management

You don't need to use Mini Cookies state! It is opt-in only! This is good for your app's maintainability. The recommended pattern is using Mini Cookies state management to get your `document.cookie`'s working how you want and then turning off Mini Cookies State Management when your cookies are working how you want. More state diagrams and such to come!

## Roadmap

- [ ] Build out more cookie attribute support (next up)
- [ ] Provide cookie attribute examples (very soon)
- [ ] Provide code sandbox environments (very soon)
- [ ] Provide more architectural documentation

---

## Feature Requests

Yes! I'm happy to add more utility to Mini Cookies!

---

Made by [@yowainwright](https://github.com/yowainwright), MIT 2022
