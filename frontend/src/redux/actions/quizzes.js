import axios from 'axios'
import {
    CATEGORY_SECTION_ERROR,
    CATEGORY_SECTION_LOADING,
    GET_CATEGORY_SECTION,
    GET_QUIZZES,
    QUIZZES_ERROR,
    QUIZZES_LOADING
} from './types'

import { addError } from './errors'
import getAccessToken from '../../helpers/getAccessToken'
import { refreshToken } from './auth'

export const getQuizzes = (search='', url='') => async (dispatch, getState) => {
    dispatch({ type: QUIZZES_LOADING })

    const config = getAccessToken(getState)

    try {
        const URL = url ? url + search : `${process.env.REACT_APP_API_URL}/quizzes/${search}`
        const res = await axios.get(URL, config)

        dispatch({
            type: GET_QUIZZES,
            payload: res.data,
        })
    } catch (err) {
        await dispatch(refreshToken())
        if (getState().auth.token)
            await dispatch(getQuizzes())
        else
            dispatch({
                type: QUIZZES_ERROR,
            })
    }
}

export const getCategorySection = () => async dispatch => {
    dispatch({ type: CATEGORY_SECTION_LOADING })

    try {
        const categories = await axios.get(`${process.env.REACT_APP_API_URL}/categories/`)
        const sections = await axios.get(`${process.env.REACT_APP_API_URL}/sections/`)

        const res = await Promise.all([
            sections.data,
            categories.data,
        ])

        dispatch({
            type: GET_CATEGORY_SECTION,
            payload: {
                sections: res[0],
                categories: res[1],
            }
        })
    } catch (err) {
        dispatch({
            type: CATEGORY_SECTION_ERROR,
        })
    }
}

export const createQuiz = ({ title, description, section, category, image_url }) => async (dispatch, getState) => {
    // dispatch(clearErrors())

    try {
        const body = JSON.stringify({ title, description, section, category, image_url })

        const config = getAccessToken(getState)

        await axios.post(`${process.env.REACT_APP_API_URL}/quizzes/`, body, config)
    } catch (err) {
        if (err.response) dispatch(addError(err.response.data, err.response.status))
    }
}