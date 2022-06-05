export type State = {
	cookies: Array<Record<string, string>>
}

export type Action = {
	payload: any
	type: string
}

export type AppProps = {
	cookies: Record<string, any>
}
