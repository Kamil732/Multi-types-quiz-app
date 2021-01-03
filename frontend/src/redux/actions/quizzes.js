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

export const getQuizzes = (search='', url='') => async (dispatch, getState) => {
    dispatch({ type: QUIZZES_LOADING })

    // config['headers'] = Object.assign(config.headers, extraConfig)
    const config = getAccessToken(getState)

    try {
        const URL = url ? url + search : `http://192.168.1.31:8000/api/quizzes/${search}`
        const res = await axios.get(URL, config)

        dispatch({
            type: GET_QUIZZES,
            payload: res.data,
        })
    } catch (err) {
        dispatch({
            type: QUIZZES_ERROR,
        })
    }
}

export const getCategorySection = () => async dispatch => {
    dispatch({ type: CATEGORY_SECTION_LOADING })

    try {
        const categories = await axios.get('http://192.168.1.31:8000/api/categories/')
        const sections = await axios.get('http://192.168.1.31:8000/api/sections/')

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

        await axios.post('http://192.168.1.31:8000/api/quizzes/', body, config)
    } catch (err) {
        if (err.response) dispatch(addError(err.response.data, err.response.status))
    }
}