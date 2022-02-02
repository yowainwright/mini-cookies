export type MiniCookiesOptions = {
	isDebugging?: boolean
}

export type CookieDictionary = {
	[key: string]: string
}

export type CookieOptions = {
	days?: number
	path?: string
	domain?: string
	secure?: boolean
}
