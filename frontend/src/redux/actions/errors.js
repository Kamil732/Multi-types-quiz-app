import {
    ADD_ERROR,
    CLEAR_ERRORS,
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

export const clearErrors = () => dispatch => {
    dispatch({
        type: CLEAR_ERRORS,
    })
}