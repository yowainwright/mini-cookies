import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import miniCookies from 'mini-cookies'

export function CookieEmoji() {
	return <figure className="mc__img mc__img--cookie-emoji">🍪</figure>
}

export function AddCookieForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm()
	const onSubmit = () => console.log('hello')

	console.log('its working', watch('example'), errors)

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mc__form">
			<input
				{...register('name')}
				className="mc__input mc__input--name"
				placeholder="Input a cookie name!"
			/>

			<input
				{...register('value')}
				className="mc__input mc__input--value"
				placeholder="Input the cookie's value!"
			/>

			<button
				className="mc__button mc__button--submit"
				type="submit"
				onSubmit={onSubmit}
			>
				Add a cookie!
			</button>
		</form>
	)
}

export function Header() {
	return (
		<header className="mc__header">
			<h1 className="mc__h1">Mini Cookies</h1>
			<p className="mc_desc">
				Mini Cookies is a minimalist cookie management tool written in
				Typescript for your website's JavaScript needs.
			</p>
			<h2 className="mc__h2">Try it out!</h2>
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
			<section className="mc__section mc__section--display">
				<CookieEmoji />
				<Header />
				<AddCookieForm />
			</section>
		</main>
	)
}
