export type CookiesOptions = {
	isDebugging?: boolean
}

export type CookieDictionary = {
	[key: string]: string
}

export type CookieAttributes = {
	days?: number
	path?: string
	domain?: string
	secure?: boolean
}
