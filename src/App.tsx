import React from 'react'
import { Demo, Emoji, Form, Header } from './components'

export default function App() {
	return (
		<main className="mc">
			<section className="mc__section mc__section--display">
				<Emoji />
				<Header />
				<Form />
				<Demo />
			</section>
		</main>
	)
}
