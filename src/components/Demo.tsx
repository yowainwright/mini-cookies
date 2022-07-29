import React, { useContext, useEffect, useState } from 'react'

import { GlobalState } from './../App'

export const Cookie = ({ name, value }) => {
	return (
		<figure className='mc__figure'>
			<div className='mc__cookie'>
				🍪
			</div>
			<div className='mc__caption'>
				<div className='mc__name'>{name}</div>
				<div className='mc__value'>{value}</div>
			</div>
		</figure>
	)
}

export function Demo() {
	const cookies = useContext(GlobalState)
	const [state, setState] = useState({})
	useEffect(() => {
		const cookieCount = Object.keys(cookies).length;
		const cookieState = Object.keys(state).length;
		if (cookieCount !== cookieState) setState(cookies)
	}, [cookies, state, setState])
	const cookieList = Object.keys(state).map(name => state[name]);
	return (
		<div className="mc__demo">
			{cookieList.map(({ name, value}, key) => <Cookie name={name} value={value} key={key} />)}
		</div>
	)
}
