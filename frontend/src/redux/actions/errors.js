import {
    ADD_ERROR,
    REMOVE_ERROR,
    CLEAR_ERRORS
} from './types'

export const addError = (messages, status) => dispatch => {
    dispatch({
        type: ADD_ERROR,
        payload: {
            messages,
            status,
        }
    })
}

export const removeError = name => dispatch => {
    dispatch({
        type: REMOVE_ERROR,
        payload: name,
    })
}

export const clearErrors = () => dispatch => {
    dispatch({
        type: CLEAR_ERRORS,
    })
}