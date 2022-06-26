import React, { useContext, useEffect, useState } from 'react'

import { Cookies } from './../main'

export function Demo() {
	const cookies = useContext(Cookies)
	const [state, setState] = useState() as any

	const allCookies = cookies.setCookieList()

	useEffect(() => {
		if (allCookies !== state) {
			setState(allCookies)
		}
		console.log({ state })
	}, [allCookies, state, setState])
	return <div>{JSON.stringify(state)}</div>
}
