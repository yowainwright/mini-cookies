import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import './main.scss'
import App from './App'
import miniCookies from 'mini-cookies'

// instantiate  mini-cookies and set a default cookie
const cookies = miniCookies()
cookies.set('mini', 'cookies')
// set context
export const Cookies = createContext(cookies)

ReactDOM.render(
	<React.StrictMode>
		<Cookies.Provider value={cookies}>
			<App />
		</Cookies.Provider>
	</React.StrictMode>,
	document.getElementById('root'),
)
