![mini-cookies](https://user-images.githubusercontent.com/1074042/183312781-79fe7561-5c45-4010-ac2c-14dbf3dbe423.svg)

# [Mini Cookies](https://jeffry.in/mini-cookies) 🍪

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
- \*`{id: string}`: The unique identifier for each mini-cookie instance.

---

##### \* `id`: unique identifier for each mini-cookie instance

The unique identifier is important to consider when considering mini-cookie state management. It provides a way to identify unique mini-cookie instances. **If** you're dealing with a scenerio where you have multiple mini-cookie instances, insuring you have a unique `id` for your mini-cookie instance is required for accurate mini-cookie state management.

---

| Option | Type | Default | Description |
| :------: | :----: | :-------: | :----------- |
| `id` | `string` | `'mini-cookies-key'` | The unique identifier for each mini-cookie instance. |
| `hasState` | `boolean` | `false` | Whether or not to enable Mini Cookie state management. |
| `debug` | `boolean` | `false` | Whether or not to enable debugging. |

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

---

## Opt-in Cookie State Management

You don't need to use Mini Cookies state! It is opt-in only! This is good for your app's maintainability. The recommended pattern is using Mini Cookies state management to get your `document.cookie`'s working how you want and then turning off Mini Cookies State Management when your cookies are working how you want. More state diagrams and such to come!

---

## Recipes

Mini Cookies is built form ease of use. It provides ways to keep track of the Cookie attributes and the state of the Cookies you set. Furthermore, Cookie attributes can be confusing. Using simplified convenience attributes, **"smart attributes"**, making the right attribute decisions is just a bit easier.

### Smart attributes

Mini Cookies provides smart attributes which are built to be intuitive to how we generally set cookies.

---

#### `days`

> `days` creates an `expires` cookie attribute.

By adding the `days` attribute, you can set the `expires` attribute to the number of days from now vs having to think about dates, etc.

```typescript
// set expires to 1 day useing `days`
const cookies = miniCookies();
cookies.set('mini', 'cookies!!!', { days: 1 });
```

If you want to explicitly set the `expires` attribute, you can still use `expires` attribute.

```typescript
// set expires manually
const timeToAdd = 1000 * 60 * 60 * 24 * 7 * 4 * 6;
const date = new Date();
const expiryTime = `${parseInt(date.getTime())}${timeToAdd}`;
date.setTime(expiryTime);
const expires = date.toUTCString();
const cookies = miniCookies();
cookies.set('mini', 'cookies!!!', { expires });
```

---

#### `isSecure`

> `isSecure` creates `secure`, `__Secure-`, and `samesite=strict` cookie attributes.

```typescript
// set isSecure
const cookies = miniCookies();
cookies.set('mini', 'cookies!!!', { isSecure: true });
```

If you want to explicitly set secure cookie attributes, you can still provide the following attributes.

```typescript
// set secure attributes manually
cookies.set('mini', 'cookies!!!', { secure: true, __Secure__: true, samesite: 'strict' });
```

---

#### `isStrictSecure`

> `isStrictSecure` creates `secure`, `__Secure-`, `__Host-`, `path=/` and `samesite=strict` cookie attributes.

```typescript
// set isStrictSecure
const cookies = miniCookies();
cookies.set('mini', 'cookies!!!', { isStrictSecure: true });
```

If you want to explicitly set secure cookie attributes, you can still provide the following attributes.

```typescript
// set secure attributes manually
cookies.set('mini', 'cookies!!!', { secure: true, __Secure__: true, samesite: 'strict', __Host__: true, path: '/' });
```

---

### Opt-in State

A huge benefit to Mini-Cookies is the ability to opt-in for state management. Although, `document.cookies` is only a string api, the fact that attributes are `write-only` and that there is often a misunderstanding that cookies can't be overwritten can be a problem.

With Mini Cookies, you can opt-in for state management.

```typescript
const cookies = miniCookies({ hasState: true });
cookies.set('mini', 'cookies!!!');
cookies.review(); // { mini: 'cookies!!!' }
```

If you don't want opt-in state management, you can still use Mini Cookies without it.

```typescript
const cookies = miniCookies();
cookies.set('mini', 'cookies!!!');
cookies.review(); // <void>
```

---

## Sandbox Environments

**Note:** cookies are not supported in sandbox environments. Within the StackBlitz sandbox, click the "Open in New Tab" button to view mini-cookies in action! See the image below for visual UI reference.

---

![mini-cooies-stackblitz](https://user-images.githubusercontent.com/1074042/184686402-a880f134-5aaf-4b58-939d-42c4bbc38450.gif)

---

- [mini-cookies basic demo](https://stackblitz.com/edit/mini-cookies?file=index.js)
- [mini-cookies multi-state instance demo](https://stackblitz.com/edit/mini-cookies-multi-state-instances?file=index.js)

[![Mini Cookies—A document.cookie manager - Watch Video](https://cdn.loom.com/sessions/thumbnails/a77bdd325bcf4c399c93d7297988d42b-with-play.gif)](https://www.loom.com/share/a77bdd325bcf4c399c93d7297988d42b)

---
## Comparisons

| name | file size | key features |
| :--- | --- | :--- |
| mini-cookies | ![size](https://img.shields.io/bundlephobia/minzip/mini-cookies) | state management, smart attributes |
| js-cookie | ![size](https://img.shields.io/bundlephobia/minzip/js-cookie/3) | well known, simple api |

---

## Feature Requests

Yes! I'm happy to add more utility to Mini Cookies!

---

Made by [@yowainwright](https://github.com/yowainwright), MIT 2022
