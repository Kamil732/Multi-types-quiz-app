import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import PrivateRoute from '../../../common/PrivateRoute'
import Create from '../../../containers/quizzes/panel/Create'
import Dashboard from '../../../containers/quizzes/panel/Dashboard'
import QuizDetail from '../../../containers/quizzes/panel/QuizDetail'

function Routes() {
    return (
        <>
            <Switch>
                <PrivateRoute exact path="/panel/create-quiz" component={Create} />
                <PrivateRoute exact path="/panel/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/panel/dashboard/:quiz_slug" component={QuizDetail} />

                <Redirect to="/not-found" />
            </Switch>
        </>
    )
}

export default Routes