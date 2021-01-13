import {
    ADD_ERROR,
    CLEAR_ERRORS,
    REMOVE_ERROR
} from '../actions/types'

const initialState = {
    messages: {},
    status: null,
}

// eslint-disable-next-line
export default function(state=initialState, action) {
    switch(action.type) {
        case ADD_ERROR:
            return {
                messages: action.payload.messages,
                status: action.payload.status,
            }
        case REMOVE_ERROR:
            // const {action.payload, ...state.messages} = state.messages
            delete state.messages[action.payload]

            return state
        case CLEAR_ERRORS:
            return initialState
        default:
            return state
    }
}