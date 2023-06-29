import axios from 'axios'
import {
	SIGNUP_SUCCESS,
	SIGNUP_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADING,
	USER_LOADED,
	TOKEN_REFRESH,
	AUTH_ERROR,
	USER_UPDATE,
} from './types'

import { addError } from './errors'
import getAccessToken from '../../helpers/getAccessToken'

export const refreshToken = () => async (dispatch, getState) => {
	const config = getAccessToken(getState)

	try {
		const refresh =
			getState().auth.refresh || localStorage.getItem('refresh')
		const body = refresh ? JSON.stringify({ refresh }) : {}

		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/login/refresh/`,
			body,
			config
		)

		dispatch({
			type: TOKEN_REFRESH,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: AUTH_ERROR,
		})
	}
}

export const loadUser = () => async (dispatch, getState) => {
	// User Loading
	dispatch({ type: USER_LOADING })

	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/accounts/current/`,
			getAccessToken(getState)
		)

		dispatch({
			type: USER_LOADED,
			payload: res.data,
		})
	} catch (err) {
		const refresh = localStorage.getItem('refresh')

		if (err.response.status === 401 && refresh) {
			await dispatch(refreshToken())
			if (getState().auth.token) await dispatch(loadUser())
		} else dispatch({ type: AUTH_ERROR })
	}
}

export const login = (email, password) => async (dispatch, getState) => {
	const body = JSON.stringify({ email, password })

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/login/`,
			body,
			getAccessToken(getState)
		)

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		})
		dispatch(loadUser())
	} catch (err) {
		if (err.response)
			dispatch(addError(err.response.data, err.response.status))

		dispatch({
			type: LOGIN_FAIL,
		})
	}
}

export const signUp =
	(token, { email, username, password, password2 }) =>
	async (dispatch) => {
		const body = JSON.stringify({
			email,
			username,
			password,
			password2,
			// 'g-recaptcha-response': token,
		})

		try {
			await axios.post(
				`${process.env.REACT_APP_API_URL}/accounts/signup/`,
				body,
				getAccessToken()
			)

			dispatch({
				type: SIGNUP_SUCCESS,
			})

			dispatch(login(email, password))
		} catch (err) {
			if (err.response)
				dispatch(addError(err.response.data, err.response.status))

			dispatch({
				type: SIGNUP_FAIL,
			})
		}
	}

export const updateUserData = (data) => async (dispatch, getState) => {
	try {
		const config = getAccessToken(getState)
		config['headers']['Content-Type'] = 'multipart/form-data'

		let body = new FormData()

		for (const field in data) body.append(field.toString(), data[field])

		const res = await axios.patch(
			`${process.env.REACT_APP_API_URL}/accounts/current/`,
			body,
			config
		)

		dispatch({
			type: USER_UPDATE,
			payload: res.data,
		})
	} catch (err) {
		if (err.response.status === 401) {
			await dispatch(refreshToken())
			if (getState().auth.token) await dispatch(updateUserData(data))
		} else {
			if (err.response)
				dispatch(addError(err.response.data, err.response.status))
		}
	}
}

export const logout = () => (dispatch) => {
	dispatch({
		type: LOGOUT,
	})
}
