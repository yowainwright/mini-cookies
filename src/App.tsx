import React, { createContext, useReducer } from 'react'
import miniCookies from 'mini-cookies'
import { Demo,  Form, Header } from './components'

// instantiate  mini-cookies and set a default cookie
const cookies = miniCookies({ debug: true, hasState: true })
cookies.set('mini', 'cookies')
// set context

const initialGlobalState = {}

export function reducer(state, { payload, type }) {
  switch (type) {
    case 'SET_STATE':
			const { name, value } = payload;
			cookies.set(name, value);
			const updatedState = cookies.review();
      return updatedState;
    default:
      return state
  }
}

export const Dispatch = createContext();
export const GlobalState = createContext()

export default function App() {
	const initialState = cookies.review();
	const [state, dispatch] = useReducer(reducer, initialState)
	return (
			<Dispatch.Provider value={dispatch}>
				<GlobalState.Provider value={state}>
					<main className="mc">
						<section className="mc__section mc__section--display">
							<Header />
							<Form />
							<Demo />
						</section>
					</main>
				</GlobalState.Provider>
			</Dispatch.Provider>
	)
}
