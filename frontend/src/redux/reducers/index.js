import { combineReducers } from 'redux'

import quizzes from './quizzes'
import auth from './auth'
import errors from './errors'

export default combineReducers({
    auth,
    quizzes,
    errors,
})