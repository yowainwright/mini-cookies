# Mini Cookies 🍪

Mini Cookies is a simple and minimalistic cookie management tool with zero dependencies.

Use (or try) it in your \*browser's console right now!

```js
eval(await (await fetch('https://unpkg.com/mini-cookies@latest/dist/mini-cookies.umd.js')).text())
const cookies = miniCookies();
cookies.set('mini', 'cookies!');
cookies.get('mini'); // cookies!
```

\*Evaling won't work on sites that don't allow the`unpkg` domain.

---

[**🤔 Why**](#why-mini-cookies) | [**📦 Install**](#install) | [**⚙️ Usage**](#usage) | [**🧬 API**](#api) | [**🗺 Roadmap**](#roadmap) | [**🎖 Feature Requests**](#feature-requests)

---

## Why Mini Cookies?

Mini Cookie's API is very small. It's size is also very small. Even though Mini Cookies is super small, it's built to make setting up `document.cookie`'s easy!

How? It smartly assists in contructing `document.cookie` attributes and can store the state of cookies set with Mini Cookies in local storage so you can access your cookie's state later—including attributes!

The ability to smartly assist in constructing cookie attributes and store cookie state is awesome because `document.cookie` cookies can't be updated (only overwritten) and `document.cookie` cookies attributes can't be read (only written). With Mini Cookies, `document.cookie` state is accessible and writing the `document.cookie` you want is easy.

More over, you don't need to use Mini Cookie state! It is opt-in only. This is good for your app's maintainability. The recommended pattern is using Mini Cookies state management to get your `document.cookie`'s working how you want and then turning off Mini Cookies state management when your cookies are working how you want.

## Install

```bash
npm install mini-cookies
```

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

## API

### `miniCookies({options})`

**`{options}`** an object argument of **Mini Cookies** options.

- `{hasState: boolean}`: Whether or not to enable Mini Cookie state management.
- `{debug: boolean}`: Whether or not to enable debugging.

---

#### `miniCookies({options}).set(<key>, <value>), {attributes})`

Set a cookie.

##### params

- `<key>`: a string
- `<value>`: a string
- `{attributes}`: an object of cookie attributes.

---

#### `miniCookies({options}).get(<key>)`

Gets a cookie by string.

##### param

- `<key>`: a string

---

#### `miniCookies({options}).remove(<key>)`

Removes a cookie by string.

##### param

- `<key>`: a string

---

#### `miniCookies({options}).review()`

Returns mini-cookie state.

\***`hasState`** must be enabled for this to work!

---

## Roadmap

- Provide attribute examples
- Get website up

## Feature Requests

Yes! I'm happy to add more utility to this lil' `fn` that just makes cookies in the console fun!
