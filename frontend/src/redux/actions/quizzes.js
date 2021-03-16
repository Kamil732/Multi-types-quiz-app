import axios from 'axios'
import {
	CATEGORY_ERROR,
	CATEGORY_LOADING,
	CREATE_QUIZ,
	CREATE_QUIZ_FAIL,
	GET_CATEGORY,
	GET_QUIZ_PUNCTATIONS_SUCCESS,
	GET_QUIZ_PUNCTATIONS_FAIL,
	GET_QUIZZES,
	GET_QUIZ_FAIL,
	GET_QUIZ_SUCCESS,
	QUIZZES_ERROR,
	QUIZZES_LOADING,
	UPDATE_QUIZ,
	DELETE_QUIZ,
	UPDATE_QUIZ_PUNCTATIONS,
} from './types'

import { addError } from './errors'
import getAccessToken from '../../helpers/getAccessToken'
import { refreshToken } from './auth'

export const getQuizzes = (
	search = '',
	url = `${process.env.REACT_APP_API_URL}/quizzes/`,
	authoriaztion = false
) => async (dispatch, getState) => {
	dispatch({ type: QUIZZES_LOADING })

	const URL = url + search

	const config =
		authoriaztion === false
			? {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'Accept-Language': 'en',
					},
			  }
			: getAccessToken(getState)

	try {
		const res = await axios.get(URL, config)

		dispatch({
			type: GET_QUIZZES,
			payload: res.data,
		})
	} catch (err) {
		if (err.response) {
			if (err.response.status === 401) {
				await dispatch(refreshToken())

				if (getState().auth.token)
					await dispatch(getQuizzes(search, url, authoriaztion))
			} else
				dispatch({
					type: QUIZZES_ERROR,
				})
		}
	}
}

export const getCategories = () => async (dispatch) => {
	dispatch({ type: CATEGORY_LOADING })

	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/categories/`
		)

		dispatch({
			type: GET_CATEGORY,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: CATEGORY_ERROR,
		})
	}
}

export const getQuiz = (author_slug, quiz_slug) => async (dispatch) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/`
		)

		dispatch({
			type: GET_QUIZ_SUCCESS,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: GET_QUIZ_FAIL,
		})
	}
}

export const getQuizPunctations = (author_slug, quiz_slug) => async (
	dispatch,
	getState
) => {
	try {
		const config = getAccessToken(getState)

		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/punctation/`,
			config
		)

		dispatch({
			type: GET_QUIZ_PUNCTATIONS_SUCCESS,
			payload: res.data,
		})
	} catch (err) {
		if (err.response.status === 401) {
			await dispatch(refreshToken())
			if (getState().auth.token)
				await dispatch(getQuizPunctations(author_slug, quiz_slug))
		} else dispatch({ type: GET_QUIZ_PUNCTATIONS_FAIL })
	}
}

export const updatePunctations = (data, author_slug, quiz_slug) => async (
	dispatch,
	getState
) => {
	try {
		const config = getAccessToken(getState)

		const body = JSON.stringify(data)

		const res = await axios.put(
			`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/punctation/`,
			body,
			config
		)

		dispatch({
			type: UPDATE_QUIZ_PUNCTATIONS,
			payload: res.data,
		})
	} catch (err) {
		if (err.response.status === 401) {
			await dispatch(refreshToken())
			if (getState().auth.token)
				await dispatch(updatePunctations(data, author_slug, quiz_slug))
		} else if (err.response)
			dispatch(addError(err.response.data, err.response.status))
	}
}

export const createQuiz = ({
	title,
	description,
	section,
	category,
	image_url,
}) => async (dispatch, getState) => {
	try {
		const body = JSON.stringify({
			title,
			description,
			section,
			category,
			image_url,
		})

		const config = getAccessToken(getState)

		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/quizzes/`,
			body,
			config
		)

		dispatch({
			type: CREATE_QUIZ,
			payload: res.data,
		})
	} catch (err) {
		if (err.response.status === 401) {
			await dispatch(refreshToken())
			if (getState().auth.token)
				await dispatch(
					createQuiz({
						title,
						description,
						section,
						category,
						image_url,
					})
				)
		} else {
			if (err.response)
				dispatch(addError(err.response.data, err.response.status))

			dispatch({ type: CREATE_QUIZ_FAIL })
		}
	}
}

export const updateQuizData = (author_slug, quiz_slug, data) => async (
	dispatch,
	getState
) => {
	try {
		const config = getAccessToken(getState)
		config['headers']['Content-Type'] = 'multipart/form-data'

		let body = new FormData()

		for (const field in data) body.append(field.toString(), data[field])

		const res = await axios.patch(
			`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/`,
			body,
			config
		)

		dispatch({
			type: UPDATE_QUIZ,
			payload: res.data,
		})
	} catch (err) {
		if (err.response.status === 401) {
			await dispatch(refreshToken())
			if (getState().auth.token)
				await dispatch(updateQuizData(author_slug, quiz_slug, data))
		} else if (err.response)
			dispatch(addError(err.response.data, err.response.status))
	}
}

export const updateQuizQuestions = (author_slug, quiz_slug, data) => async (
	dispatch,
	getState
) => {
	try {
		const body = JSON.stringify(data)

		const config = getAccessToken(getState)

		await axios.put(
			`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/questions/update/`,
			body,
			config
		)
	} catch (err) {
		if (err.response.status === 401) {
			await dispatch(refreshToken())
			if (getState().auth.token)
				await dispatch(
					updateQuizQuestions(author_slug, quiz_slug, data)
				)
		} else if (err.response)
			dispatch(addError(err.response.data, err.response.status))
	}
}

export const deleteQuiz = (author_slug, quiz_slug) => async (
	dispatch,
	getState
) => {
	try {
		const config = getAccessToken(getState)

		await axios.delete(
			`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/`,
			config
		)
		dispatch({
			type: DELETE_QUIZ,
			payload: quiz_slug,
		})
	} catch (err) {
		if (err.response.status === 401) {
			await dispatch(refreshToken())
			if (getState().auth.token)
				await dispatch(deleteQuiz(author_slug, quiz_slug))
		}
	}
}
