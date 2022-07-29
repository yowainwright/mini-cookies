import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import { lettersOnly } from '../utils'
import { Dispatch, GlobalState } from './../App'

const options = {
	required: true,
}

const defaultValues = {
	name: '',
	value: '',
}

const initialState = {
	...defaultValues,
	isValid: false,
}

export function Form() {
	const cookies = useContext(GlobalState)
	const dispatch = useContext(Dispatch)
	const [state, setState] = useState(initialState)
	const { getValues, handleSubmit, register, reset, setValue } = useForm({
		mode: 'onTouched',
		defaultValues,
	})

	const hasFivePlusCookies = Object.keys(cookies).length >= 5;

	function onSubmit() {
		const { name, value, isValid } = state
		if (isValid && !hasFivePlusCookies) {
			setState(initialState)
			dispatch({ type: 'SET_STATE', payload: { name, value } })
			reset()
		}
	}

	function handleFormUpdate() {
		const { name, value } = getValues()
		if (name !== state.name || value !== state.value) {
			const isValid = name.length && value.length
			setState({ name, value, isValid })
		}
	}

	function handleInput(event): void {
		const fieldValue = lettersOnly(event.target.value)
		const trimmedValue =
			fieldValue.length > 10 ? fieldValue.slice(0, 10) : fieldValue
		setValue(event.target.name, trimmedValue)
		handleFormUpdate()
	}

	return (
		<div className='mc__container'>
			{hasFivePlusCookies && (
				<div className='mc__screen'>
					<h2 className='mc__h2'>Remove a cookie to enable the form!</h2>
				</div>)}
			<form className="mc__form" onSubmit={handleSubmit(onSubmit)}>
				<div className='mc__form-group'>
					<input
						{...register('name', options)}
						className="mc__input mc__input--name"
						placeholder="Input a cookie name!"
						onChange={handleInput}
						disabled={hasFivePlusCookies}
					/>

					<input
						{...register('value', options)}
						className="mc__input mc__input--value"
						placeholder="Input the cookie's value!"
						onChange={handleInput}
						disabled={hasFivePlusCookies}
					/>
				</div>
				<button
					className="mc__button mc__button--submit"
					type="submit"
					disabled={!state?.isValid}
				>
					Add a cookie!
				</button>
			</form>
		</div>
	)
}
