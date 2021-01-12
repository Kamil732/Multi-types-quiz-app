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
} from './types'

import { addError } from './errors'
import getAccessToken from '../../helpers/getAccessToken'

export const refreshToken = () => async (dispatch, getState) => {
    const config = getAccessToken(getState)

    try {
        const refresh = getState().auth.refresh
        const body = refresh ? JSON.stringify({ refresh }) : {}

        const res = await axios.post('http://192.168.1.31:8000/api/accounts/login/refresh/', body, config)

        dispatch({
            type: TOKEN_REFRESH,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        })
    }
}

export const loadUser = () => async (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });

    const config = getAccessToken(getState)

    try {
        const res = await axios.get('http://192.168.1.31:8000/api/accounts/current/', config)

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        })
    } catch (err) {
        await dispatch(refreshToken())
        if (getState().auth.token)
            await dispatch(loadUser())
    }
}

export const login = (email, password) => async dispatch => {
    const body = JSON.stringify({ email, password })

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': 'pl',
        }
    };

    try {
        const res = await axios.post('http://192.168.1.31:8000/api/accounts/login/', body, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (err) {
        if (err.response) dispatch(addError(err.response.data, err.response.status))

        dispatch({
            type: LOGIN_FAIL,
        })
    }
}

export const signUp = ({ email, username, password, password2 }) => async dispatch => {
    const body = JSON.stringify({ email, username, password, password2 })

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': 'pl',
        }
    };

    try {
        await axios.post('http://192.168.1.31:8000/api/accounts/signup/', body, config)

        dispatch({
            type: SIGNUP_SUCCESS,
        })

        dispatch(login(email, password))
    } catch (err) {
        if (err.response) dispatch(addError(err.response.data, err.response.status))

        dispatch({
            type: SIGNUP_FAIL,
        })
    }
}

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT,
    })
}