import './style.css'

type MiniCookiesOptions = {
	isDebugging?: boolean
}

type CookieDictionary = {
	[key: string]: string
}

type CookieOptions = {
	days?: number
	path?: string
	domain?: string
	secure?: boolean
}

function listCookies(): CookieDictionary {
	return document.cookie
		.split(';')
		.map((cookie: string) => cookie.split('='))
		.reduce(
			(list, [key, value]) => ({
				...list,
				[key.trim()]: decodeURIComponent(value),
			}),
			{},
		)
}

function miniCookie(options: MiniCookiesOptions = {}) {
	const cookies = listCookies()
	return {
		cookies,
		get: (name: string): string | void => {
			if (cookies[name]) {
				return cookies[name]
			} else if (options.isDebugging) {
				console.warn(`Cookie "${name}" not found.`)
			}
		},
		set(name: string, value: string, { days }: CookieOptions) {
			const expires: string = days
				? ` expires=${new Date(Date.now() + days * 864e5).toUTCString()};`
				: ''
			document.cookie = `${name}=${encodeURIComponent(value)};${expires}`
			return this
		},
		remove(name: string) {
			this.set(name, '', { days: -1 })
			return this
		},
	}
}

miniCookie({ isDebugging: true }).set('foo', 'bar', { days: 1 })

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Mini Cookies!</h1>
  <p>Initially, this is a <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite starter</a>.</p>
`
