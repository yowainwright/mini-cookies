# Mini Cookies 🍪

Mini Cookies is a simple and minimalistic cookie management tool.

## Install

```bash
npm i mini-cookies
```

## Quick Start

```typescript
import { miniCookies } from 'mini-cookies';

const cookie = miniCookies();
cookies.set('mini', 'cookies');
cookies.get('mini'); // 'cookies'
cookies.remove('mini'); // no cookie 😫

```

## API

## `miniCookies({options..})`

> param: `{options}`, an object of `miniCookies` options.

### `.set(<key>, <value>), {options...})`

> Set a cookie. params: `<key>`: a string, `<value>`: a string, `[options...]`: an object.

---
### `.get(<key>)`

> Attempts to get a cookie. params: `<key>`: a string
