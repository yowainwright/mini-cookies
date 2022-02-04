# Mini Cookies 🍪

> Workin in progress. Should be be at `0.1.0` very soon!

Mini Cookies is a simple and minimalistic cookie management tool.

## Install

```bash
npm i mini-cookies
```

## Use

```typescript
import miniCookies from 'mini-cookies';

const cookies = miniCookies();
cookies.set('mini', 'cookies');
cookies.get('mini'); // 'cookies'
cookies.remove('mini'); // no cookie 😫
```

## API

### `miniCookies({options})`

> **`{options}`** an object argument of **Mini Cookies** options.

---

#### `miniCookies({options}).set(<key>, <value>), {attributes})`

Set a cookie. params: `<key>`: a string, `<value>`: a string, `{attributes}`: an object of cookie attributes.

#### `miniCookies({options}).get(<key>)`

Gets a cookie by string. params: `<key>`: a string

---

#### `miniCookies({options}).remove(<key>)`

Removes a cookie by string. params: `<key>`: a string

---

## Synopsis

That's it! Mini Cookies is built for simplicity.
It has 0 dependencies and is just a few lines of code.
