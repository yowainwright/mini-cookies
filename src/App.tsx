import React from 'react'
import { useForm } from 'react-hook-form'
import miniCookies from 'mini-cookies'

export function CookieEmoji() {
	return <figure className="mc_cookie-emoji">🍪</figure>
}

export function AddCookieForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm()
	const onSubmit = (data) => console.log(data)

	console.log(watch('example'), errors)

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mc__form">
			<input
				{...register('addCookie')}
				className="mc__input"
				placeholder="Input a cookie name!"
			/>

			<button type="submit">Add a cookie!</button>
		</form>
	)
}

export function Header() {
	return (
		<header className="mc__header">
			<h1 className="mc__h1">Mini Cookies</h1>
			<p className="mc_desc">
				Mini Cookies is a simple and minimalistic cookie management tool.
			</p>
			<h2>Try it out!</h2>
			<AddCookieForm />
		</header>
	)
}

export default function App() {
	const cookies = miniCookies()
	cookies.set('mini', 'cookies!')
	cookies.get('mini') // cookies!
	console.log({ cookies })
	return (
		<main className="mc">
			<CookieEmoji />
			<Header />
		</main>
	)
}
