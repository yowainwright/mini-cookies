import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import './main.scss'
import App from './App'
import miniCookies from 'mini-cookies'

// instantiate  mini-cookies and set a default cookie
const cookies = miniCookies({ debug: true, hasState: true })
cookies.set('mini', 'cookies')
// set context

const initialGlobalState = {
	cookies: [],
}
export const Cookies = createContext(cookies)
export const GlobalState = createContext(initialGlobalState)

ReactDOM.render(
	<React.StrictMode>
		<Cookies.Provider value={cookies}>
			<GlobalState.Provider value={initialGlobalState}>
				<App />
			</GlobalState.Provider>
		</Cookies.Provider>
	</React.StrictMode>,
	document.getElementById('root'),
)
