import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    TOKEN_REFRESH,
    USER_UPDATE,
} from '../actions/types'

const initialState = {
    token: localStorage.getItem('token'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    loading: null,
    user: {},
}

// eslint-disable-next-line
export default function(state=initialState, action) {
    switch(action.type) {
        case USER_LOADING:
            return {
                ...state,
                loading: true,
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.access)
            localStorage.setItem('refresh', action.payload.refresh)
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                token: action.payload.access,
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                loading: true,
            }
        case AUTH_ERROR:
        case SIGNUP_FAIL:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            return {
                ...state,
                refresh: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: {},
            }
        case TOKEN_REFRESH:
            localStorage.setItem('token', action.payload.access)
            return {
                ...state,
                token: action.payload.access,
            }
        case USER_UPDATE:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                }
            }
        default:
            return state
    }
}